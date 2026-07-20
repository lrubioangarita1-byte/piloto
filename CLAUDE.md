# CLAUDE.md — Piloto de Facturación y Auditoría UCI Neonatal

Este repositorio soporta un piloto de automatización para el área de
facturación y admisiones de una UCI Neonatal. El HIS de la clínica es
**Siscolsi**. Este documento define las reglas que cualquier sesión de
Claude Code (incluida esta) debe seguir al trabajar en este repositorio.

## Reglas de seguridad no negociables

1. **Solo lectura sobre Siscolsi.** Cualquier conexión a la base de datos
   de Siscolsi debe usar un usuario de BD sin permisos de escritura
   (`SELECT` únicamente). Nunca generar ni ejecutar `INSERT`, `UPDATE`,
   `DELETE`, `ALTER` u otro comando de escritura contra Siscolsi.
2. **Repositorio privado.** Este repositorio debe permanecer privado en
   GitHub. Nunca hacerlo público ni crear forks/mirrors públicos.
3. **Nunca commitear datos sensibles.** `.gitignore` debe excluir `.env`,
   credenciales, exportes de datos y cualquier archivo con datos de
   pacientes (nombres, documentos de identidad, historias clínicas,
   RIPS con datos identificados, etc.). Antes de un `git add`, revisar
   que no se esté incluyendo un archivo de este tipo.
4. **Datos sintéticos primero.** Todo desarrollo y prueba inicial
   (validador de RIPS, detección de HC incompletas, etc.) debe hacerse
   con datos sintéticos o desidentificados. No usar datos reales de
   pacientes hasta que el piloto esté validado y autorizado.
5. **No interferir con la operación actual.** Los usuarios actuales de
   Siscolsi deben poder seguir operando con normalidad. Ningún cambio de
   este proyecto debe modificar el comportamiento, los datos o el acceso
   de Siscolsi para sus usuarios habituales.
6. **Marco legal.** Este proyecto maneja datos potencialmente sujetos a
   la Ley 1581 de 2012 (Habeas Data) y la Resolución 1995 de 1999
   (historia clínica), además de la Resolución 2275/2023 para RIPS. La
   conexión a datos reales de pacientes requiere validación previa con
   el oficial de protección de datos / jurídico de la clínica. No asumir
   que esta validación ya ocurrió salvo que el usuario lo confirme.
7. **Separación de datos.** Railway y Supabase se usan únicamente para
   datos ya procesados y agregados (indicadores, dashboards), nunca para
   RIPS crudo ni datos identificados de pacientes.

## Contexto de arquitectura

- Un mini PC físico permanece encendido en la clínica, en la misma red
  que Siscolsi, y corre Claude Code + Node.js + Python + Git.
- El acceso remoto al mini PC es vía Tailscale + Claude Code Remote
  Control; el iPad de la administradora solo controla esa sesión remota,
  no instala nada localmente.
- La persona de facturación no programa: cualquier interfaz para ella
  debe ser simple (dashboard web, reporte, email), nunca Claude Code
  directamente.

## Fases del proyecto

Ver `README.md` para el detalle de fases (0 a 5). Este repositorio
implementa progresivamente: reglas de seguridad → validador de RIPS →
alertas de HC incompletas → indicadores/dashboard. No adelantar fases
que dependan de información aún no confirmada (p. ej. el esquema real de
Siscolsi) — usar datos sintéticos y dejar la integración real marcada
como pendiente hasta que Fase 0 esté resuelta con el equipo de
Siscolsi/facturación.
