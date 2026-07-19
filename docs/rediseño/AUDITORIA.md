# Auditoría del plan de rediseño

Fecha: 19 de julio de 2026

## Veredicto

La dirección visual y la separación original entre `PLAN.md` (ejecución) y
`DESIGN.md` (reglas) son buenas. El plan cubría los módulos principales del mock,
temas, responsive y accesibilidad.

Antes de esta revisión no era ejecutable de punta a punta: asumía contratos que
el backend no tiene, dejaba decisiones bloqueantes para fases tardías y exigía
criterios que la infraestructura actual no puede demostrar. `PLAN.md` fue
reestructurado para comenzar con decisiones, contratos y baseline antes de
tokens/componentes.

## Método

Se contrastaron:

- `docs/rediseño/PLAN.md` y `DESIGN.md`;
- el DOM/CSS/JS de `docs/mocks/index.html`;
- render del mock en navegador Chromium, desktop y responsive;
- rutas, servicios y componentes React;
- modelos, serializers, permisos, paginación y configuración Django;
- scripts, dependencias, lockfiles y pruebas existentes.

Tres revisiones independientes cubrieron estructura del plan, mock visual y
arquitectura/código. Los hallazgos coincidentes se elevaron de prioridad.

## Lo que estaba bien

- Separación clara entre sistema visual y orden de implementación.
- Fases, alcance y definiciones de terminado fáciles de recorrer.
- Mapa inicial mock → componente → backend.
- Stack correctamente identificado: React/Vite/Tailwind 4 y Django REST.
- Decisión explícita de no reactivar checkout/Mercado Pago.
- Preservación de sanitizer, SEO, auth y tracking como preocupaciones.
- Atención temprana a tema, teclado y reduced motion.

## Bloqueos críticos

### 1. Contacto no coincide con el backend

El mock y el formulario actual envían `mensaje`; el frontend actual también envía
`asunto`. El modelo `Contacto` solo contiene nombre, apellido, email, teléfono y
fecha. Esos campos adicionales serán rechazados.

Además, `ContactoViewSet` permite `retrieve` anónimo, lo que expone datos de
contacto por ID. Solo `create` debe ser público.

Resolución incluida en el plan:

- decidir migración de `mensaje`/`asunto` o retirar campos;
- actualizar serializer, admin y notificación;
- corregir permisos;
- probar `POST → 201`, persistencia y privacidad.

### 2. El flujo de refresh JWT no debe “preservarse” tal como está

Django rota y bloquea refresh tokens, pero el frontend solo guarda el access
nuevo e ignora el refresh rotado. La siguiente renovación puede fallar.

Resolución incluida: corregir el almacenamiento y probar dos renovaciones
consecutivas antes de reestilizar auth.

### 3. El ejemplo `@theme` era copiable pero inválido

`DESIGN.md` hacía autorreferencia en `--font-display`, `--font-body` y
`--ease-standard`; además un comentario con `*/` podía cerrar antes de tiempo.

Se separaron nombres runtime `--adt-*` de los nombres Tailwind.

### 4. La UI no puede distinguir vacío de error

Los servicios de listas capturan cualquier fallo y devuelven `[]`; además
descartan `count`, `next` y `previous`. Eso hace imposible cumplir los estados
loading/empty/error y limita filtros/listados a la primera página.

Resolución incluida: contrato común paginado y errores propagados en Fase 0.

### 5. El mock requiere contenido que no existe

- Entrevistas: no hay cita, extracto ni rol.
- Hero: no hay contrato explícito de bajada/tiempo de lectura/crédito.
- Fotos: no hay campo de crédito.
- Galería: no existe endpoint agregado ni orden global.
- Próximos eventos: `fecha_hora` puede devolver una fecha pasada como fallback.

Resolución incluida: cada módulo debe declarar fuente, filtro, orden, límite,
fallback, deduplicación y campos antes de implementarse.

## Contraste mock → plan → realidad

| Área | Mock / intención | Realidad del proyecto | Resultado |
|---|---|---|---|
| Hero | 1 lead + 4 apoyos | Hay `destacado`, pero no selector/fallback/deduplicación | Contrato previo |
| Noticias | 4 filas | API paginada; helper descarta metadata y errores | Refactor servicio |
| Eventos | 4 próximos | `fecha_hora` puede caer a evento pasado | Filtro explícito |
| Entrevistas | Retrato + cita + rol | No existen cita/rol; retratos del mock colapsan | Campo o rediseño |
| Galería | 6 fotos globales | Fotos anidadas en primeros 20 padres | Endpoint/algoritmo |
| Contacto | Incluye mensaje | Backend no tiene mensaje/asunto | Migración/decisión |
| Publicidad | Billboard en flujo | Solo 3 ubicaciones de home | Alinear posiciones |
| Cultura | Nav y galería | Sin ruta/entidad propia | Decisión de producto |
| Buscar | Botón en Header | Sin ruta, endpoint ni interacción | Definir o retirar |
| Comentarios | Detalles editoriales | Modelo ligado solo a noticia | Solo noticias |
| Shell | Header/ticker/footer global | Cada página los monta; auth difiere | Crear `AppShell` |
| Store | Ausente del mock | Provider, carrito y fetch aún se ejecutan | Dormir ejecución |
| SEO | Enlaces editoriales | URLs mezclan `id+slug` y solo `slug` | Preservar/redirect |

## Defectos del mock que no deben copiarse

1. Los retratos de entrevista no renderizan: `.media` no es bloque y el `<a>`
   vacío no adquiere altura por `aspect-ratio`.
2. El menú usa `aria-controls="mobile-nav"` sin un ID correspondiente y no
   maneja Escape, foco, cierre, resize ni retorno de foco.
3. “Eventos” aparece como página actual dentro del home.
4. Buscar no tiene comportamiento.
5. El ticker puede saltar: mover una lista con cinco gaps exactamente `-50%` no
   garantiza dos mitades geométricamente iguales.
6. `display: contents` en el enlace de noticias deja un foco visual frágil.
7. Targets táctiles de 28, 36, 38 y 40 px contradicen el mínimo de 44 px.
8. Una auditoría de accesibilidad detectó 27 incidencias, principalmente
   contraste de texto pequeño, límites de controles y ARIA.
9. Los breakpoints reales incluyen 600, 560, 520 y 460 px; no estaban reflejados
   correctamente en `DESIGN.md`.
10. Las imágenes del mock suman aproximadamente 8,7 MB y usan fondos sin
    `srcset`, lazy loading ni dimensiones intrínsecas.
11. El mock conserva referencias a `BRANDING.md` y `00-resumen.md`, ya
    inexistentes.

## Cambios aplicados al plan

- Se añadió Fase -1 para decisiones, alcance, URLs y baseline visual.
- Se añadió Fase 0 para contratos, seguridad, auth, paginación, galería,
  contenido editorial y pruebas de backend.
- Tokens pasan a Fase 1; el cambio de fuente queda como diferencia intencional,
  no como “regresión visual nula”.
- El kit UI exige harness y pruebas; suma `AgendaRow`, estados y publicidad.
- Se introduce `AppShell` antes de reescribir Header/Footer.
- Home se implementa por cortes verticales y selectores documentados.
- Comentarios quedan limitados a noticias.
- SEO exige conservar URLs o agregar redirects/canonical probados.
- QA incorpora viewports/temas definidos, pruebas, sitemap paginado, rendimiento,
  smoke post-deploy y rollback.
- La tienda se considera fuera de alcance funcional, pero se reconoce y retira
  su ejecución actual si la decisión se confirma.

## Decisiones que aún requieren al dueño

1. Confirmar Archivo como fuente.
2. Confirmar npm como único gestor.
3. Confirmar tienda/carrito dormidos y retiro de consumidores en ejecución.
4. Elegir dónde viven las métricas de comunidad.
5. Definir Cultura/Galería.
6. Aprobar `mensaje` y, opcionalmente, `asunto` en Contacto.
7. Aprobar cita/extracto/rol y crédito fotográfico, o simplificar tarjetas.
8. Definir búsqueda o retirar el botón.
9. Decidir ubicación de login/logout/usuario en el nuevo shell.
10. Limitar anuncios al home o ampliar ubicaciones.
11. Confirmar URLs públicas, legales, créditos y newsletter.
12. Elegir endpoint global de galería o agregación cliente documentada.

## Verificación realizada y límites

- El mock se sirvió localmente y se inspeccionó renderizado.
- El backend no pudo completar `manage.py check` porque falta `DB_NAME` y no hay
  plantilla local de variables.
- El frontend no tiene `node_modules` en el workspace, por lo que no se ejecutaron
  lint/build.
- Los `tests.py` Django están vacíos y `package.json` no define runner frontend;
  actualmente no existe una suite capaz de demostrar “sin regresiones”.

La próxima acción correcta no es empezar por el Header: es cerrar las decisiones
de Fase -1 y convertir los contratos de Fase 0 en pruebas ejecutables.
