# Piloto — Automatización de Facturación y Auditoría UCI Neonatal

## Objetivo del proyecto

Ayudar a la persona de facturación y admisiones a:

- Validar RIPS antes de enviarlos
- Detectar historias clínicas (HC) incompletas mediante alertas automáticas
- Calcular indicadores de calidad
- Reducir glosas y maximizar facturación

## Contexto operativo

- HIS de la clínica: **Siscolsi** (requiere PC no-iOS; aplicación local de escritorio).
- La administradora viaja mucho: solo 1 semana/mes presencial en la clínica.
- La persona de facturación no programa: usará una interfaz simple, nunca Claude Code directamente.
- Arquitectura: un mini PC físico permanece encendido en la clínica, en la misma red que Siscolsi, corriendo Claude Code + Node.js + Python + Git. Se controla remotamente vía Tailscale + Claude Code Remote Control (por ejemplo desde iPad), sin instalar nada en el dispositivo remoto.
- Railway/Supabase se usan solo para datos ya procesados y desidentificados (indicadores, dashboards) — **nunca** para el RIPS crudo ni datos identificados de pacientes.

## Reglas de seguridad no negociables

1. **Conexión a Siscolsi solo de lectura.** El usuario de base de datos usado por esta automatización nunca debe tener permisos de escritura/DDL/DML sobre la base de Siscolsi.
2. **Repositorio siempre privado.** Nunca debe hacerse público en GitHub.
3. **`.gitignore` estricto.** Deben quedar excluidos `.env`, credenciales, exportes de datos, y cualquier archivo que contenga datos de pacientes (RIPS crudo, HC, identificadores).
4. **Datos sintéticos primero.** Todo desarrollo y prueba inicial se hace con datos sintéticos o desidentificados. No se usan datos reales de pacientes hasta que el piloto esté validado jurídicamente.
5. **No intervenir la operación actual.** Los usuarios actuales de Siscolsi siguen operando con total normalidad; esta automatización es de solo lectura y no debe modificar flujos existentes.
6. **Marco legal aplicable:** Ley 1581 de 2012 (Habeas Data) y Resolución 1995 de 1999 (historia clínica). Se debe validar con el oficial de protección de datos de la clínica antes de conectar datos reales de pacientes.

Cualquier cambio de código que toque credenciales de Siscolsi, exportes de RIPS o datos de pacientes debe respetar estas reglas sin excepción. Si una tarea las contradice, hay que detenerse y preguntar antes de proceder.

## Fases del proyecto

- **Fase 0 — Preparación:** preguntas a Siscolsi (motor de BD, usuario de solo lectura, esquema documentado), validación jurídica/protección de datos, y con facturación: identificar las 3 causas más frecuentes de glosas.
- **Fase 1 — Infraestructura:** mini PC en la red de la clínica, Node.js/Python/Git/Claude Code instalados, Remote Control activo y probado desde iPad.
- **Fase 2 — Repositorio y reglas de seguridad:** repo privado en GitHub, clonado solo en el mini PC, este `CLAUDE.md`, MCP de GitHub y Supabase conectados.
- **Fase 3 — Validador de RIPS:** validador en Python contra la estructura oficial (Resolución 2275/2023). Probar primero con RIPS ya generados, sin conexión viva a Siscolsi. Conectar lectura directa solo cuando el validador esté calibrado.
- **Fase 4 — Alertas de HC incompletas:** definir con facturación los campos/soportes obligatorios, query de solo lectura, alerta simple (email o reporte diario).
- **Fase 5 — Indicadores y dashboard:** datos procesados (sin identificación de paciente) suben a Supabase; dashboard simple en Railway para consulta de facturación desde su navegador. Facturación nunca toca Claude Code ni el mini PC directamente.

Ver detalle completo del plan en `docs/plan.md`.
