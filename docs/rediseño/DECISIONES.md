# DECISIONES.md — Fase -1 resuelta

Fecha: 19 de julio de 2026. Decisiones aprobadas por el dueño del proyecto,
respondiendo a la lista de "Decisiones abiertas" de `PLAN.md`. Estas
decisiones tienen precedencia sobre `PLAN.md`/`DESIGN.md` cuando difieran.

| # | Tema | Decisión |
|---|---|---|
| 1 | Tipografía | Migrar a **Archivo** en todo el sitio (reemplaza Space Grotesk + Inter). |
| 1b | Acento | Ya resuelto en DESIGN.md: `--adt-signal` neutro (blanco/gris), no rojo. |
| 2 | Gestor de paquetes | **pnpm** es el único gestor. Se borra `package-lock.json`, se conserva `pnpm-lock.yaml`. `CLAUDE.md` se actualiza para reflejar `pnpm install`/`pnpm run …`. |
| 3 | Tienda/carrito | **Descartada.** Su código, endpoints y dependencias se retiran de este repositorio; el comercio continuará en un proyecto separado. |
| 4 | Búsqueda | **Se implementa.** Endpoint simple de búsqueda (título/tag) en el backend + modal/ruta de resultados accesible en el frontend. Botón del Header queda funcional. |
| 5 | Métricas de comunidad | ~~Constante editable en el frontend, sin endpoint nuevo.~~ **Revisado el 20 jul 2026**: se agregó el modelo `RedSocial` (backend) con `url`, `contador` y `label` por red, editable desde el admin. El endpoint `/api/redes-sociales/` alimenta Header, Footer y el panel de Comunidad; `actualizado_en` (auto) reemplaza el footnote de fecha manual. |
| 6 | Sección "Cultura" | **Página `/cultura` dedicada**, pero reutiliza el mismo agregado de fotos que la Galería del home (sin modelo de contenido propio). Es una vista "Galería completa" con su propia ruta. |
| 7 | Contacto | **Sin `mensaje`/`asunto`.** El formulario nuevo mantiene los campos actuales del backend (nombre, apellido, email, teléfono). No se migra el modelo `Contacto`. Sí se corrige el permiso de `retrieve` (debe requerir admin, no público). |
| 8 | Entrevistas | **Se agregan campos** al modelo `Entrevista`: cita destacada, rol/cargo del entrevistado y crédito de foto. Requiere migración + serializer + admin. |
| 9 | Auth en Header | **Icono de cuenta compacto** en el Header (junto a theme-toggle/búsqueda): login si no hay sesión, menú de usuario/logout si la hay. |
| 10 | Publicidad | **Se amplían las ubicaciones.** Se agregan nuevas opciones a `Anuncio.UBICACION_CHOICES` para listados (`/noticias`, `/eventos`, `/entrevistas`) y detalle, además de las 3 actuales del home. |
| 11 | Galería home | **Endpoint agregado liviano** en el backend (`/api/galeria/` o similar) que combina y ordena las fotos más recientes de `FotoNoticia`/`FotoEvento`/`FotoEntrevista`. Este mismo endpoint alimenta `/cultura`. |
| 12 | URLs / SEO | **Se conservan** las rutas públicas actuales (`/noticias/:id/:slug`, `/eventos/:id/:slug`, `/entrevistas/:slug`). Sin redirects ni cambio de patrón en este rediseño. |
| 13 | Páginas legales | **Páginas estáticas simples** (React, sin backend) para Política editorial y Créditos fotográficos, con contenido genérico placeholder a editar después. Newsletter se retira del footer (sin proveedor integrado). |

## Impacto en alcance (respecto al PLAN.md original)

Estas decisiones **amplían** el alcance de Fase 0 respecto a lo que el plan
asumía como default más conservador:

- Búsqueda: de "retirar ícono" a **implementar endpoint + UI**.
- Cultura: de "sin ruta propia" a **ruta `/cultura` dedicada** (aunque sin
  modelo nuevo, sí implica una página y navegación adicional).
- Publicidad: de "solo 3 ubicaciones" a **ampliar choices + admin + mapeo en
  listados/detalle**.
- Entrevistas: se confirma agregar campos de contrato (no simplificar tarjetas).
- Páginas legales: se crean (no se omiten del footer).

Gestor de paquetes: **cambia respecto al PLAN.md original**, que asumía npm.
Se actualiza `PLAN.md` §Fase 1 tarea 3 y `CLAUDE.md` para reflejar pnpm.

## Pendiente operativo de Fase -1

- [x] Registrar decisiones (este documento).
- [x] Crear `backend_django/.env.example` (sin secretos).
- [x] Confirmar `.env` local con credenciales reales de Postgres — hecho;
      migraciones aplicadas y suite de tests (`manage.py test noticias`)
      verde contra la base real el 19 jul 2026.
- [x] Verificación end-to-end con backend + Redis + frontend reales
      (19 jul 2026): se detectó y corrigió `CORS_ALLOWED_ORIGINS` en
      `settings.py`, que no incluía `http://localhost:5173` (el puerto de
      dev documentado en CLAUDE.md), bloqueando todo desarrollo local
      contra el backend real hasta ahora.
- [ ] Baseline visual formal del frontend actual vs. el mock en los
      viewports acordados — se hicieron verificaciones puntuales por fase
      (dark/light, desktop/mobile) pero no una captura sistemática única.
- [ ] Inventario de rutas/controles actuales con decisión conservar/adaptar/
      retirar — resuelto de facto a través de las Fases 3-5 (tienda dormida,
      búsqueda implementada, legales creadas), pero no documentado como
      tabla aparte.
