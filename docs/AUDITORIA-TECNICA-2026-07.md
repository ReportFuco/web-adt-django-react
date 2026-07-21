# Auditoría técnica y plan de remediación

Fecha de baseline: 21 de julio de 2026.

## Estado y propósito

Este es el plan técnico activo del repositorio. Debe guiar los cambios de
seguridad, rendimiento, Home móvil, API, media, arquitectura y entrega. No se
recomienda iniciar nuevas iniciativas grandes mientras queden hallazgos P0 sin
resolver, salvo decisión explícita del propietario.

La estrategia es incremental: conservar el monorepo React/Vite + Django/DRF,
estabilizar primero y modularizar después. No se recomiendan microservicios ni
una reescritura.

## Baseline verificado

- Lighthouse móvil: performance 46, FCP 5,9 s, LCP 13,5 s, TBT 260 ms y
  CLS 0,159.
- Build: JS inicial 106,08 KB gzip, chunk Home 7,70 KB gzip y CSS 11,53 KB
  gzip.
- Tests: frontend 12/12 y backend 10/10.
- Lint: 1 error y 4 warnings.
- pnpm audit --prod: 87 avisos (2 críticos, 31 altos, 48 moderados y 6
  bajos); cada aviso requiere triage de explotabilidad.
- Galería de producción: URLs de media devuelven HTML en lugar de imágenes.
- Home: aproximadamente 11 solicitudes API iniciales antes de contabilizar
  imágenes y terceros.

El baseline debe volver a medirse después de cada fase. No se deben comparar
resultados tomados con configuraciones de Lighthouse diferentes.

## Hallazgos priorizados

### P0 — Resolver antes de nuevas features

1. Corregir MEDIA_PUBLIC_BASE_URL/nginx y verificar que la galería entregue
   Content-Type: image/*.
2. Actualizar Django a la rama 5.2 LTS y actualizar Axios, DOMPurify, React
   Router, Vite y dependencias transitivas vulnerables.
3. Incorporar throttling en login, registro, reset, contacto, búsqueda y
   métricas.
4. Ejecutar validadores Django de contraseña en registro y reset.
5. Sustituir el thread por request del formulario de contacto; agregar timeout,
   control de workers y posteriormente una cola durable si el volumen lo exige.
6. Tienda descartada por decisión de producto: retirar su código, endpoints y
   dependencias; el proyecto de comercio continúa por separado.
7. Crear CI obligatoria y un despliegue reproducible con health check, smoke
   test y rollback.

### P1 — Rendimiento y estabilidad

1. Sacar DOMParser del render del Hero y recibir/precalcular resumen y tiempo
   de lectura.
2. Mantener montadas solo las capas activa/siguiente del Hero; una sola imagen
   inicial debe ser eager y fetchPriority=high.
3. Servir variantes 320/480/768/1200 con srcset, sizes, AVIF/WebP, dimensiones
   y caché immutable.
4. Crear /api/v1/home/ o contratos equivalentes con serializers de lista
   livianos. Eliminar consultas duplicadas del Header y agrupar anuncios.
5. Mantener altura externa constante en el Header; no animar padding/layout
   durante scroll.
6. Diferir GA, AdSense, contacto, galería y módulos bajo el fold hasta
   post-LCP/idle cuando sea compatible con producto.
7. Corregir galería y búsqueda para paginar/limitar en base de datos, N+1 de
   eventos/comentarios e invalidación global de Redis.
8. Corregir contratos paginados de comentarios.
9. Implementar logout/revocación JWT y refresh single-flight; evaluar refresh
   HttpOnly como endurecimiento posterior.
10. Añadir OpenAPI, contract tests, logging estructurado, Error Boundary, Web
    Vitals y health/readiness.

### P2 — Mantenibilidad

- Eliminar assets y dependencias huérfanas después de validar su uso histórico.
- Reducir el favicon de aproximadamente 250 KB.
- Self-host de Archivo variable WOFF2.
- Dividir Header.jsx, noticias/views.py, serializers y capa HTTP por
  responsabilidades, sin mover inicialmente los modelos de la app noticias.
- Corregir README/guías desactualizadas y mantener ADRs de decisiones.

## Arquitectura objetivo incremental

Frontend:

    src/
      app/                 router, providers y bootstrap
      core/                HTTP, auth, query, config y observabilidad
      shared/              UI, layout, hooks y utilidades
      features/
        home/
        news/
        events/
        interviews/
        gallery/
        search/
        comments/
        auth/

Regla de dependencias: app -> features -> core/shared. Core y shared no importan
features ni contienen modelos de negocio.

Backend:

    backend_django/
      config/settings/     base, development, production y test
      core/                health, logging, permisos y paginación
      noticias/
        api/viewsets/
        api/serializers/
        selectors/
        services/
        tasks/
        models.py

Los modelos permanecen inicialmente en noticias para evitar migraciones de app
labels. Se dividen archivos/imports antes de evaluar nuevas apps Django.

## Plan coordinado para cuatro agentes

### Agente 1 — Seguridad

Responsable de dependencias, Django, throttling, passwords, contacto, JWT y
retiro de la tienda. No debe editar la implementación del Home.

### Agente 2 — Home móvil

Responsable de Hero, Header, animaciones, accesibilidad, carga de terceros y
Web Vitals. Puede aplicar quick wins mientras espera el contrato del Agente 3.

### Agente 3 — API y media

Responsable del contrato Home, serializers, galería, búsqueda, N+1, variantes
de imágenes y caché. Coordina el contrato con el Agente 2 antes de integrarlo.

### Agente 4 — Plataforma

Responsable de CI, OpenAPI, observabilidad, documentación, AGENTS, health
checks, deploy atómico y rollback. Sus gates deben estar disponibles antes de
integrar cambios amplios.

## Orden de ejecución

1. Agentes 1, 3 y 4 comienzan en paralelo en archivos separados.
2. Agente 2 aplica quick wins sin contrato y coordina /api/v1/home/ con el
   Agente 3.
3. Integrar por cambios pequeños: seguridad/configuración, API/media, Home y
   plataforma.
4. Ejecutar el baseline completo y documentar diferencias.
5. No iniciar P2 hasta cerrar P0 y los P1 que bloquean rendimiento/seguridad.

## Criterios de salida

- Galería real funcionando y validada por tipo MIME.
- Lint, tests, build, checks Django, auditorías y contract tests verdes.
- Cero críticos/altos de producción sin triage y aceptación documentada.
- Lighthouse móvil inicial >=75, LCP <4 s y CLS <0,1; objetivo posterior de
  LCP <2,5 s.
- Home con máximo 3–4 solicitudes críticas y payload específico.
- Sin animaciones de propiedades de layout durante scroll.
- Rate limits y validación de passwords cubiertos por tests.
- Deploy con artefacto reproducible, smoke test y rollback probado.
- Documentación alineada con el comportamiento real.

## Registro de avance

Actualizar esta sección al cerrar bloques:

- [ ] P0 galería/media.
- [x] P0 dependencias y Django.
- [x] P0 throttling/passwords/contacto.
- [x] P0 decisión de store (retirada del repositorio; tablas históricas fuera de uso).
- [ ] P0 CI/deploy seguro.
- [ ] P1 Hero/Header móvil.
- [ ] P1 contrato Home y media responsive.
- [ ] P1 consultas, paginación y caché backend.
- [ ] P1 contratos, auth y observabilidad.
- [ ] P2 modularización y limpieza.
