# PLAN-TANSTACK-QUERY.md — Adopción de TanStack Query en el frontend

> Complemento de [`PLAN.md`](./PLAN.md) y [`PLAN-FASE7-POLISH.md`](./PLAN-FASE7-POLISH.md).
> Este documento cubre la migración incremental de la capa de datos del frontend
> a **@tanstack/react-query**: **no se ha implementado nada de lo que sigue**.
> Referencias a `DESIGN.md`/`DECISIONES.md` usan el mismo formato que el resto de
> `docs/rediseño/`. El objetivo es que un agente pueda ejecutarlo fase por fase
> sin decisiones abiertas.

## Origen

Petición del dueño (20 jul 2026): evaluar TanStack Query para caché y mejorar la
experiencia del front. Diagnóstico aprobado:

1. **No hay caché de cliente.** Cada navegación (Home → `/noticias` → Home)
   vuelve a pedir todo y reaparecen los skeletons, aunque el backend ya cachea
   los listados 5 min en Redis (`cache_page(CACHE_TTL)` en `noticias/views.py`).
2. **`useRedesSociales` reinventa el caché a mano** con un `sharedPromise` en
   memoria (`src/hooks/useRedesSociales.js:14-26`): dedup + caché artesanal para
   un solo caso.
3. **Boilerplate del flag `cancelled`** repetido en ~8 páginas + `useHomeData`.
4. **Paginación con salto a skeleton**: `NewsPage`/`SearchResultsPage` descartan
   la lista previa y muestran skeleton en cada cambio de página/filtro.
5. **Sin refetch en foco, sin reintentos, sin prefetch** al hacer hover.

Es un sitio de contenido, mayormente lectura, con datos que cambian poco: caso
de uso ideal para TanStack Query. La adopción es **incremental** — ambos
patrones conviven y se migra pantalla por pantalla.

## Estado actual verificado

### Patrón de fetching

Cada página repite la misma tríada manual (`src/pages/NewsPage/NewsPage.jsx:19-38`,
`src/pages/SearchPage/SearchResultsPage.jsx:28-48`, etc.):

```js
const [state, setState] = useState({ loading, results, count, next, previous, error });
useEffect(() => {
  let cancelled = false;
  setState((prev) => ({ ...prev, loading: true }));
  getX(params).then((res) => { if (!cancelled) setState({ loading: false, ...res }); });
  return () => { cancelled = true; };
}, [deps]);
```

Las páginas de detalle (`NewsDetailPage`, `EventsDetailPage`,
`InterviewDetailPage`) siguen una variante con `async`/`try-catch` dentro del
`useEffect` y estados separados (`noticia`/`noticias`/`loadError`).

### Contrato de `src/services/api.js` (el punto de fricción)

Las funciones de listado **no lanzan**: envuelven la respuesta en
`normalizeListResponse` y devuelven `{ results, count, next, previous, error }`,
tragando la excepción (`getNoticias`, `getEvents`, `getInterview`, `getTags`,
`getGaleria`, `getBusqueda`, `getRedesSociales`, `getAnunciosByUbicacion`).
TanStack Query espera `queryFn` que **hagan `throw`** en fallo y **devuelvan los
datos** (no un sobre con `error`). Esta es la brecha principal a resolver (ver
Gate #1).

Quirks confirmados que hay que respetar al migrar:

- `getNoticia(slug)` usa `axios.get` crudo con `withCredentials: true` y **sí
  lanza** (devuelve `.data`). No pasa por el interceptor de `api`.
- `getInterviewBySlug(slug)` **traga** el error y devuelve `undefined`; retorna
  `.data`.
- `getEventBySlug(slug)` devuelve **la respuesta axios completa** (no `.data`),
  por eso `EventsDetailPage.jsx:34` hace `res.data`. Inconsistente con los otros
  dos. Al migrar, uniformar a devolver el objeto de datos.
- `getComments(id)` devuelve un **array crudo** (`.data`), no la forma paginada.

### `useHomeData` (mejor candidato del piloto)

`src/hooks/useHomeData.js` ya separa el estado por módulo
(`heroNews`, `events`, `interviews`, `gallery`, `ads`), cada uno
`{ loading, data, error }`, disparando 8 peticiones. Es el refactor de Fase 7
§C; TanStack Query lo simplifica a varios `useQuery` independientes conservando
la misma granularidad de skeletons.

### Bug latente de comentarios (se resuelve gratis con mutation)

`NewsDetailPage.jsx` mantiene un estado `refresh` que togglea al enviar un
comentario (`onSubmit` → `setRefresh`), pero `<Comments id=… />`
(`src/components/features/Comments.jsx`) **solo recibe `id`**, no `refresh`, y su
`useEffect` depende solo de `[id]`. Es decir, **la lista de comentarios no se
recarga tras comentar**. Migrar a `useMutation` + `invalidateQueries(['comments', id])`
lo corrige limpiamente y elimina el `refresh` muerto.

### Dependencias, build y calidad

- `package.json` **no incluye** `@tanstack/react-query`. Hay que agregarlo con
  **pnpm** (único gestor, `DECISIONES.md` #2). No usar `npm install`.
- Existe runner de tests: `"test": "vitest run"` y `vitest` en devDeps.
- `pnpm run lint` **falla con errores preexistentes** (74 según Fase 7). La
  definición de terminado de este plan **no** exige lint global limpio; solo que
  los archivos tocados aquí no agreguen errores nuevos.
- `App.jsx` monta `AuthProvider` pero **no** hay `QueryClientProvider`.
  `CartProvider` está dormido (`DECISIONES.md` #3) — no se toca.

## Gate de decisiones (cerradas con recomendación)

Estas quedan **resueltas** para no bloquear la ejecución; si el dueño no objeta,
se implementan tal cual.

1. **Adaptador vs. refactor de `api.js`.** → **Adaptador (Opción A).** Se crea
   una capa nueva de `queryFn` en `src/queries/` que llama a las funciones
   existentes de `api.js` y hace `throw` si viene `res.error`. `api.js` queda casi
   intacto (menos superficie, menos riesgo). Un refactor que haga lanzar a
   `api.js` directamente queda fuera de alcance.
2. **`staleTime` por defecto.** → **5 minutos**, alineado con el `cache_page` del
   backend. `gcTime` (antes `cacheTime`) 10 min. Overrides por query donde tenga
   sentido (detalle más largo, búsqueda más corto).
3. **`refetchOnWindowFocus`.** → **`false`** global. Es contenido editorial, no un
   dashboard; el refetch al enfocar sería ruido. Se puede activar puntualmente.
4. **Reintentos.** → **1 retry** en queries (default de la librería es 3, se baja),
   **0** en mutations.
5. **Devtools.** → `@tanstack/react-query-devtools` **solo en dev**
   (`import.meta.env.DEV`), fuera del bundle de producción vía import dinámico.
6. **Paginación.** → `placeholderData: keepPreviousData` en listados con `page`,
   para no vaciar la vista al cambiar de página/filtro (mantener contenido con
   `aria-busy`, coherente con Fase 7 §C).
7. **Prefetch.** → `queryClient.prefetchQuery` on hover/focus de las tarjetas de
   noticia/evento/entrevista. Alcance mínimo; no prefetch masivo.
8. **`normalizeListResponse`.** → **se conserva** dentro de `api.js`; los
   `queryFn` reciben ya el objeto normalizado y devuelven `res` (sin el campo
   `error`) tras validar. No duplicar la normalización en la capa de queries.

## Convención de query keys

Definir en `src/queries/keys.js` factories serializables (arrays), nunca strings
concatenados:

```js
export const qk = {
  noticias: {
    list: (params = {}) => ["noticias", "list", params],
    detail: (slug) => ["noticias", "detail", slug],
  },
  eventos: {
    list: (params = {}) => ["eventos", "list", params],
    detail: (slug) => ["eventos", "detail", slug],
  },
  entrevistas: {
    list: (params = {}) => ["entrevistas", "list", params],
    detail: (slug) => ["entrevistas", "detail", slug],
  },
  tags: () => ["tags"],
  galeria: (params = {}) => ["galeria", params],
  busqueda: (q, params = {}) => ["busqueda", q, params],
  anuncios: (ubicacion) => ["anuncios", ubicacion],
  redes: () => ["redes-sociales"],
  comments: (noticiaId) => ["comments", noticiaId],
  home: {
    heroNews: () => ["home", "heroNews"],
  },
};
```

Regla: el objeto `params` va tal cual (incluye `page`, `tag`, `proximos`,
`destacado`, etc.). React Query hashea deep-equal, así que dos objetos con las
mismas claves comparten caché.

## F0 — Setup, provider y baseline

**Meta:** dejar la infraestructura montada sin migrar aún ninguna pantalla.

Tareas:

1. `pnpm add @tanstack/react-query` y
   `pnpm add -D @tanstack/react-query-devtools`. Verificar que
   `pnpm-lock.yaml` se actualiza (no generar `package-lock.json`).
2. Crear `src/lib/queryClient.js`:
   ```js
   import { QueryClient } from "@tanstack/react-query";
   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 5 * 60 * 1000,
         gcTime: 10 * 60 * 1000,
         retry: 1,
         refetchOnWindowFocus: false,
       },
       mutations: { retry: 0 },
     },
   });
   ```
3. Envolver el árbol en `src/App.jsx`: `QueryClientProvider` **por fuera** de
   `AuthProvider` (o entre `BrowserRouter` y `AuthProvider`), para que
   AuthContext pueda usar queries a futuro. Montar Devtools solo en dev con
   import dinámico para no pesar producción.
4. Crear `src/queries/keys.js` (ver convención arriba) y un
   `src/queries/index.js` vacío (se irá poblando por fase).
5. Registrar tamaños de chunks del `pnpm run build` **antes** de migrar, para
   comparar el peso que agrega la librería (~12–13 kB gzip esperado).

**Archivos:** `package.json`, `pnpm-lock.yaml`, `src/lib/queryClient.js`,
`src/queries/keys.js`, `src/queries/index.js`, `src/App.jsx`.

**Definición de terminado:** app arranca con el provider montado, Devtools
visibles solo en dev, `pnpm run build` pasa, baseline de chunks registrado. Sin
cambios de comportamiento todavía.

## F1 — Capa de `queryFn` que lanzan (adaptador)

**Meta:** exponer fetchers compatibles con React Query sin tocar la lógica de
`api.js`.

Tareas:

1. Crear helper `src/queries/unwrapList.js`:
   ```js
   // Convierte el sobre {results, error, ...} de api.js en datos o excepción.
   export const unwrapList = (res) => {
     if (res?.error) throw res.error;
     return res; // { results, count, next, previous }
   };
   ```
2. Crear `src/queries/fetchers.js` con funciones `queryFn`-ready que envuelven
   `api.js`:
   - `fetchNoticias(params)` → `unwrapList(await getNoticias(params))`
   - `fetchEventos`, `fetchEntrevistas`, `fetchTags`, `fetchGaleria`,
     `fetchAnuncios(ubicacion)`, `fetchRedes`
   - `fetchBusqueda(q, params)` → si `q` vacío, la query se deshabilita con
     `enabled` (no llamar aquí).
   - Detalles (lanzan siempre, devuelven el objeto de datos):
     - `fetchNoticia(slug)` → usa `getNoticia` (ya lanza).
     - `fetchEvento(slug)` → `(await getEventBySlug(slug))?.data` (normaliza el
       quirk del response completo).
     - `fetchEntrevista(slug)` → `getInterviewBySlug` **modificado o envuelto**
       para lanzar en vez de tragar (aceptable tocar esta función puntual, o
       envolver con un `axios` directo como `getNoticia`).
   - `fetchComments(noticiaId)` → `getComments` (ya devuelve array).
3. No mover aún ninguna página; esta fase solo crea y exporta los fetchers.
4. Añadir un test mínimo en Vitest para `unwrapList` (lanza con `error`,
   devuelve datos sin `error`).

**Archivos:** `src/queries/unwrapList.js`, `src/queries/fetchers.js`,
`src/services/api.js` (solo `getInterviewBySlug` si se decide hacerlo lanzar),
`src/queries/__tests__/unwrapList.test.js`.

**Definición de terminado:** fetchers importables, `unwrapList` testeado,
`pnpm run build` verde. Comportamiento de la app sin cambios (nada los usa aún).

## F2 — Piloto: home (`useHomeData`)

**Meta:** validar caché, dedup y skeletons por módulo en la pantalla más
beneficiada, sin cambiar la UI de `MainPage`.

Tareas:

1. Reescribir `src/hooks/useHomeData.js` con `useQuery` por módulo, **manteniendo
   exactamente la forma de retorno actual** (`{ heroNews, events, interviews,
   gallery, ads }`, cada uno `{ loading, data, error }`) para no tocar
   `MainPage.jsx`:
   - `heroNews`: una sola `useQuery` con key `qk.home.heroNews()` cuyo `queryFn`
     hace el `Promise.all([fetchNoticias({destacado:true}), fetchNoticias()])` y
     devuelve `{ heroSlides, heroSupportItems, newsListItems }` (misma lógica de
     derivación que hoy `useHomeData.js:37-66`). Mapear `isLoading`→`loading`,
     `data`→`data`, `error`→`error`.
   - `events`: `useQuery(qk.eventos.list({proximos:true}), …)` → `data.results`.
   - `interviews`: `useQuery(qk.entrevistas.list(), …)` → `data.results.slice(0,3)`.
   - `gallery`: `useQuery(qk.galeria({limit:6}), …)` → `data.results`. Propagar
     su `error` (Fase 7 §C pedía `galeriaError`; aquí sale gratis).
   - `ads`: `useQuery` que hace el `Promise.all` de las 3 ubicaciones y devuelve
     `{ betweenNewsEvents, betweenEventsInterviews, afterInterviews }`.
2. Eliminar el flag `cancelled` y el `useEffect` manual (React Query cancela y
   deduplica solo).
3. Verificar que `MainPage.jsx` no requiere cambios (misma API del hook). Si
   accede a algún campo extra, ajustar solo el mapeo dentro del hook.

**Archivos:** `src/hooks/useHomeData.js` (+ `MainPage.jsx` solo si el mapeo lo
exige).

**Criterios de aceptación:**

- Home carga igual visualmente; cada skeleton se sustituye cuando su módulo
  resuelve (paridad con Fase 7 §C).
- Navegar fuera y volver al home **no** re-muestra skeletons dentro de
  `staleTime` (se sirve de caché y revalida en background).
- Un fallo de galería/anuncios no bloquea el resto (errores por módulo).
- `pnpm run build` verde; sin errores de lint nuevos en el archivo tocado.

## F3 — Listados con paginación fluida

**Meta:** migrar las páginas de listado y suavizar paginación/filtros con
`keepPreviousData`.

Pantallas: `NewsPage`, `EventsPage`, `InterviewPage`, `CulturaPage`,
`SearchResultsPage`.

Patrón de referencia (usar `NewsPage` como ejemplo canónico):

```js
const tag = searchParams.get("tag");
const page = Number(searchParams.get("page")) || 1;

const params = { tag: tag || undefined, page };
const { data, isPending, isError, isPlaceholderData } = useQuery({
  queryKey: qk.noticias.list(params),
  queryFn: () => fetchNoticias(params),
  placeholderData: keepPreviousData,
});
const tagsQuery = useQuery({ queryKey: qk.tags(), queryFn: fetchTags });
```

Tareas:

1. Reemplazar el `useState`/`useEffect`/`cancelled` de cada página por `useQuery`.
2. Mapear estados a los componentes existentes de UI:
   - `isPending` → skeleton (`NewsListSkeleton`, `AgendaListSkeleton`,
     `InterviewGridSkeleton`, `GallerySkeleton`, `SearchResultsSkeleton`).
   - `isError` → `ErrorState`.
   - `data.results.length === 0` → `EmptyState`.
   - `data.next`/`data.previous` → `PaginationControls`.
3. Usar `isPlaceholderData` para poner `aria-busy` en la lista mientras llega la
   página nueva, en vez de vaciar (coherente con Fase 7 §C: skeleton completo
   solo en carga inicial, `aria-busy` en cambios rápidos).
4. `SearchResultsPage`: `enabled: Boolean(query)` para no llamar con `q` vacío;
   `staleTime` más corto (p. ej. 30 s) porque la búsqueda es más volátil.
5. `NewsPage` tags: query aparte con `qk.tags()`, `staleTime` largo (cambian
   poco).
6. Conservar la lógica de `useSearchParams`/`updateParams` intacta (la URL sigue
   siendo la fuente de verdad de `tag`/`page`/`q`).

**Archivos:** `src/pages/NewsPage/NewsPage.jsx`,
`src/pages/EventsPage/EventsPage.jsx`,
`src/pages/InterviewPage/InterviewPage.jsx`,
`src/pages/CulturaPage/CulturaPage.jsx`,
`src/pages/SearchPage/SearchResultsPage.jsx`.

**Criterios de aceptación:**

- Cambiar de página mantiene la lista anterior visible con `aria-busy` (sin
  parpadeo a skeleton).
- Volver a un listado ya visitado es instantáneo (caché) y revalida en fondo.
- `EmptyState`/`ErrorState`/skeleton siguen siendo estados distinguibles.
- Búsqueda no dispara request con `q` vacío.

## F4 — Detalles + prefetch on hover

**Meta:** migrar las páginas de detalle y precargar el detalle al pasar el mouse
sobre las tarjetas.

Pantallas: `NewsDetailPage`, `EventsDetailPage`, `InterviewDetailPage`.

Tareas:

1. En cada detalle, dos `useQuery`:
   - principal: `qk.<tipo>.detail(slug)` con `fetch<Tipo>(slug)`.
   - relacionadas: reutiliza `qk.<tipo>.list(params)` (comparte caché con el
     listado si los params coinciden).
2. Mapear a `DetailPageSkeleton type=…` mientras `isPending`, y `ErrorState` en
   `isError` (misma UI actual). Quitar `loadError`/`cancelled`.
3. `NewsDetailPage`: eliminar el estado `refresh` (queda obsoleto tras F5).
4. Prefetch: crear helper `usePrefetchDetail()` o exponer `queryClient` para que
   las tarjetas (`NewsList`, `EventCards`, `InterviewGrid`) llamen
   `queryClient.prefetchQuery({ queryKey: qk.noticias.detail(slug), queryFn })`
   en `onMouseEnter`/`onFocus`. Alcance mínimo, sin prefetch en scroll.
5. Uniformar el quirk de `getEventBySlug` vía `fetchEvento` (ya normalizado en
   F1); el componente deja de hacer `res.data`.

**Archivos:** los tres `*DetailPage.jsx`, y las tarjetas
`src/components/content/{NewsList,EventCards,InterviewGrid}.jsx` para el prefetch.

**Criterios de aceptación:**

- Abrir un detalle tras hover/focus es casi instantáneo (datos precacheados).
- Lista↔detalle comparten caché de relacionadas sin doble fetch.
- Detalle inexistente/404 muestra `ErrorState`, no queda colgado en skeleton.

## F5 — Mutations: comentarios y limpieza de `useRedesSociales`

**Meta:** pasar escrituras y el caché artesanal a React Query.

Tareas:

1. **Comentarios** (`src/components/features/Comments.jsx`):
   - `useQuery({ queryKey: qk.comments(id), queryFn: () => fetchComments(id), enabled: Boolean(id) })`.
   - En `NewsDetailPage`, `useMutation` con `postComment`, y en `onSuccess`
     `queryClient.invalidateQueries({ queryKey: qk.comments(id) })`.
   - Eliminar el estado `refresh` de `NewsDetailPage` (corrige el bug latente:
     hoy la lista no se refresca tras comentar).
   - Opcional: `onMutate` optimista (agregar el comentario y hacer rollback en
     error). Solo si el tiempo lo permite; no es requisito.
2. **`useRedesSociales`** (`src/hooks/useRedesSociales.js`):
   - Reemplazar el hack `sharedPromise` por
     `useQuery({ queryKey: qk.redes(), queryFn: fetchRedes, staleTime: 30*60*1000 })`.
   - Mantener `FALLBACK_REDES` como `placeholderData`/`initialData` para que
     Header/Footer/Comunidad nunca queden sin íconos mientras carga o si falla.
   - React Query deduplica los 3 montajes (Header/Footer/CommunityStats)
     automáticamente; se borra la promesa compartida manual.
3. **Tracking de clics** (`trackAnuncioClick`, `trackFranjaClick`): dejar como
   está (fire-and-forget, sin caché). Opcionalmente envolver en `useMutation`
   sin invalidación, pero no es prioridad.

**Archivos:** `src/components/features/Comments.jsx`,
`src/pages/NewsPage/NewsDetailPage.jsx`, `src/hooks/useRedesSociales.js`.

**Criterios de aceptación:**

- Tras enviar un comentario, la lista se actualiza sin recargar la página.
- Los íconos sociales nunca desaparecen durante carga/fallo (fallback intacto).
- Un solo request de redes aunque lo monten 3 componentes a la vez.

## F6 — Limpieza y afinado

**Meta:** quitar código muerto y afinar tiempos de caché.

Tareas:

1. Borrar helpers/estados que quedaron sin uso: flag `cancelled` residual,
   `refresh` de comentarios, `sharedPromise`.
2. Revisar `staleTime` por query con datos reales: detalles pueden ir más largo,
   búsqueda corto, listados 5 min (alineado al backend).
3. Confirmar que `emptyListResult`/`normalizeListResponse` siguen usados por los
   fetchers (no borrarlos: son la base del `unwrap`).
4. Verificar que ninguna página activa mantenga el patrón `useEffect`+fetch
   viejo (grep de `getNoticias`/`getEvents`/etc. fuera de `src/queries/`).
5. Registrar tamaño de chunks final vs. baseline de F0.

**Archivos:** varios (limpieza puntual).

**Definición de terminado:** sin código de fetching manual en páginas migradas,
tiempos de caché documentados, delta de bundle registrado.

## F7 — QA final

Verificación manual reproducible en dark/light y 390×844, 414×896, 1440×900:

- Navegación repetida no re-muestra skeletons dentro de `staleTime`.
- Paginación/filtros mantienen contenido con `aria-busy`, sin parpadeo.
- Detalle tras hover abre casi instantáneo.
- Comentario nuevo aparece sin refrescar.
- Fallos por módulo aislados (galería/anuncios no tumban el home).
- `pnpm run build` verde; Devtools ausentes en el bundle de producción.

## Orden de implementación

1. **F0** — setup, provider, baseline de chunks.
2. **F1** — capa de fetchers + `unwrapList` (con test).
3. **F2** — piloto home (`useHomeData`).
4. **F3** — listados con `keepPreviousData`.
5. **F4** — detalles + prefetch.
6. **F5** — mutations (comentarios) + `useRedesSociales`.
7. **F6** — limpieza y afinado.
8. **F7** — QA final.

Cada fase es un punto de parada válido: la app queda funcional aunque conviva el
patrón viejo con el nuevo.

## Commits recomendados

1. `chore: agrega tanstack query y monta el provider`
2. `feat: agrega capa de fetchers y unwrapList para react-query`
3. `refactor: migra el home a useQuery por módulo`
4. `refactor: migra listados a react-query con keepPreviousData`
5. `feat: migra detalles a react-query y agrega prefetch on hover`
6. `refactor: pasa comentarios y redes sociales a react-query`
7. `chore: limpia fetching manual y afina staleTime`

## Checklist de listo

### Funcional
- [ ] Provider montado; Devtools solo en dev.
- [ ] Home, listados, detalles, búsqueda y cultura sirven de caché al revisitar.
- [ ] Paginación/filtros sin parpadeo (`keepPreviousData` + `aria-busy`).
- [ ] Comentario nuevo refresca la lista sin recargar página.
- [ ] Redes sociales con fallback intacto y un solo request compartido.
- [ ] Loading, empty y error siguen distinguibles por pantalla y por módulo.

### Calidad y rendimiento
- [ ] `unwrapList` testeado en Vitest.
- [ ] `pnpm run build` verde; delta de bundle registrado vs. baseline F0.
- [ ] Sin errores de lint **nuevos** en archivos tocados.
- [ ] Sin fetching manual (`useEffect`+`cancelled`) en páginas migradas.
- [ ] Devtools fuera del bundle de producción.
- [ ] pnpm como único gestor (`pnpm-lock.yaml` actualizado, sin `package-lock.json`).
