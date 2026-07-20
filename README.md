# Piloto: Automatización de Facturación y Auditoría — UCI Neonatal

Piloto para ayudar al área de facturación y admisiones de una UCI
Neonatal a:

- Validar RIPS antes de enviarlos.
- Detectar historias clínicas (HC) incompletas mediante alertas
  automáticas.
- Calcular indicadores de calidad.
- Reducir glosas y maximizar facturación.

Las reglas de seguridad no negociables de este proyecto están en
[`CLAUDE.md`](./CLAUDE.md) y aplican a cualquier desarrollo aquí.

## Contexto clave

- HIS: **Siscolsi** (requiere PC no-iOS, aplicación de escritorio
  local).
- La administradora viaja mucho; solo está presencial en la clínica una
  semana al mes.
- La persona de facturación no programa: usará una interfaz simple, no
  Claude Code directamente.
- Ya existen cuentas en Railway, Supabase y GitHub.

## Arquitectura

Un mini PC físico permanece en la clínica, siempre encendido, en la
misma red que Siscolsi:

- Es el "PC no-iOS" que Siscolsi exige.
- Corre Claude Code + Node.js + Python + Git de forma permanente.
- Se conecta remotamente vía Tailscale (red privada) + Claude Code
  Remote Control.
- Desde el iPad solo se controla remotamente esa sesión — no se instala
  nada en el iPad.
- Railway/Supabase se usan solo para datos ya procesados (indicadores,
  dashboards), nunca para el RIPS crudo ni datos identificados de
  pacientes.

## Fases del proyecto

### Fase 0 — Preparación (antes de tocar código)

- Preguntar a Siscolsi: ¿motor de base de datos? ¿permiten usuario de
  solo lectura? ¿documentación del esquema?
- Validar con jurídico/protección de datos si el piloto requiere trámite
  formal.
- Con facturación: identificar las 3 causas más frecuentes de glosas
  hoy.

### Fase 1 — Infraestructura

- Comprar e instalar mini PC en la red de la clínica (presencia física
  única, ~30 min: energizar, conectar a red, instalar Tailscale).
- Instalar Node.js, Python, Git, Claude Code en el mini PC.
- Activar Remote Control y probar acceso desde el iPad.

### Fase 2 — Repositorio y reglas de seguridad

- Crear repositorio privado en GitHub. ✅
- Clonarlo en el mini PC (no en el iPad).
- Escribir `CLAUDE.md` con las reglas de seguridad. ✅
- Conectar MCP de GitHub y Supabase.

### Fase 3 — Validador de RIPS

- Construir validador en Python contra la estructura oficial
  (Resolución 2275/2023).
- Probar primero con RIPS ya generados (sin conexión viva a Siscolsi).
- Conectar lectura directa a Siscolsi solo cuando el validador esté
  calibrado.

### Fase 4 — Alertas de HC incompletas

- Definir con facturación qué campos/soportes son obligatorios.
- Query de solo lectura que detecte HC incompletas.
- Alerta simple (email o reporte diario).

### Fase 5 — Indicadores y dashboard

- Datos procesados (sin identificación de paciente) suben a Supabase.
- Dashboard simple en Railway para que facturación lo consulte desde su
  navegador.
- Facturación nunca toca Claude Code ni el mini PC directamente.

## Marco legal

Ley 1581 de 2012 (Habeas Data) y Resolución 1995 de 1999 (historia
clínica). Validar con el oficial de protección de datos antes de
conectar datos reales de pacientes.
