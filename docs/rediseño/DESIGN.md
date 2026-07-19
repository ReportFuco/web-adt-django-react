# DESIGN.md — Sistema de diseño "Adictos al Techno" (rediseño 2026)

> **Fuente de verdad del rediseño.** Este documento reemplaza al antiguo
> `BRANDING.md` (eliminado). Todo lo que un agente necesite para implementar una
> pantalla — tokens, reglas, specs de componentes — vive aquí. El prototipo
> visual de referencia es [`docs/mocks/index.html`](../mocks/index.html): es un
> HTML estático, **no** un build de producción, pero define la estructura, los
> tokens y la composición objetivo del home.
>
> Regla de oro para producción: **ningún valor visual fijo se inventa dentro de
> un componente.** Debe venir de un token o de un valor aprobado en este
> documento. Se permiten valores dinámicos (por ejemplo una URL de imagen o un
> porcentaje de progreso) y constantes estructurales documentadas. El HTML del
> mock es un prototipo y no es ejemplo literal de esta regla.

---

## 1. Principios

1. **Editorial antes que "portal".** El contenido (foto + titular) manda; la UI
   se aparta. Nada de carruseles duplicados ni "destacado" repetido.
2. **Monocromo + una sola señal.** La paleta es neutra (negros / blancos / grises).
   `--adt-signal` es el **único** color de acento — **no es rojo**: en tema oscuro
   es **blanco** y en tema claro es **gris**. Se usa con moderación: acción, estado
   activo, marcadores, hover. Nunca como relleno decorativo.
3. **Tipografía como estructura.** Titulares en mayúsculas, condensados, con
   `letter-spacing` negativo. La jerarquía se construye con peso y tamaño, no con
   color.
4. **Fotografía documental real.** Los bloques `.media` del mock son placeholders;
   en producción van fotos reales con línea de crédito.
5. **Motivo de marca: el eslabón / cadena.** Dos "eslabones" (`rect` redondeados)
   = "adictos" encadenados al techno. Aparece en wordmark, overlines, tickers y
   divisores. Ver §8.
6. **Accesible por defecto.** Foco visible, `skip-link`, contraste AA, respeto a
   `prefers-reduced-motion`, `aria-*` correctos. Ver §12.
7. **Un token, un origen.** Dark y light comparten los mismos *nombres* de token;
   solo cambian los valores. Los componentes jamás saben en qué tema están.

---

## 2. Tokens de color

Definidos como CSS custom properties `--adt-*` en `:root`, conmutados por
`:root[data-theme="dark|light"]`. **Dark es el default.**

### 2.1 Tema oscuro (default)

| Token | Valor | Uso |
|---|---|---|
| `--adt-bg` | `#0a0a0a` | Fondo base de la página |
| `--adt-bg-soft` | `#121212` | Secciones alternas, ticker, footer |
| `--adt-surface` | `#191919` | Tarjetas, inputs, paneles |
| `--adt-surface-raised` | `#232323` | Superficie elevada, placeholders de media |
| `--adt-border` | `#333333` | Bordes, divisores, líneas de grilla |
| `--adt-text` | `#f5f3ef` | Texto principal |
| `--adt-text-soft` | `#b8b6b2` | Texto secundario / bajadas |
| `--adt-text-muted` | `#8d8b87` | Meta, labels, notas; AA sobre superficies oscuras |
| `--adt-signal` | `#ffffff` | **Acento único = blanco** (acción/activo/hover) |
| `--adt-signal-strong` | `#e6e4e0` | Hover/press del acento (blanco atenuado) |
| `--adt-on-signal` | `#0a0a0a` | Texto/íconos sobre `signal` (oscuro sobre blanco) |
| `--adt-control-border` | `#686868` | Límite perceptible de inputs/controles |
| `--adt-scrim` | `rgba(0,0,0,0.8)` | Velo de superficies en tema oscuro |
| `--adt-photo-scrim` | `rgba(0,0,0,0.82)` | Velo sobre foto; no cambia por tema |
| `--adt-on-photo` | `#f3f1eb` | Texto sobre foto; no cambia por tema |

### 2.2 Tema claro

Fondo **blanco puro** (`#ffffff`, sin tono piel/crema) y neutrales grises. El
acento `signal` es **gris**.

| Token | Valor | Nota |
|---|---|---|
| `--adt-bg` | `#ffffff` | Fondo blanco puro |
| `--adt-bg-soft` | `#f4f4f4` | Secciones alternas, ticker, footer |
| `--adt-surface` | `#ffffff` | Tarjetas (separadas por borde) |
| `--adt-surface-raised` | `#ebebeb` | Superficie elevada / placeholders |
| `--adt-border` | `#e2e2e2` | Bordes gris neutro (no cálido) |
| `--adt-text` | `#111317` | |
| `--adt-text-soft` | `#4e545c` | |
| `--adt-text-muted` | `#626870` | AA también sobre `surface-raised` |
| `--adt-signal` | `#555a61` | **Acento = gris** medio-oscuro |
| `--adt-signal-strong` | `#3a3e44` | Hover/press del acento (gris más oscuro) |
| `--adt-on-signal` | `#ffffff` | Texto/íconos sobre `signal` (blanco sobre gris) |
| `--adt-control-border` | `#767676` | Límite perceptible de inputs/controles |
| `--adt-scrim` | `rgba(255,255,255,0.88)` | Velo de superficies en tema claro |
| `--adt-photo-scrim` | `rgba(0,0,0,0.82)` | Igual que en oscuro |
| `--adt-on-photo` | `#f3f1eb` | Igual que en oscuro |

> Cada bloque de tema declara además `color-scheme: dark|light` para que los
> controles nativos (scrollbars, inputs) hereden el modo.

### 2.3 Reglas de uso de la señal (acento neutro)

> El acento **no es rojo**: es **blanco en oscuro** y **gris en claro**. La regla
> de "usar con moderación" se mantiene: distingue acción/estado, no decora.

- **Sí:** botón primario en hover, `aria-current` de nav, subrayado activo,
  marcadores de titulares (`▪`), kickers de sección, íconos de fecha en eventos,
  comillas de entrevista, borde/hover de tarjeta, foco.
- **No:** grandes áreas de relleno, texto de párrafo largo, fondos de sección,
  degradados decorativos.
- Sobre foto se usan `--adt-on-photo` y `--adt-photo-scrim` en **ambos** temas.
  `--adt-scrim` queda reservado para overlays de superficie conmutables.
- Colores de marca de terceros (Instagram, Spotify…) solo dentro de su propio
  módulo; en la UED general los íconos sociales son monocromos y viran a `signal`
  en hover.

---

## 3. Tipografía

- **Familia única:** `Archivo` (Google Fonts, pesos 400–900) para display y body.
  Fallback: `"Helvetica Neue", Arial, sans-serif`.
  → **Migración:** reemplaza a `Space Grotesk` + `Inter` del sitio actual.
- Tokens runtime: `--adt-font-display` y `--adt-font-body` (hoy apuntan a la misma familia; se
  mantienen separados por si se divergen a futuro).

### 3.1 Reglas de encabezados (`h1`–`h4`)

```
font-family: var(--adt-font-display);
font-weight: 800;           /* 900 para números grandes (agenda, stats) */
text-transform: uppercase;
letter-spacing: -0.015em;
line-height: 0.99;
```

### 3.2 Escala (fluida con `clamp`)

| Rol | Tamaño |
|---|---|
| Hero title | `clamp(2.1rem, 1.2vw + 1.9rem, 3.9rem)` |
| Section title | `clamp(1.75rem, 3vw, 2.75rem)` |
| Agenda day (número) | `2.5rem` peso 900 |
| Stat value | `2rem` |
| Card title | `1rem`–`1.1875rem` (peso 700, **sin** uppercase, `letter-spacing: 0`) |
| Body | `16px` base, `line-height: 1.65` |
| Kicker / label / tag / meta | `0.6875rem`–`0.75rem`, uppercase, tracking `0.06em`–`0.16em` |

> **Importante:** los *títulos de tarjeta/lista* usan `--adt-font-body`, peso 700,
> **sin** mayúsculas — contrastan con los `h2` de sección que sí van en display
> uppercase. No los confundas.

---

## 4. Espaciado, radios, contenedor

| Token | Valor |
|---|---|
| `--adt-space-1` | `4px` |
| `--adt-space-2` | `8px` |
| `--adt-space-3` | `16px` |
| `--adt-space-4` | `24px` |
| `--adt-space-5` | `32px` |
| `--adt-space-6` | `48px` |
| `--adt-space-7` | `64px` |
| `--adt-space-8` | `96px` |
| `--adt-radius` | `3px` (radio único; el diseño es casi recto) |
| `--adt-container` | `1440px` (ancho máximo de `.wrap`) |

- `.wrap`: `max-width: var(--adt-container); margin-inline:auto; padding-inline: var(--adt-space-4)` (→ `var(--adt-space-3)` en ≤640px).
- Ritmo vertical de sección: `.section { padding-block: var(--adt-space-8) }`,
  `.section--tight { var(--adt-space-6) }`.

---

## 5. Movimiento

| Token | Valor | Uso |
|---|---|---|
| `--adt-ease-standard` | `cubic-bezier(0.16, 1, 0.3, 1)` | Todas las transiciones/entradas |
| `--adt-dur-fast` | `180ms` | Hover, foco, subrayados |
| `--adt-dur-med` | `400ms` | Cambio de tema, fades de entrada |

- Entradas del hero: `heroFadeUp` (16px + fade) con delays escalonados 120–370ms.
- Ticker: `translateX(-50%)` en loop de 26s; pausable y pausado si
  `prefers-reduced-motion`.
- **Siempre** envolver animación en el guard de `prefers-reduced-motion: reduce`
  (ya está en el reset del mock).

---

## 6. Superficies, bordes y elevación

- La "elevación" es por **borde + color de superficie**, no por sombra. Sombras
  casi inexistentes (el diseño es plano/editorial).
- Jerarquía: `bg` → `bg-soft` → `surface` → `surface-raised`.
- Divisores: `1px solid var(--adt-border)`. Grillas editoriales usan bordes/gaps
  de 1px (ej. `stat-grid`, `footer-top`).

---

## 7. Fotografía y `.media`

- Componente `Media`: contenedor `position:relative; overflow:hidden` con
  `aspect-ratio` por variante y placeholder (eslabón tenue centrado) hasta que
  carga la foto real. En producción usa `<img>`/`<picture>` por defecto con
  `object-fit:cover`, dimensiones reservadas, `srcset`, `sizes`, `alt`,
  `loading="lazy"` y `decoding="async"`. Solo la imagen LCP del hero carga eager;
  `background-image` se reserva para casos realmente decorativos.
- **Aspect ratios** (clases del mock → props del componente):
  `ar-169` 16/9 · `ar-32` 3/2 · `ar-43` 4/3 · `ar-45` 4/5 (retratos de
  entrevista) · `ar-11` 1/1 (eventos, galería, thumbs).
- Variante `--photo`: la foto va como `background-size:cover; center`.
- Crédito: `.media__credit` abajo-izq (o arriba en el hero), texto blanco sobre
  `rgba(0,0,0,0.55)`, uppercase `0.6875rem`.
- Las variantes `--warm` / `--cool` son planas (sin tinte) — se conservan solo
  por compatibilidad de nombres.

---

## 8. Iconografía y motivo de marca

- **Íconos:** trazo (`stroke`), `stroke-width: 2`, `stroke-linecap: round`,
  `currentColor`, viewBox `0 0 24 24`. Librería disponible en el repo:
  `lucide-react` (preferir) — ya es dependencia.
- **Motivo eslabón/cadena** (§1.5): dos `rect` redondeados
  `<rect x=3 y=7 w=8 h=10 rx=4/><rect x=13 y=7 w=8 h=10 rx=4/>`.
  Se usa en: wordmark, `hero-overline`, ítems del ticker, placeholder de `.media`.
  Encapsúlalo en un componente `<LinkGlyph/>` (o icono SVG reutilizable) — no
  repetir el markup inline.
- **Flecha de acción:** `M5 12h14M13 6l6 6-6 6` (usada en CTAs y `section-link`,
  se desplaza 3px en hover).

---

## 9. Especificaciones de componentes

Cada componente lista su rol y sus reglas clave. Los nombres de clase provienen
del mock; en React se traducen a componentes (§11.3). Consulta el mock para el
markup exacto.

### 9.1 CTA / Botón
- `.cta` base: `min-height:44px`, uppercase, peso 700, tracking `0.06em`, radio `--adt-radius`.
- `.cta--primary`: fondo `--adt-text`, texto `--adt-bg`; **hover → fondo `signal`,
  texto `on-signal`**. (En el hero el primario invierte a crema sobre foto.)
- `.cta--ghost`: borde `--adt-border`; hover → borde y texto `signal`.
- Siempre incluye el ícono de flecha a la derecha.

### 9.2 Tag / Kicker / Meta
- `.tag`: pill de borde, uppercase `0.6875rem`; `.tag--active` → color/borde `signal`.
- `.kicker`: label de sección, `signal`, tracking `0.14em`.
- `.meta-row` / `.meta-item`: metadatos (fecha, lectura, venue) en `text-muted`,
  con íconos de 13px.

### 9.3 Section head
- `.section-head`: kicker + `h2.section-title` a la izquierda; `.section-link`
  ("Ver todas →") a la derecha con borde inferior que vira a `signal` en hover.

### 9.4 Header + Nav + Ticker (§ layout)
- **Header** sticky, `border-bottom`. Wordmark con `LinkGlyph` + "ADICTOS AL
  TECHNO" (compacto "ADT" en ≤420px). `primary-nav` con subrayado `signal`
  animado y `aria-current`. `header-socials` monocromos dentro de `nav` con
  nombre accesible. Botones ícono de 44px:
  buscar, **theme-toggle** (¡vive en el header, no flotante!), y `nav-toggle`
  (≤860px).
- **Ticker-strip** bajo el header: lista en loop horizontal (duplicada para loop
  perfecto, la 2ª mitad `aria-hidden`), botón de pausa con estado. Alimentar con
  la franja/últimos titulares del backend. Escuchar cambios de
  `prefers-reduced-motion`, no solo el valor al montar.
- Menú móvil: el ID de `aria-controls` debe existir; Escape/cambio de ruta/cambio
  de breakpoint cierran el menú; se gestiona foco y se devuelve al toggle.

### 9.5 Hero editorial
- Grilla `1.7fr / 1fr` (colapsa a 1 col ≤960px).
- `hero-lead`: foto de fondo a sangre, `scrim` en degradado hacia arriba, texto
  sobre el velo, marco de corchetes `signal` en esquinas, `hero-overline` con
  eslabón. Debe caber en el primer viewport.
- `hero-support`: aside con 4 ítems numerados (01–04) "También en portada"
  (thumb 1:1 + título + tag). Un solo hero por página (reemplaza el carrusel).

### 9.6 Módulos de contenido
- **`news-row`** (Últimas noticias): grilla `160px / 1fr / auto` (thumb, título+meta,
  flecha). Colapsa a `96px / 1fr` ≤720px.
- **`event-card`** (Próximos eventos): tarjeta vertical, media 1:1, fecha
  dominante en `signal`, título, venue al pie. Grilla de 4 → 2 → 1.
- **`headlines`** (strip de agenda): 3 titulares con marcador `signal`, separados
  por línea vertical; a 1 col ≤760px.
- **`agenda-row`** (calendario cronológico): fecha grande (día 900 + mes) / info /
  CTA. Alternativa de listado para la página de eventos.
- **`interview-card`**: retrato 4/5 + comillas `signal` + cita en display + byline.
- **`gallery-grid`**: grilla de 6 → 4 → 3 imágenes 1:1. Alimentar con
  `FotoNoticia/FotoEvento/FotoEntrevista` (hoy sin mostrar).
- **`community-panel`** + `stat`: copy + grilla 2×2 de métricas sociales
  (número display + label). Cifras manuales con footnote de "última revisión".
- **`contact`** + `field`: formulario con `field-row` (2 col), inputs de borde
  `control-border` que viran a `signal` en foco. Campos alineados al contrato
  resuelto en PLAN Fase 0 (§10).

### 9.7 Publicidad (subordinada al contenido)
- `.ad-slot`: etiqueta "Publicidad" siempre visible como texto real en el DOM
  (no solo pseudo-elemento), borde, fondo `bg-soft`. Variantes `--leaderboard`
  (96px) y `--billboard` (220px).
- `.sponsored-slot`: variante inline (borde punteado, opacidad 0.86) para
  contenido patrocinado dentro del flujo editorial.
- **Regla:** la publicidad nunca imita al contenido editorial; siempre rotulada y
  visualmente separada.

### 9.8 Footer
- `footer-top`: lockup + descriptor + 3 columnas de links; `footer-bottom` con
  copyright + socials monocromos (hover `signal`).

---

## 10. Alineación con el backend (no inventar campos)

El markup del mock usa datos de ejemplo. Al cablear, respetar los modelos reales
(ver `CLAUDE.md` → *Backend architecture*):

- **Contacto**: el contrato actual del modelo es `nombre_contacto`,
  `apellido_contacto`, `email`, `telefono` (opcional) y `fecha`; **no existen
  `mensaje` ni `asunto`**. El mock y el formulario actual no son compatibles.
  PLAN Fase 0 debe resolverlo con migración o cambio explícito del formulario.
  Solo `create` debe ser público; leer o modificar contactos requiere admin.
- **Noticia / Evento / Entrevista**: lookup por `slug`; listas paginadas
  `{results, count, next, previous}`. El `normalizeListResponse` actual descarta
  metadata y debe refactorizarse en PLAN Fase 0.
- **Evento** tiene múltiples fechas (`fechas` / `FechaEvento`); `fecha_hora` es
  propiedad calculada (próxima fecha). La "fecha dominante" del `event-card` y la
  `agenda-row` salen de ahí.
- **Galería**: `FotoNoticia/FotoEvento/FotoEntrevista` (`related_name='fotos'`);
  URLs públicas vía `MEDIA_PUBLIC_BASE_URL`. Hoy llegan anidadas en listas
  paginadas; no existe endpoint de galería global ni campo de crédito.
- **Entrevistas**: hoy no existe un campo de cita/extracto/rol. No derivarlo
  truncando HTML sin una decisión de contrato.
- **Ticker / franja**: `franjaMensaje()` / `FranjaSuperior` (trackear clicks).
- **Anuncios**: `getAnunciosByUbicacion(...)` → mapear a `ad-slot` por ubicación.
- **Stats de comunidad**: son cifras manuales (no hay endpoint) → constante/config
  editable, con la footnote de fecha de revisión.

---

## 11. Integración con Tailwind 4 (centralización de variables)

El proyecto usa Tailwind 4 vía `@tailwindcss/vite` (CSS-first). Hoy los tokens
existen en `src/index.css` pero **no** están expuestos como utilidades. Objetivo:
**una sola capa de tokens** que alimente tanto CSS plano como utilidades Tailwind.

### 11.1 Estrategia

1. **Tokens runtime** en `:root` / `[data-theme]` con nombres `--adt-*` (§2). Son
   la única fuente de valores conmutables por tema.
2. **Mapear** esos tokens a la escala de Tailwind con `@theme inline` para que las
   utilidades (`bg-surface`, `text-signal`, `border-line`…) resuelvan a
   `var(--adt-*)` **en runtime** (por eso `inline`, no valores estáticos).

```css
/* src/index.css */
@import "tailwindcss";

:root, :root[data-theme="dark"] { /* §2.1 */ --adt-bg:#0a0a0a; --adt-signal:#ffffff; /* … */ }
:root[data-theme="light"]       { /* §2.2 */ --adt-bg:#ffffff; --adt-signal:#555a61; /* … */ }

:root {
  --adt-font-display: "Archivo", "Helvetica Neue", Arial, sans-serif;
  --adt-font-body:    var(--adt-font-display);
  --adt-radius:       3px;
  --adt-ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
  /* --adt-space-*, --adt-container, --adt-dur-* … (§4,§5) */
}

@theme inline {
  /* Colores: utilidades bg-*, text-* y border-* */
  --color-bg:              var(--adt-bg);
  --color-bg-soft:         var(--adt-bg-soft);
  --color-surface:         var(--adt-surface);
  --color-surface-raised:  var(--adt-surface-raised);
  --color-line:            var(--adt-border);   /* "border" es reservado, usar "line" */
  --color-text:            var(--adt-text);
  --color-text-soft:       var(--adt-text-soft);
  --color-text-muted:      var(--adt-text-muted);
  --color-signal:          var(--adt-signal);
  --color-signal-strong:   var(--adt-signal-strong);
  --color-on-signal:       var(--adt-on-signal);
  --color-control-line:    var(--adt-control-border);
  --color-on-photo:        var(--adt-on-photo);

  --font-display: var(--adt-font-display);
  --font-body:    var(--adt-font-body);

  --radius-adt: var(--adt-radius);
  --ease-adt:   var(--adt-ease-standard);
}
```

Con eso, un componente escribe `className="bg-surface text-text border border-line
hover:text-signal"` en vez de `style={{ background: "var(--surface)" }}`. Se
elimina el patrón actual de `style={{ color: "var(--text)" }}` inline.

### 11.2 Reglas de consumo

- **Prohibido** inventar valores visuales fijos en JSX/CSS de componentes. Si
  falta un valor recurrente, se agrega a §2–§5 y a la capa de tokens primero.
- Utilidades Tailwind para color/espaciado/tipografía; `@utility` o clases
  semánticas (`.cta`, `.section-head`, `.media`) para patrones repetidos complejos
  que no se expresan bien solo con utilidades.
- Los helpers legacy (`.section-shell`, `.theme-panel`, `.theme-button`…) se
  **retiran** a medida que sus consumidores migran (ver PLAN Fase 6).
- `clsx` + `tailwind-merge` (ya instalados, `src/lib/utils.js`) para componer
  clases condicionales.

### 11.3 Convención de componentes React

- Un componente por patrón, en `src/components/ui/` (nuevo): `Media`, `Cta`, `Tag`,
  `Kicker`, `SectionHead`, `MetaRow`, `AdSlot`, `LinkGlyph`, `Ticker`.
- Componentes exclusivos de composición del home en `src/components/home/`:
  `Hero`, `HeroSupport`, `Headlines`, `Gallery`, `CommunityStats`, `ContactForm`.
- Patrones editoriales reutilizables en `src/components/content/`: `NewsList`,
  `EventCards`, `InterviewGrid`.
- Layout en `src/components/layout/`: `Header`, `Footer` (reescritos).
- Props tipadas por JSDoc; sin estado de tema local (leer `data-theme` solo donde
  sea imprescindible; preferir utilidades que ya conmutan).

---

## 12. Accesibilidad (no negociable)

- `skip-link` al `#main`.
- `:focus-visible` → `outline: 2px solid var(--adt-signal); outline-offset: 3px`.
- Contraste AA verificado en ambos temas. No asumir que un token pasa por su
  nombre: validar texto pequeño sobre cada superficie y límites de controles.
- `prefers-reduced-motion`: neutraliza animaciones/`scroll-behavior` (guard en el
  reset) y pausa el ticker.
- `aria-current="page"` en nav activa; `aria-pressed`/`aria-label` dinámicos en
  toggles (tema, pausa ticker, menú).
- Imágenes decorativas con `alt=""`/`aria-hidden`; contenido fotográfico usa
  `<img alt>` dentro del enlace. `role="img"` + `aria-label` queda solo como
  fallback cuando no sea viable un elemento de imagen real.
- Targets táctiles ≥44px (botones ícono, CTAs, inputs).
- Regiones landmark: `header`, `main#main`, `footer`, `nav[aria-label]`,
  `section[aria-labelledby]`.

---

## 13. Breakpoints

Coinciden con los del mock (max-width, mobile-last override sobre base desktop):

| px | Qué cambia |
|---|---|
| `1100` | Hero `1.4fr/1fr` |
| `1000` | Eventos 4→2 |
| `960` | Hero → 1 col; interview 3→2 se acerca |
| `900` | Interview/gallery reducen columnas |
| `860` | Nav → `nav-toggle`; community/contact/footer colapsan |
| `760` | Headlines 1 col; header-socials ocultos |
| `720` | `news-row` compacta |
| `640` | Paddings compactos; agenda se compacta |
| `600` | Entrevistas → 1 columna |
| `560` | Galería → 3 columnas |
| `520` | Formulario y footer → 1 columna |
| `460` | Eventos → 1 columna |
| `420` | Wordmark → "ADT" y ajustes finos |

> Nota: Tailwind es *mobile-first* (min-width). Al portar, se puede invertir la
> lógica (base móvil + `md:`/`lg:`) siempre que el resultado visual sea el del
> mock. Documentar el breakpoint elegido si difiere.

---

## 14. Checklist de "listo" por pantalla

- [ ] Sin valores visuales fijos inventados fuera de DESIGN; patrones recurrentes
      vía token/utilidad.
- [ ] Dark **y** light correctos (probar el toggle).
- [ ] Responsive en los breakpoints de §13.
- [ ] Foco visible, `aria-*`, reduced-motion.
- [ ] Datos reales del backend (campos de §10), estados loading/empty/error.
- [ ] Fotos con `alt`/`aria-label` + crédito cuando aplique.
- [ ] Sin dependencias muertas ni imports sin usar.
