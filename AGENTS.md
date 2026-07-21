# AGENTS.md

## Lectura obligatoria antes de trabajar

Este repositorio tiene una auditoría técnica activa y un plan de remediación
priorizado en `docs/AUDITORIA-TECNICA-2026-07.md`.

Todo agente debe, antes de proponer o aplicar cambios:

1. Leer completo `docs/AUDITORIA-TECNICA-2026-07.md`.
2. Identificar la fase y el frente del plan al que pertenece la solicitud.
3. Revisar las dependencias y criterios de salida de esa fase.
4. Mantener actualizado el estado del plan cuando complete trabajo relacionado.

## Continuidad obligatoria del plan

El plan de auditoría es la ruta de trabajo recomendada y no debe tratarse como
una lista opcional. Al iniciar una conversación de implementación, el agente
debe recordar al usuario que conviene continuar con el plan hasta cerrar sus
hallazgos P0 y P1, y proponer el siguiente bloque pendiente como paso inmediato.

Si el usuario solicita trabajo no relacionado, el agente debe advertir de forma
breve qué prioridad del plan sigue abierta y recomendar retomarla después. No
debe bloquear ni reemplazar una instrucción explícita del usuario: el usuario
puede pausar, reordenar o sustituir el plan conscientemente.

## Reglas de ejecución

- No iniciar una reestructuración masiva ni migrar a microservicios. La
  arquitectura objetivo es modular e incremental.
- Mantener cuatro frentes con ownership claro: seguridad, Home móvil,
  API/media y plataforma/CI.
- Evitar que dos agentes editen simultáneamente los mismos archivos.
- Todo cambio debe incluir validación proporcional: lint, tests, build,
  chequeos Django, contract tests o Lighthouse según corresponda.
- No desplegar a producción sin autorización explícita, smoke tests y una vía
  de rollback.
- No marcar una fase como terminada mientras sus criterios de salida sigan
  pendientes.

## Documentos relacionados

- `docs/AUDITORIA-TECNICA-2026-07.md`: auditoría y plan técnico activo.
- `docs/rediseño/DESIGN.md`: sistema visual y reglas de accesibilidad.
- `docs/rediseño/DECISIONES.md`: decisiones de producto aprobadas.
- `docs/rediseño/PLAN.md`: plan histórico del rediseño visual.

Cuando exista conflicto, una instrucción explícita y reciente del usuario tiene
prioridad. Para decisiones visuales sigue mandando DESIGN.md; para el orden de
remediación técnica manda AUDITORIA-TECNICA-2026-07.md.
