/**
 * Backend del formulario "Reporte de Condición Insegura" (UCI Neonatal).
 * Recibe cada reporte, lo guarda como fila en una Google Sheet (queda en Drive)
 * y envía una notificación por correo a calidad@nacersanoips.com.
 *
 * CÓMO DESPLEGARLO (hacerlo desde la cuenta de Google de calidad@nacersanoips.com,
 * o una cuenta de Workspace con permiso para enviar correo y crear archivos en ese Drive):
 *
 * 1. Entra a https://sheets.google.com y crea una hoja de cálculo nueva.
 *    Llámala, por ejemplo, "Reportes Condicion Insegura - UCI Neonatal".
 * 2. En esa hoja: menú Extensiones > Apps Script.
 * 3. Borra el código de ejemplo y pega todo el contenido de este archivo.
 * 4. Guarda el proyecto (ícono de disquete).
 * 5. Arriba a la derecha: Implementar > Nueva implementación.
 *    - Tipo: "Aplicación web".
 *    - Ejecutar como: "Yo" (tu cuenta, calidad@nacersanoips.com).
 *    - Quién tiene acceso: "Cualquier usuario".
 * 6. Autoriza los permisos que pida Google (enviar correo y editar la hoja).
 * 7. Copia la URL que te entrega ("URL de la aplicación web").
 * 8. Pega esa URL como valor de APPS_SCRIPT_URL en index.html.
 *
 * Cada vez que alguien envíe el formulario, se agrega una fila a esta hoja
 * (que vive en el Drive de calidad@nacersanoips.com) y llega un correo
 * a NOTIFY_EMAIL con el detalle del reporte.
 */

const NOTIFY_EMAIL = 'calidad@nacersanoips.com';
const SHEET_NAME = 'Reportes';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

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

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
