/**
 * Backend de la Encuesta de Retroalimentación de Capacitaciones (UCI Neonatal).
 * Es anónima a propósito: no recibe ni guarda nombre ni ningún dato que
 * identifique a quien responde. Guarda cada respuesta como fila en esta
 * hoja de cálculo (queda en Drive) y envía una notificación por correo a
 * info@nacersanoips.com.
 *
 * CÓMO DESPLEGARLO
 * Puede hacerlo cualquier cuenta de Google (recomendado: la misma cuenta
 * personal ya usada para los otros formularios).
 *
 * 1. Entra a https://sheets.google.com y crea una hoja de cálculo nueva.
 *    Llámala, por ejemplo, "Encuesta Capacitaciones - UCI Neonatal".
 * 2. En esa hoja: menú Extensiones > Apps Script.
 * 3. Borra el código de ejemplo y pega todo el contenido de este archivo.
 * 4. Guarda el proyecto (ícono de disquete).
 * 5. Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: "Yo".
 *    - Quién tiene acceso: "Cualquier usuario".
 * 6. Autoriza los permisos que pida Google.
 * 7. Copia la URL de la aplicación web y pégala como valor de
 *    APPS_SCRIPT_URL en docs/encuesta-capacitaciones/index.html.
 * 8. Comparte esta hoja con info@nacersanoips.com (si no es ya la cuenta
 *    dueña) como Editora.
 */

const NOTIFY_EMAIL = 'info@nacersanoips.com';
const SHEET_NAME = 'Respuestas';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha de registro', 'Capacitación', 'Aspectos positivos', 'A reforzar', 'Otros comentarios']);
  }

  sheet.appendRow([
    new Date(),
    data.capacitacion || '',
    data.positivo || '',
    data.reforzar || '',
    data.comentarios || ''
  ]);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Nueva respuesta — Encuesta de Capacitaciones (anónima)',
    body:
      'Se registró una nueva respuesta anónima de la encuesta de capacitaciones:\n\n' +
      'Capacitación: ' + (data.capacitacion || '(no especificada)') + '\n\n' +
      'Aspectos positivos:\n' + (data.positivo || '(sin comentario)') + '\n\n' +
      'A reforzar:\n' + (data.reforzar || '(sin comentario)') + '\n\n' +
      'Otros comentarios:\n' + (data.comentarios || '(sin comentario)') + '\n\n' +
      'Ver historial completo en Drive: ' + ss.getUrl()
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
