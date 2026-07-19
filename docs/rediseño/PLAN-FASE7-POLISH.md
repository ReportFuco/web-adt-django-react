# PLAN-FASE7-POLISH.md — Hero mobile, animaciones, loader y skeleton

> Continuación de [`PLAN.md`](./PLAN.md) (Fases -1 a 6, ya implementadas y
> desplegadas). Este documento cubre feedback puntual sobre la versión en
> producción: **no se ha implementado nada de lo que sigue**. Referencias a
> `DESIGN.md` usan el mismo formato `§N` que el resto de `docs/rediseño/`.

## Origen

Feedback del dueño revisando el sitio en mobile (19 jul 2026):

1. El Hero se ve muy alto/pesado en mobile — pide una versión más compacta.
2. Faltan animaciones que existían antes en los componentes.
3. Cambiar el loader actual por uno que muestre un porcentaje de 0 a 100.
4. Agregar un skeleton (loading placeholder con la forma del contenido real).

## Estado actual verificado

### Hero mobile

- `src/components/home/Hero.jsx` usa
  `min-h-[clamp(440px,66vh,660px)]`, padding mobile
  `px-5 pb-8 pt-16` y título
  `text-[clamp(2.1rem,1.2vw+1.9rem,3.9rem)]`.
- En 390×844, `66vh` son aproximadamente 557px antes de considerar el alto
  real del contenido. `min-height` es solo un piso: un título largo, la bajada,
  la metadata y el CTA pueden hacer crecer el bloque por encima de ese valor.
- `HeroSupport.jsx` usa thumb `w-16`, contenedor `px-6 pb-2 pt-6` y filas
  `py-4`, sin compactación mobile.
- No es realista exigir que el Hero, las cuatro filas de apoyo, el Header y
  los espacios de la sección entren completos en un viewport de ~800px. Hay
  que decidir si en mobile se muestran menos apoyos, se cambia su disposición
  o se acepta que queden después del primer scroll.
- La imagen del Hero usa `loading="eager"`, pero no `fetchPriority="high"`.
  Compactar el bloque no debe degradar LCP ni introducir otra imagen prioritaria
  en el home.

### Arquitectura de carga del home

- `useHomeData()` dispara ocho peticiones dentro de un único `Promise.all`:
  dos de noticias, eventos, entrevistas, galería y tres anuncios.
- El estado solo tiene un `loading` global. Mientras cualquiera de las ocho
  llamadas sigue pendiente, `MainPage` reemplaza todo el home por
  `<LoadingState />`.
- Por tanto, mostrar skeletons por sección exige refactorizar el estado por
  recurso/módulo; no es un reemplazo mecánico de componentes.
- La galería no conserva `galeriaError`, por lo que hoy un fallo de ese
  endpoint se interpreta como ausencia silenciosa. Los anuncios sí pueden
  omitirse si fallan, pero no deben insertarse tarde desplazando contenido ya
  visible.

### Animaciones actuales e históricas

- DESIGN §5 define `--adt-ease-standard`, `--adt-dur-fast` (180ms) y
  `--adt-dur-med` (400ms).
- Solo `Hero` y `HeroSupport` tienen entrada (`adt-hero-fade-up`).
  `EventCards` tiene elevación/borde en hover. `NewsList` anima únicamente la
  flecha/color; `InterviewGrid`, `Gallery` y `CommunityStats` no tienen una
  microinteracción equivalente.
- Revisión del frontend anterior al rediseño (commit `743ab8e`):
  - noticias, eventos y entrevistas aplicaban zoom suave a la imagen en hover;
  - el bloque de redes tenía entrada escalonada y elevación en hover;
  - el carrusel tenía fades/scale entre slides.
- El carrusel fue retirado deliberadamente por el nuevo Hero editorial, por lo
  que su transición no se recupera. El zoom de imágenes y las
  microinteracciones sociales sí son candidatos reales a restaurar.
- La entrada al hacer scroll, el contador de cifras y la barra de lectura son
  efectos **nuevos**; no deben presentarse como animaciones recuperadas.

`src/components/magicui/` contiene tres componentes no conectados:

- `number-ticker.jsx`: usa `motion/react`, pero no está listo para conectarse
  sin cambios:
  - las métricas actuales son strings localizados (`"35.613"`), que
    `Number("35.613")` interpreta como 35,613 decimal, no como 35.613 personas;
  - formatea con locale `en-US`, no `es-CL`;
  - usa `text-black dark:text-white`, incompatible con el theme runtime
    mediante `data-theme`;
  - no declara PropTypes;
  - su spring JavaScript no queda neutralizado por el guard CSS global de
    reduced motion.
- `scroll-progress.jsx`: usa `motion/react` y un gradiente violeta/rosa/naranja
  hardcodeado que rompe DESIGN §2.
- `progressive-blur.jsx`: crea varias capas de `backdrop-filter`; puede aumentar
  el costo de pintura en mobile y no responde a un requisito del diseño.

Dependencias:

- `framer-motion` no se importa en el código actual.
- `motion` solo se importa desde los componentes Magic UI desconectados; por
  ahora no forma parte del bundle de una pantalla de producción.
- Conectar `NumberTicker` agregará peso al bundle del home. Debe medirse antes
  y después; no basta con decir que la dependencia "ya existe".

### Loaders y skeletons

- `common/LoadingSpinner.jsx` es el fallback global de `<Suspense>` y solo
  representa carga de chunks/rutas.
- `ui/LoadingState.jsx` es el spinner inline usado durante fetch de datos.
- No existe progreso real ni simulado.
- No existe ningún skeleton en `frontend/src`.
- El guard CSS global neutraliza `animate-pulse`, pero no detiene springs ni
  valores de estilo actualizados directamente desde JavaScript/Motion.

### Baseline de calidad

Verificación local del 19 jul 2026:

- `pnpm run build`: **pasa**.
- `pnpm run lint`: **falla** con 74 errores y 4 warnings preexistentes
  (PropTypes, imports sin uso y archivos dormidos de store/Magic UI).
- `package.json` no tiene script ni runner de tests frontend.
- `DECISIONES.md` todavía reconoce que no existe un baseline visual formal
  único en todos los viewports/temas.

La definición de terminado de esta fase no puede prometer un lint global limpio
sin incluir explícitamente su saneamiento.

## Gate de decisiones

Estas decisiones se cierran antes de implementar el bloque afectado:

1. **Hero mobile:** máximo de líneas del título y tratamiento de
   `HeroSupport` en mobile:
   - cuatro apoyos apilados después del Hero;
   - solo dos apoyos en mobile;
   - disposición horizontal accesible.
2. **Loader 0–100:**
   - porcentaje completamente simulado dentro del fallback (puede desaparecer
     antes de enseñar 100), o
   - overlay coordinado fuera de `Suspense`, capaz de mostrar 100 antes de
     ocultarse. **Recomendado** para cumplir literalmente el feedback.
3. **Skeleton vs. spinner:** recomendado: skeleton para carga inicial de
   página/sección y `LoadingState`/texto para acciones puntuales
   (`isSubmitting`, comentarios, etc.).
4. **Animaciones de entrada:** CSS + `IntersectionObserver` mínimo o
   `motion/react`. Recomendado: CSS/observer para reveals y reservar Motion
   solo para el contador si su costo medido es aceptable.
5. **Efectos opcionales:** recomendado dejar `ScrollProgress` y
   `ProgressiveBlur` fuera de Fase 7 y borrar ambos como código muerto. Solo se
   integran si el dueño los aprueba expresamente después de ver una prueba.

## 7.0 — Gate técnico y baseline

**Meta:** comenzar la fase con checks reproducibles y separar deuda previa de
regresiones nuevas.

Tareas:

1. Guardar capturas antes del cambio en dark/light para 390×844, 414×896 y
   1440×900. Incluir un Hero con título corto y otro con el título más largo
   disponible en datos reales.
2. Dejar `pnpm run lint` verde en un commit separado:
   - corregir PropTypes/imports del frontend activo y de Magic UI;
   - resolver los errores del store dormido sin reactivarlo;
   - no ocultar errores nuevos deshabilitando reglas globalmente.
3. Registrar tamaños de chunks del `pnpm run build`, especialmente
   `MainPage` y chunks compartidos, antes de conectar Motion.
4. Como mínimo, documentar pruebas manuales reproducibles para timers,
   reduced-motion y navegación. Si se introduce lógica no trivial para
   coordinar el loader, agregar Vitest y pruebas de:
   - avance simulado, finalización y limpieza de timers;
   - loader rápido que no parpadea;
   - formateo de métricas localizadas.

**Definición de terminado:** baseline guardado, lint/build verdes y cualquier
deuda excluida documentada explícitamente.

## A. Hero compacto en mobile

**Meta:** reducir el peso visual del Hero en mobile sin alterar desktop,
manteniendo DESIGN §9.5 y el LCP.

Cambios:

1. Separar tamaños mobile y desktop en lugar de aplicar un `clamp` global:
   - base mobile de partida: `min-h-[360px]` a `min-h-[400px]`;
   - desde `sm`, mantener el comportamiento desktop actual.
2. Definir también dos escalas de título:
   - un `clamp` mobile con techo realmente menor;
   - el `clamp` desktop actual desde `sm`.
   No usar un único ejemplo cuyo máximo siga siendo `3.9rem`, porque volvería
   a afectar desktop y no fija un techo mobile.
3. Aplicar el máximo de líneas aprobado al título. Probar palabras largas,
   mayúsculas, tildes y títulos de 80–120 caracteres.
4. Reducir el bloque de texto mobile (`pt-10`/`pt-12`, `pb-6`/`pb-8`) y
   decidir explícitamente:
   - bajada oculta o máximo 2 líneas;
   - metadata completa o simplificada;
   - CTA siempre visible.
5. Compactar `HeroSupport` (`w-12`, gaps/paddings menores) y aplicar la
   disposición mobile elegida en el gate. No usar como aceptación que Hero +
   cuatro apoyos entren en el primer viewport salvo que se elija ocultar o
   redistribuir elementos.
6. Mantener una sola imagen prioritaria en home y agregar
   `fetchPriority="high"` a la foto del Hero. Conservar `decoding="async"` y
   verificar que no se duplique la descarga.

Criterios de aceptación:

- El Hero principal cabe completo en el primer viewport en 390×844 y 414×896.
- Ningún título se superpone con metadata/CTA ni desborda horizontalmente.
- Desktop 1024/1440 conserva altura, escala y composición actuales.
- LCP no empeora materialmente respecto al baseline y no aparece CLS nuevo.

## B. Loader de ruta con porcentaje 0–100

**Meta:** reemplazar el splash actual por progreso comprensible sin presentar
como real una medición que React/Vite no expone.

### Restricciones técnicas

- `React.lazy(import())` resuelve como promesa binaria; no expone bytes
  descargados.
- Una petición JSON pequeña tampoco ofrece un porcentaje útil para el usuario.
- El fallback de `Suspense` se desmonta inmediatamente al resolver el chunk:
  por sí solo no puede garantizar que el usuario vea el salto final a 100.
- El home tiene ocho peticiones, pero tres son anuncios. Mostrar "N de 8" como
  progreso editorial mezcla recursos con distinto valor y queda redundante al
  implementar skeletons progresivos.

### Alcance recomendado

1. Porcentaje simulado **solo para navegación/carga de ruta**.
2. Skeletons para carga de datos; no mostrar porcentajes por fetch.
3. No implementar porcentaje N/8 en `MainPage`.
4. Mantener indicadores textuales en acciones puntuales.

### Implementación recomendada para mostrar 100

1. Crear un controlador de progreso de ruta fuera del boundary de `Suspense`
   (por ejemplo, overlay global + helper que envuelva los imports lazy).
2. Al comenzar una importación:
   - esperar 120–180ms antes de mostrar el overlay para evitar flashes;
   - iniciar en 0 y avanzar con easing hasta un máximo de 90–95.
3. Al resolver o fallar la importación:
   - pasar a 100;
   - mantener 100 visible aproximadamente 120–180ms;
   - ocultar y limpiar todos los timers.
4. Si la ruta carga antes del retraso inicial, no mostrar el loader.
5. No imponer una espera mínima artificial a la página solo para completar la
   animación.
6. El error de importación debe salir del loader hacia un error recuperable;
   nunca puede quedar congelado en 90–100.

Accesibilidad:

- Usar `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="100"` y
  `aria-valuenow`.
- Mantener un texto estable como "Cargando página".
- No anunciar cada incremento mediante `aria-live`.
- Con reduced motion, conservar el cambio numérico/estado pero eliminar
  interpolaciones visuales.

Criterios de aceptación:

- Navegación lenta: se observa avance y 100 antes de ocultarse.
- Navegación rápida/caché: no hay flash del splash.
- Back/forward, navegación programática y error de chunk no dejan overlay
  persistente.
- El loader usa tokens dark/light y no bloquea lectores de pantalla con
  anuncios repetitivos.

## C. Skeletons y carga progresiva

**Meta:** reservar la forma del contenido real, reducir saltos de layout y
permitir que cada módulo aparezca cuando sus datos estén listos.

### Primitivo y accesibilidad

Crear `src/components/ui/Skeleton.jsx`:

- Primitivo decorativo basado en `className`; evitar construir clases Tailwind
  dinámicas a partir de valores arbitrarios.
- `animate-pulse`, `bg-surface-raised` y `rounded-adt`.
- El primitivo individual debe usar `aria-hidden="true"`.
- Cada grupo compuesto debe tener un único estado accesible
  (`role="status"` o región con `aria-busy="true"`) y texto `sr-only`
  "Cargando…".
- Reduced motion queda cubierto para `animate-pulse` por el guard CSS global.

### Variantes requeridas

En `src/components/content/` o junto al componente real:

- `HeroSkeleton`: mismo alto responsive de A, barras de texto y CTA.
- `HeroSupportSkeleton`: misma disposición y cantidad mobile aprobada.
- `NewsListSkeleton`: filas 96/160px equivalentes a `NewsList`.
- `EventCardsSkeleton`: grilla 1→2→4 equivalente al home.
- `AgendaListSkeleton`: filas equivalentes a `AgendaRow` para `/eventos`.
- `InterviewGridSkeleton`: retratos 4:5 y bloque de cita/byline.
- `GallerySkeleton`: grilla 3→4→6 y ratio 1:1.
- `SearchResultsSkeleton`: filas del resultado mixto de `/buscar`.
- `DetailPageSkeleton`: composición completa de `DetailHero`, cuerpo y sidebar;
  parametrizable para noticia/evento/entrevista.
- `HeadlinesSkeleton`, solo si eventos se renderiza independientemente en home
  antes de conocer sus datos.

Cada variante debe reutilizar exactamente los breakpoints, gaps, ratios y
cantidades visibles del componente real. No usar un skeleton genérico de cards
para pantallas cuya estructura es distinta.

### Refactor de `useHomeData`

Sustituir el booleano único por estados agrupados:

- `heroNews`: destacadas + todas las noticias, porque ambas construyen Hero,
  apoyos y lista sin duplicados;
- `events`;
- `interviews`;
- `gallery`;
- `ads`.

Cada grupo contiene como mínimo `{ loading, data, error }`. Requisitos:

1. Renderizar el scaffold del home desde el primer paint.
2. Sustituir cada skeleton solo cuando termina su grupo.
3. Conservar `empty` y `error` diferenciados por módulo.
4. Propagar `galeriaError`.
5. Definir una política estable para anuncios opcionales: reservar su lugar o
   esperar su resolución antes de revelar el contenido afectado. No insertar
   un billboard tardío por encima de contenido ya visible.
6. Cancelar/ignorar actualizaciones después de desmontar la página.

### Reemplazos por pantalla

- Home: Hero + apoyo, Headlines, noticias, eventos, entrevistas y galería.
- `/noticias`: `NewsListSkeleton`.
- `/eventos`: `AgendaListSkeleton`, no `EventCardsSkeleton`.
- `/entrevistas`: `InterviewGridSkeleton`.
- `/cultura`: `GallerySkeleton`.
- `/buscar`: `SearchResultsSkeleton`.
- Detalles: `DetailPageSkeleton` específico.

En paginación/filtros posteriores, evaluar mantener el contenido anterior con
`aria-busy` en vez de vaciar toda la vista; el skeleton completo es obligatorio
para la carga inicial, no necesariamente para cada cambio rápido de filtro.

`LoadingState` no se elimina: queda disponible para acciones puntuales y
componentes que no tienen una forma de contenido predecible.

Criterios de aceptación:

- Skeleton y contenido final ocupan dimensiones equivalentes.
- No aparecen estados vacíos antes de terminar la petición.
- Un fallo en una sección del home no bloquea las demás.
- Dark/light, reduced-motion y zoom de navegador al 200% correctos.
- CLS medido y comparado con baseline, especialmente alrededor de anuncios.

## D. Animaciones y microinteracciones

**Meta:** restaurar señales de interacción perdidas y añadir movimiento nuevo
con moderación, respetando DESIGN §5.

### D.1 Restaurar interacciones anteriores

1. Zoom suave de imagen dentro del contenedor `Media` en:
   - `NewsList`;
   - `EventCards`;
   - `InterviewGrid`.
2. Mantener el contenido dentro de `overflow-hidden` y usar
   `--adt-dur-med`/`--adt-ease-standard`; no escalar la tarjeta completa.
3. Extender elevación/borde sutil a `InterviewGrid` y filas de `NewsList` sin
   perjudicar el foco de teclado.
4. Recuperar elevación discreta en enlaces sociales donde exista un bloque
   interactivo equivalente.
5. Definir estados `hover`, `focus-visible` y, cuando aporte, `active`.
   Dispositivos sin hover no deben depender de la animación para comunicar que
   algo es interactivo.

### D.2 Entrada de secciones al hacer scroll — efecto nuevo

Aplicar reveal solo a contenedores principales (`NewsList`, `EventCards`,
`InterviewGrid`, `Gallery`, `CommunityStats`), no a cada nodo de texto.

Recomendación:

- `IntersectionObserver` compartido mediante hook pequeño;
- clase CSS que reutilice desplazamiento de 16px, `--adt-dur-med` y
  `--adt-ease-standard`;
- `once: true`;
- el contenido debe ser visible por defecto si JavaScript falla;
- no usar `@starting-style` como única solución sin validar compatibilidad.

El guard CSS global cubre esta opción. Si se elige Motion, cada componente debe
usar explícitamente `useReducedMotion`; el guard global no basta para springs o
styles inline.

### D.3 Contador de comunidad

Antes de conectar `NumberTicker`:

1. Cambiar el contrato de métricas a valor numérico, por ejemplo
   `{ value: 35613, format: "integer" }`, manteniendo la fecha manual.
2. Formatear con `Intl.NumberFormat("es-CL")`.
3. Usar tokens de color/tipografía del proyecto y agregar PropTypes.
4. Con reduced motion, renderizar inmediatamente el valor final.
5. Evitar que el contador anuncie cada frame; el texto accesible final debe ser
   estable.
6. Medir cuánto agrega `motion` al chunk del home. Si el aumento no se
   justifica, reemplazarlo por una implementación pequeña con
   `requestAnimationFrame` + `IntersectionObserver` y eliminar `motion`.

### D.4 Código opcional/dependencias

- Remover `framer-motion` del `package.json` y lockfile.
- Si `ScrollProgress` y `ProgressiveBlur` no se aprueban, borrar ambos archivos.
- Si el contador deja de usar Motion y no queda ningún import, remover también
  `motion`.
- Ejecutar una auditoría breve del resto de dependencias no importadas; no
  mezclar eliminaciones dudosas con la implementación visual.

`ScrollProgress` y `ProgressiveBlur` quedan fuera de la definición de terminado
de Fase 7 por defecto. Si se aprueban:

- `ScrollProgress` usa `bg-signal`, considera el alto/z-index del Header y
  respeta `useReducedMotion`.
- `ProgressiveBlur` requiere prueba de rendimiento en mobile real; si aumenta
  pintura o reduce legibilidad, se descarta.

## Orden de implementación

1. **7.0 — baseline y lint**.
2. **A — Hero mobile**, después de cerrar líneas/apoyos.
3. **C.1 — primitivo y variantes de skeleton**.
4. **C.2 — refactor de `useHomeData` y home progresivo**.
5. **C.3 — listados, Cultura, búsqueda y detalles**.
6. **B — loader de ruta 0–100**.
7. **D.1 — restaurar microinteracciones anteriores**.
8. **D.2/D.3 — reveals y contador**.
9. **D.4 — limpieza de dependencias y archivos descartados**.
10. QA final y captura comparativa.

Commits recomendados:

1. `chore: deja baseline de lint limpio para fase 7`
2. `fix: compacta hero y apoyos en mobile`
3. `feat: agrega primitivas y variantes skeleton`
4. `refactor: carga módulos del home de forma independiente`
5. `feat: aplica skeletons a listados y detalles`
6. `feat: agrega progreso de carga de rutas`
7. `feat: restaura microinteracciones editoriales`
8. `feat: agrega reveals y contador accesibles`
9. `chore: elimina dependencias y efectos no usados`

## Checklist de listo

### Funcional

- [ ] Hero compacto sin solapamientos con títulos reales cortos y largos.
- [ ] Skeleton inicial correcto en home, listados, Cultura, búsqueda y detalles.
- [ ] Loading, empty y error siguen siendo estados distinguibles.
- [ ] Un endpoint fallido no bloquea módulos independientes del home.
- [ ] Loader rápido no parpadea; loader lento llega a 100 y desaparece.
- [ ] Error de chunk y navegación back/forward no dejan overlay bloqueado.

### Visual y responsive

- [ ] Dark y light correctos.
- [ ] 390×844, 414×896, 768×1024, 1024×768 y 1440×900 verificados.
- [ ] Capturas antes/después con los mismos datos.
- [ ] Skeletons y contenido final tienen geometría equivalente.
- [ ] Sin CLS nuevo, especialmente en Hero, galería y anuncios.
- [ ] Zoom 200% sin pérdida de contenido/controles.

### Accesibilidad y movimiento

- [ ] Foco visible y equivalente al hover.
- [ ] Skeletons decorativos ocultos del árbol accesible; un solo anuncio de
      carga por grupo.
- [ ] Progreso con semántica `progressbar`, sin anunciar cada porcentaje.
- [ ] `prefers-reduced-motion` probado activamente.
- [ ] Animaciones Motion/JavaScript usan reducción explícita; no se confía solo
      en el guard CSS.

### Rendimiento y calidad

- [ ] Hero conserva una sola imagen de alta prioridad y LCP no empeora.
- [ ] CLS/LCP comparados con baseline.
- [ ] Tamaños de chunks antes/después registrados; incremento por Motion
      justificado o eliminado.
- [ ] Sin dependencias/imports/archivos muertos de animación.
- [ ] `pnpm run lint` limpio.
- [ ] `pnpm run build` limpio.
- [ ] Tests automáticos del loader/formateo ejecutados si se introdujo runner;
      en caso contrario, evidencia manual reproducible adjunta.
