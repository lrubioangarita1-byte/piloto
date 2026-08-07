/**
 * Backend del formulario "Reporte de Condición Insegura" (UCI Neonatal).
 * La página del formulario vive en docs/reporte-condicion-insegura/index.html
 * (GitHub Pages) y le manda los datos a este script por detrás (fetch),
 * así que no importa qué cuenta de Google tenga iniciada quien lo llena —
 * eso fue lo que causaba que a algunas personas (ej. cuentas @nacersanoips.com)
 * les fallara al entrar directamente al link de script.google.com.
 * Este script solo guarda cada respuesta como fila en esta hoja de cálculo
 * (queda en Drive) y envía una notificación por correo a calidad@nacersanoips.com.
 *
 * CÓMO DESPLEGARLO
 * Puede hacerlo cualquier cuenta de Google (recomendado: la misma cuenta
 * personal ya usada anteriormente, para no manejar cuentas de más).
 *
 * 1. Entra a https://sheets.google.com y crea una hoja de cálculo nueva.
 *    Llámala, por ejemplo, "Reportes Condicion Insegura - UCI Neonatal".
 * 2. En esa hoja: menú Extensiones > Apps Script.
 * 3. Borra el código de ejemplo y pega todo el contenido de este archivo.
 * 4. Guarda el proyecto (ícono de disquete).
 * 5. Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: "Yo".
 *    - Quién tiene acceso: "Cualquier usuario".
 * 6. Autoriza los permisos que pida Google.
 * 7. Copia la URL de la aplicación web y pégala como valor de
 *    APPS_SCRIPT_URL en docs/reporte-condicion-insegura/index.html.
 * 8. Comparte esta hoja con calidad@nacersanoips.com (y con quien más deba
 *    verla) como Editora.
 * 9. Además, en "Compartir", cambia el "Acceso general" a "Cualquier persona
 *    con el enlace" en modo "Lector" — esto evita bloqueos de acceso.
 *
 * Si ya tenías este script desplegado (versión anterior con doGet), solo
 * reemplaza el código por este y crea una Nueva versión de la implementación
 * (Implementar > Administrar implementaciones > lápiz > Nueva versión) — la
 * URL no cambia.
 */

const NOTIFY_EMAIL = 'calidad@nacersanoips.com';
const SHEET_NAME = 'Reportes';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  guardarYNotificar(data);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function guardarYNotificar(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha de registro', 'Fecha del reporte', 'Quién reporta', 'Área', 'Clasificación', 'Descripción']);
  }

  sheet.appendRow([
    new Date(),
    data.fecha || '',
    data.quien || '',
    data.area || '',
    data.clasificacion || '',
    data.descripcion || ''
  ]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Nuevo reporte de condición insegura — UCI Neonatal',
    body:
      'Se registró un nuevo reporte de condición insegura:\n\n' +
      'Fecha: ' + (data.fecha || '') + '\n' +
      'Quién reporta: ' + (data.quien || '') + '\n' +
      'Área: ' + (data.area || '') + '\n' +
      'Clasificación: ' + (data.clasificacion || '') + '\n' +
      'Descripción:\n' + (data.descripcion || '') + '\n\n' +
      'Ver historial completo en Drive: ' + ss.getUrl()
  });
}
