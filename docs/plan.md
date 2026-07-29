# Plan del proyecto — Automatización de Facturación y Auditoría UCI Neonatal

## Objetivo

Ayudar a la persona de facturación y admisiones a:

- Validar RIPS antes de enviarlos
- Detectar historias clínicas (HC) incompletas mediante alertas automáticas
- Calcular indicadores de calidad
- Reducir glosas y maximizar facturación

## Contexto clave

- HIS: Siscolsi — requiere PC no-iOS (aplicación de escritorio local, no web).
- La administradora viaja mucho, solo 1 semana/mes presencial en la clínica.
- La persona de facturación no programa: usará una interfaz simple, no Claude Code directamente.
- Ya existen cuentas en Railway, Supabase y GitHub.

## Arquitectura elegida

Mini PC físico dejado en la clínica, siempre encendido, en la misma red que Siscolsi.

- Es el "PC no-iOS" que Siscolsi exige.
- Corre Claude Code + Node.js + Python + Git de forma permanente.
- Se conecta a él remotamente vía Tailscale (red privada) + Claude Code Remote Control.
- Desde el iPad solo se controla remotamente esa sesión — no se instala nada en el iPad.
- Railway/Supabase se usan para datos ya procesados (indicadores, dashboards), nunca para el RIPS crudo ni datos identificados de pacientes.

## Reglas de seguridad no negociables

Ver [`../CLAUDE.md`](../CLAUDE.md) — se mantienen sincronizadas ahí para que el agente las respete en cada tarea.

1. Conexión a Siscolsi solo de lectura (usuario de BD sin permisos de escritura).
2. Repositorio en GitHub privado, nunca público.
3. `.gitignore` excluyendo `.env`, credenciales, exportes, cualquier archivo con datos de pacientes.
4. Pruebas iniciales con datos sintéticos/desidentificados, no datos reales.
5. Usuarios actuales de Siscolsi siguen operando normal, sin cambios.
6. Marco legal aplicable: Ley 1581 de 2012 (Habeas Data) y Resolución 1995 de 1999 (historia clínica) — validar con oficial de protección de datos antes de conectar datos reales.

## Fases del proyecto

### Fase 0 — Preparación (antes de tocar código)

- Preguntar a Siscolsi: ¿motor de base de datos? ¿permiten usuario de solo lectura? ¿documentación del esquema?
  - Motor de base de datos: **PostgreSQL** (confirmado por un trabajador de la clínica; re-confirmar con quien administre la base de datos al pedir el usuario de solo lectura).
  - Software instalado: "Software SISS", versión 5.0.42, Windows — Siscolsi S.A.S.
  - Pendiente: ¿usuario de solo lectura disponible? ¿documentación del esquema? ¿host/puerto de acceso en red?
- Validar con jurídico/protección de datos si el piloto requiere trámite formal. — pendiente.
- Con facturación: identificar las 3 causas más frecuentes de glosas hoy. — pendiente.

### Fase 1 — Infraestructura

- Comprar e instalar mini PC en la red de la clínica (requiere presencia física una sola vez, ~30 min: energizar, conectar a red, instalar Tailscale). ✅
- Instalar Node.js, Python, Git, Claude Code en el mini PC. ✅
- Activar Remote Control y probar acceso desde el iPad. ✅

### Fase 2 — Repositorio y reglas de seguridad

- Crear repositorio privado en GitHub. ✅
- Clonarlo en el mini PC (no en el iPad). ✅
- Escribir `CLAUDE.md` con las reglas de seguridad. ✅
- Conectar MCP de GitHub y Supabase. — pendiente.

### Fase 3 — Validador de RIPS

- Construir validador en Python contra la estructura oficial (Resolución 2275/2023).
- Probar primero con RIPS ya generados (sin conexión viva a Siscolsi).
- Conectar lectura directa a Siscolsi solo cuando el validador esté calibrado.

### Fase 4 — Alertas de HC incompletas

- Definir con facturación qué campos/soportes son obligatorios.
- Query de solo lectura que detecte HC incompletas.
- Alerta simple (email o reporte diario).

### Fase 5 — Indicadores y dashboard

- Datos procesados (sin identificación de paciente) suben a Supabase.
- Dashboard simple en Railway para que facturación lo consulte desde su navegador.
- Facturación nunca toca Claude Code ni el mini PC directamente.

## Próximo paso

Fase 1 completa. Cerrar Fase 0: confirmar formalmente con soporte de Siscolsi el motor de base de datos (PostgreSQL, dato preliminar), pedir usuario de solo lectura y documentación del esquema, validar con jurídico, y hablar con facturación sobre las causas de glosas.
