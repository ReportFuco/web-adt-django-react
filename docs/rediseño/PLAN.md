# PLAN.md — Rediseño del frontend "Adictos al Techno"

> Plan de ejecución por fases para llevar el frontend actual al diseño del mock
> ([`docs/mocks/index.html`](../mocks/index.html)). Las **reglas y tokens** viven
> en [`DESIGN.md`](./DESIGN.md) — este documento define *el orden, el alcance y
> los criterios de aceptación* de cada paso. Un agente debe poder tomar una fase,
> leer la sección de DESIGN referenciada, y ejecutarla de forma aislada. El
> contraste que originó esta versión está en [`AUDITORIA.md`](./AUDITORIA.md).

## Cómo usar este plan

- La precedencia para resolver discrepancias es:
  **decisiones aprobadas y registradas aquí → DESIGN.md → composición del mock
  → frontend actual**. El mock define estructura y ritmo, no contratos de datos
  ni comportamiento de producción.
- Las fases de decisión, contratos y fundaciones son **secuenciales**. Después,
  los módulos pueden avanzar en paralelo solo cuando sus dependencias y contratos
  estén marcados como resueltos.
- No se abre una fase dependiente hasta que la anterior cumple su "Definición de
  terminado". Una decisión abierta que afecte una fase la bloquea; no se resuelve
  por suposición durante la implementación.
- Cada tarea referencia el `§` de DESIGN.md que la gobierna.
- Commits pequeños y por tarea. No mezclar migración de tokens con lógica nueva.
- Cada PR adjunta evidencia proporcional a su alcance: comandos ejecutados,
  capturas dark/light en los viewports acordados y pruebas de interacción.

### Desviaciones conocidas del mock

- El rojo original fue descartado: manda la señal neutra de DESIGN §2.
- El banner superior de “prototipo” no se implementa en producción.
- Los retratos de entrevistas **sí deben renderizarse**. En el HTML del mock el
  enlace `.media` es inline y la proporción 4/5 no genera caja; es un defecto del
  prototipo, no una decisión visual.
- En producción se prefieren `<img>`/`<picture>` con `alt`, `srcset` y `sizes`;
  los `background-image` del mock no son el contrato semántico ni de rendimiento.
- El menú móvil del mock es solo demostrativo. Producción requiere foco, Escape,
  cierre al navegar y retorno de foco.

---

## Estado actual (auditoría)

| Área | Hoy | Objetivo |
|---|---|---|
| Tipografía | Space Grotesk + Inter | **Archivo** (DESIGN §3) |
| Acento | Ninguno (blanco/negro puro) | **Acento neutro** `--adt-signal`: blanco en oscuro / gris en claro (§2.3) |
| Tokens | `--bg/--text/...` en `index.css`, **no** en Tailwind `@theme` | `--adt-*` + `@theme inline` (§11) |
| Consumo de estilo | Mucho `style={{...}}` inline + helpers `.theme-*`/`.section-shell` | Utilidades Tailwind sobre tokens + componentes UI (§11.2/11.3) |
| Theme toggle | Botón flotante en `App.jsx` | Botón ícono en el **Header** (§9.4) |
| Home | Carrusel de destacados + 3 `section-shell` + calendario + CTA comunidad + `Socialmedia`+`Form`+`SpotifyPlaylist` | Hero editorial + headlines + noticias/eventos/entrevistas + galería + comunidad + contacto (mock) |
| Header/Footer | `Header.jsx` (logo img + marquee + redes), `Footer.jsx` | Reescritos según §9.4/§9.8 |
| Galería | Backend tiene fotos, front **no las muestra** | Módulo `Gallery` (§9.6) |
| Componentes reutilizables | Dispersos, poco compartidos | `src/components/ui/*` (§11.3) |
| Lockfiles | `package-lock.json` **y** `pnpm-lock.yaml` conviven | Elegir uno (ver Fase -1) |

**Fuera de alcance funcional:** store / carrito / checkout / Mercado Pago. Hoy no
están completamente dormidos: `CartProvider` sigue montado, el Header muestra el
carrito y el home consulta productos que no renderiza. Si se confirma este alcance,
se retiran esos consumidores de ejecución, pero se conservan los archivos de tienda
y no se reactiva ninguna ruta.

---

## Fase -1 — Gate de decisiones y baseline

**Meta:** eliminar decisiones que hoy cambian contratos, rutas o alcance antes de
escribir componentes.

Tareas:
1. Resolver y registrar las decisiones abiertas del final de este documento:
   fuente, gestor, tienda, auth en Header, búsqueda, Cultura/Galería, contacto,
   citas/créditos, publicidad, métricas, legales y URLs.
2. Confirmar la jerarquía de referencia y aprobar las desviaciones conocidas del
   mock listadas arriba.
3. Inventariar rutas y controles actuales con decisión `conservar / adaptar /
   retirar / fuera de alcance`; incluir login/logout, carrito, newsletter, redes,
   legales, búsqueda, comentarios, mapas y Spotify.
4. Definir el contrato de URL pública y SEO: conservar inicialmente
   `/noticias/:id/:slug`, `/eventos/:id/:slug` y `/entrevistas/:slug`, o aprobar
   redirecciones permanentes y canonical antes de cambiar enlaces.
5. Capturar baseline del frontend actual y del mock con datos estables en
   `1440×900`, `1024×768`, `768×1024` y `390×844`, dark y light. Registrar
   navegador, fixture y diferencias aceptadas.
6. Confirmar cómo se levanta el entorno local. El backend requiere variables DB
   y no existe `.env.example`; agregar la documentación/plantilla sin secretos
   antes de exigir checks reproducibles.

**Definición de terminado:** no quedan decisiones bloqueantes para Fases 0–3;
existe baseline reproducible, matriz de alcance y contrato de URLs aprobado.

---

## Fase 0 — Contratos, seguridad y arquitectura de datos

**Meta:** hacer verdaderos los contratos que consumirán los módulos del rediseño.

Tareas:
1. **Contacto:** el modelo actual no tiene `mensaje` ni `asunto`, aunque el mock y
   el formulario actual los envían. Implementar la decisión aprobada (migración,
   serializer, admin y notificación, o retiro explícito de campos). Solo `create`
   puede ser público; `retrieve/list/update/delete` deben requerir admin.
2. **Auth:** corregir y probar la rotación JWT. El frontend debe persistir el
   `refresh` nuevo cuando `ROTATE_REFRESH_TOKENS=True`; no se acepta “preservar”
   el flujo actual sin una prueba de dos renovaciones consecutivas.
3. **Listas:** normalizar servicios a
   `{ results, count, next, previous }` y propagar errores. No convertir un fallo
   en `[]`, porque impide distinguir `empty` de `error`.
4. **Filtros/home:** definir query params o endpoints para `tag`, `destacado`,
   próximos eventos y paginación. “Próximos” excluye eventos pasados aunque la
   propiedad `fecha_hora` tenga fallback histórico.
5. **Galería:** elegir endpoint agregado liviano o documentar agregación cliente,
   orden, límite, deduplicación y costo de aplanar `fotos` anidadas.
6. **Contenido editorial:** decidir campos administrables para cita/extracto de
   entrevista, bajada del hero, tiempo de lectura, `alt` y crédito. No truncar HTML
   rico de forma arbitraria.
7. **Publicidad:** alinear el mock con las tres ubicaciones de home existentes o
   ampliar modelo/admin. No prometer anuncios en listados sin ubicación backend.
8. **Servicios de detalle:** unificar slash final, forma de retorno y manejo 404
   de noticia/evento/entrevista.
9. **Comentarios:** mantenerlos solo en noticias. Evento y entrevista requieren
   una ampliación de modelo que queda fuera de este rediseño salvo aprobación.
10. Añadir pruebas mínimas de contrato para contacto/privacidad, auth refresh,
    paginación/error, filtros, selección de próximos eventos y detalles por slug.

**Definición de terminado:** contratos documentados y probados; un consumidor
puede distinguir loading/empty/error, paginar y construir cada módulo sin inventar
campos. Los cambios de backend acordados tienen migraciones y permisos verificados.

---

## Fase 1 — Fundaciones: tokens, fuente y Tailwind

**Meta:** una única capa de tokens que alimente CSS y utilidades Tailwind. Sin
esto, ninguna fase posterior puede evitar los hex sueltos.

Tareas:
1. Reescribir `src/index.css`: cargar **Archivo**, declarar tokens `--adt-*`
   (dark+light, §2), tokens de espaciado/motion/radio (§4,§5), y el bloque
   `@theme inline` que los expone como utilidades (§11.1).
2. Mantener temporalmente alias de compatibilidad (`--bg: var(--adt-bg)`, etc.)
   para que las pantallas aún no migradas no se rompan. Se eliminan en Fase 6.
3. ~~Decidir gestor de paquetes~~ **Resuelto:** `pnpm` es el único gestor
   (ver `DECISIONES.md` #2). Se borró `package-lock.json`; `CLAUDE.md` y los
   scripts documentados usan `pnpm`.
4. `tailwind.config.js`: en Tailwind 4 el theming es CSS-first; dejar `content`
   correcto y no duplicar tokens en JS.
5. Documentar en un comentario de `index.css` que la fuente de verdad es DESIGN.md.

**Definición de terminado:** el sitio compila; tokens y utilidades tienen una
página/harness que prueba valores calculados en ambos temas. Fuera del cambio de
tipografía aprobado y documentado, no hay cambios visuales accidentales. El
toggle persiste sin flash de tema incorrecto.

---

## Fase 2 — Kit de UI primitivo (`src/components/ui/`)

**Meta:** los "ladrillos" del mock como componentes reutilizables, sin cablear a
datos aún (props + datos de ejemplo / Storybook-lite en una página sandbox
opcional).

Componentes (DESIGN §9, §8):
- `LinkGlyph` — el eslabón de marca SVG (§8).
- `Media` — aspect-ratio + placeholder + `credit` + variante foto (§7).
- `Cta` — variantes `primary`/`ghost` con flecha (§9.1).
- `Tag`, `Kicker`, `MetaRow`, `MetaItem` (§9.2).
- `SectionHead` — kicker + título + link "ver todas" (§9.3).
- `AdSlot` / `SponsoredSlot` (§9.7).

Agregar también `AgendaRow`, `SponsoredSlot` y estados compartidos
`LoadingState`, `EmptyState` y `ErrorState`. Los patrones editoriales reutilizados
por home y listados viven en `src/components/content/`, no bajo `home/`.

El harness de componentes es obligatorio y no entra a producción.

**Definición de terminado:** cada primitivo renderiza en dark/light, responsive,
con foco visible y semántica correcta, consumiendo valores definidos por el
sistema. Pruebas de variantes e interacción, lint y build limpios.

---

## Fase 3 — AppShell, Header, Ticker y Footer

**Meta:** el marco global del sitio (afecta todas las páginas), según §9.4/§9.8.

Tareas:
1. Crear `AppShell` con `Header`, `Ticker`, `main#main`, `Footer`, `skip-link` y
   `<Outlet>`. Definir explícitamente si auth usa el shell completo o una variante.
2. **Header** nuevo: wordmark (`LinkGlyph` + texto, compacto ≤420px), `primary-nav`
   con subrayado señal + `aria-current`, `header-socials` monocromos, botón buscar,
   **theme-toggle movido aquí** (retirar el flotante de `App.jsx`), `nav-toggle`
   accesible ≤860px. Preservar login/logout si así se resolvió en Fase -1. El
   botón de búsqueda solo se incluye si su conducta fue aprobada.
3. **Ticker** (`src/components/ui/Ticker.jsx`): loop + pausa + reduced
   motion; alimentado por `franjaMensaje()` / últimos titulares (§10). Reemplaza el
   `Marquee` de `react-fast-marquee` actual (evaluar quitar la dependencia).
4. **Footer** nuevo (§9.8), solo con rutas y destinos válidos.
5. Mover `ThemeToggle` de `App.jsx` al Header; conservar persistencia en
   `localStorage["adt-theme"]` y `data-theme` en `<html>`.
6. Menú móvil: foco inicial, trampa/gestión de foco cuando corresponda, Escape,
   cierre al navegar/cambiar breakpoint, scroll lock y retorno de foco.
7. Si tienda queda dormida, desmontar `CartProvider`, carrito y fetch de productos
   de la ejecución sin borrar los módulos dormidos.

**Definición de terminado:** Header/Footer nuevos activos en todas las rutas,
menú móvil operable por teclado, tema sin flash conmutable desde el Header, ticker
con datos reales y shell probado al navegar entre rutas.

---

## Fase 4 — Home (`MainPage`) por cortes verticales

**Meta:** recomponer el home con los módulos del mock, cableados a datos reales.

Módulos → componentes (`src/components/home/` para composición exclusiva del
home y `src/components/content/` para patrones reutilizables, DESIGN §9.5/§9.6):
1. `Hero` + `HeroSupport` — 1 historia principal (noticia destacada) + 4 de apoyo.
2. `Headlines` — 3 titulares de agenda/eventos.
3. `AdSlot` billboard entre secciones (usar `getAnunciosByUbicacion`).
4. `content/NewsList` — últimas noticias en filas editoriales.
5. `content/EventCards` — próximos eventos (fecha dominante desde `fecha_hora`, §10).
6. `content/InterviewGrid` — retratos + cita.
7. `Gallery` — fotos del backend (§10) — **contenido nuevo que hoy no se ve**.
8. `CommunityStats` — panel + métricas (cifras manuales configurables).
9. `ContactForm` — POST al contrato resuelto en Fase 0; éxito/error accesibles,
   prevención de doble envío y protección antiabuso acordada.
10. Retirar del home: `NoticiasCarousel`, los `section-shell`, el bloque
    calendario ad-hoc, `Socialmedia`, `Form`, `SpotifyPlaylist` sueltos
    (su función se absorbe en los módulos nuevos: comunidad/contacto/ticker).

Cada módulo define antes de implementarse: fuente, filtros, orden, límite,
fallback, deduplicación y campos visibles. Hero usa una historia principal y
cuatro apoyos sin repetirlos en el siguiente bloque; las citas no se derivan
truncando HTML; la galería no depende accidentalmente de la primera página.

**Definición de terminado:** `/` reproduce la composición aprobada del mock con
datos reales y fixtures reproducibles; loading/empty/error verificables,
dark+light, responsive y a11y (§12). SEO intacto. Hero reserva espacio y es la
única imagen prioritaria; el resto carga diferido sin CLS visible.

---

## Fase 5 — Páginas de sección y detalle

**Meta:** aplicar el sistema a las rutas restantes reutilizando el kit.

- **Listados** `/noticias`, `/eventos`, `/entrevistas`: usar `SectionHead`,
  `NewsList`/`EventCards`/`InterviewGrid`, `agenda-row` para el calendario de
  eventos (§9.6), filtros por tag con `Tag--active`.
- **Detalle** noticia/evento/entrevista: portada tipo hero, `meta-row`, contenido
  rico (mantener `htmlSanitizer` + estilos `.rich-content`), **galería** de fotos
  (`fotos`) y relacionados. `Comments` se conserva solo en noticias.
- **Auth** `/login`, `/register`, `/forgot-password`, `/reset-password`:
  reestilizar con tokens/kit (formularios §9.6).

Conservar las URLs públicas aprobadas, canonical y sitemap; cualquier cambio de
patrón requiere redirect permanente probado. Los filtros deben conservar
paginación y estado en la URL.

**Definición de terminado:** todas las rutas con el nuevo lenguaje; sanitizer,
dos rotaciones consecutivas de auth refresh, permisos, filtros, paginación, 404 y
SEO probados.

---

## Fase 6 — Limpieza, hardening, despliegue y QA

**Meta:** eliminar la deuda transitoria y verificar el conjunto.

Tareas:
1. Quitar alias de compatibilidad (`--bg`, `--surface`…) y helpers legacy
   (`.section-shell`, `.theme-panel*`, `.theme-button*`, `.editorial-*`) una vez
   sin consumidores.
2. Barrer valores visuales fijos en `style={{...}}` → utilidades/tokens. Se
   permiten variables dinámicas documentadas (p. ej. URL de imagen o progreso).
3. Eliminar imports/deps muertas (evaluar `react-fast-marquee` si el ticker propio
   lo reemplaza; `App.css` si quedó vacío).
4. Corregir el sitemap para recorrer todas las páginas de la API y definir qué
   hace el build si la API no está disponible.
5. QA final contra §14 de DESIGN en cada pantalla y viewport baseline: toggle
   dark/light, teclado, reduced-motion, estados de API, 404, auth y formularios.
6. Medir Lighthouse/Web Vitals en home y un detalle: sin regresión grave de LCP,
   CLS o peso de imágenes respecto del presupuesto aprobado en Fase -1.
7. `npm run lint`, pruebas frontend, `npm run build`, tests Django y smoke E2E
   limpios en un entorno documentado.
8. Despliegue gradual con smoke post-deploy y procedimiento de rollback.

**Definición de terminado:** sin tokens legacy ni estilos inline sueltos; build y
pruebas verdes; checklist §14 y evidencia visual cumplidos; sitemap completo,
smoke post-deploy aprobado y rollback documentado.

---

## Mapa: sección del mock → componente → datos → ruta

| Mock | Componente nuevo | Datos backend | Aparece en |
|---|---|---|---|
| Header + wordmark + nav | `layout/Header` | `franjaMensaje` (ticker) | Todas |
| Ticker-strip | `ui/Ticker` | `FranjaSuperior` / titulares | Todas |
| Hero lead + support | `home/Hero`,`home/HeroSupport` | selector aprobado sobre noticias destacadas | `/` |
| Titulares · Agenda | `home/Headlines` | `getEvents` | `/` |
| Ad billboard | `ui/AdSlot` | ubicación home aprobada | `/` |
| Últimas noticias | `content/NewsList` | `getNoticias` paginado | `/`, `/noticias` |
| Próximos eventos (cards) | `content/EventCards` | próximos `getEvents` | `/` |
| Agenda cronológica | `ui/AgendaRow` | `getEvents` (`fechas`) | `/eventos` |
| Voces / entrevistas | `content/InterviewGrid` | contrato cita/extracto resuelto | `/`, `/entrevistas` |
| Galería / Escena | `home/Gallery` | endpoint/selector global aprobado | `/`, detalle |
| Comunidad / stats | `home/CommunityStats` | cifras manuales | `/` |
| Contacto | `home/ContactForm` | `ContactoViewSet` | `/` |
| Footer | `layout/Footer` | — | Todas |

---

## Decisiones (resueltas — ver `DECISIONES.md`)

Todas las decisiones abiertas de esta lista fueron resueltas por el dueño el
19 de julio de 2026. El detalle y el impacto en alcance viven en
[`DECISIONES.md`](./DECISIONES.md); resumen:

1. **Acento y fuente**: signal neutro (ya reflejado en DESIGN §2, sin cambios).
   Fuente **Archivo** confirmada, migra desde Space Grotesk + Inter.
2. **Gestor de paquetes**: **pnpm** (no npm). `package-lock.json` eliminado.
3. **Store/carrito**: **dormido**, confirmado. No se reactiva en este rediseño.
4. **Métricas de comunidad**: **constante editable en el frontend**, sin endpoint.
5. **"Cultura"**: **ruta `/cultura` dedicada**, reutilizando el agregado de fotos
   de la Galería (sin modelo de contenido propio).
6. **Contacto**: **sin `mensaje`/`asunto`** — el formulario nuevo usa los campos
   actuales del backend. Sí se corrige el permiso de `retrieve` (solo admin).
7. **Entrevistas y fotografía**: **se agregan** cita/rol/crédito al backend
   (migración + serializer + admin).
8. **Búsqueda**: **se implementa** — endpoint simple + modal/ruta de resultados.
9. **Auth en el shell**: **icono de cuenta compacto en el Header**.
10. **Publicidad**: **se amplían** las ubicaciones para listados/detalle.
11. **URLs y legales**: **se conservan** las URLs públicas actuales; páginas
    legales estáticas simples se crean; newsletter se retira del footer.
12. **Galería home**: **endpoint agregado liviano** en el backend.

## Riesgos

- **Regresión visual durante la migración de tokens** → mitigado por los alias de
  compatibilidad de Fase 1 (nada cambia de aspecto hasta migrar cada pantalla).
- **Ticker propio vs `react-fast-marquee`** → validar rendimiento/loop antes de
  quitar la dependencia.
- **Contratos faltantes para módulos nuevos** → resolverlos en Fase 0; un estado
  empty no sustituye campos, filtros o endpoints inexistentes.
- **`htmlSanitizer` + estilos `.rich-content`** → no romper embeds (iframe /
  Instagram) al retocar CSS global.
- **Contacto y privacidad** → el contrato actual rechaza campos del mock y permite
  `retrieve` público; corregir permisos antes de exponer el nuevo formulario.
- **Auth refresh** → la rotación actual no persiste el nuevo refresh token; cubrir
  dos renovaciones consecutivas.
- **Peso de medios** → el mock carga aproximadamente 8,7 MB en 22 imágenes; usar
  formatos/tamaños responsivos, lazy loading y presupuesto medido.
- **Accesibilidad del mock** → la auditoría encontró contraste insuficiente,
  targets menores de 44px y ARIA inválido. DESIGN y pruebas mandan sobre esos
  defectos del prototipo.
