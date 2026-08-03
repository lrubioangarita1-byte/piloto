/**
 * Backend + página del formulario "Reporte de Condición Insegura" (UCI Neonatal).
 * Este mismo script sirve el formulario (doGet) y guarda cada respuesta como fila
 * en esta hoja de cálculo (queda en Drive) y envía una notificación por correo
 * a calidad@nacersanoips.com. No requiere sitio web aparte: el link para el QR
 * es la propia URL de esta aplicación web.
 *
 * CÓMO DESPLEGARLO
 * Puede hacerlo cualquier cuenta de Google del dominio (por ejemplo info@nacersanoips.com),
 * no tiene que ser la de calidad@ — el correo de aviso igual llega a NOTIFY_EMAIL,
 * y la hoja se comparte con calidad@ en el paso 9.
 *
 * 1. Entra a https://sheets.google.com y crea una hoja de cálculo nueva.
 *    Llámala, por ejemplo, "Reportes Condicion Insegura - UCI Neonatal".
 * 2. En esa hoja: menú Extensiones > Apps Script.
 * 3. Borra el código de ejemplo y pega todo el contenido de este archivo en Código.gs.
 * 4. En el editor, agrega un archivo HTML nuevo (ícono + junto a "Archivos" > HTML)
 *    llamado exactamente "Formulario", y pega ahí el contenido de Formulario.html.
 * 5. Guarda el proyecto (ícono de disquete).
 * 6. Arriba a la derecha: Implementar > Nueva implementación.
 *    - Tipo: "Aplicación web".
 *    - Ejecutar como: "Yo" (la cuenta con la que creaste la hoja, ej. info@nacersanoips.com).
 *    - Quién tiene acceso: "Cualquier usuario".
 * 7. Autoriza los permisos que pida Google (enviar correo y editar la hoja).
 * 8. Copia la URL que te entrega ("URL de la aplicación web") — ese es el link
 *    para el código QR.
 * 9. Comparte esta hoja de cálculo con calidad@nacersanoips.com (Compartir > agregar su
 *    correo > permiso "Editor") para que también le quede accesible en su Drive.
 *
 * Si luego cambias el código o el HTML, los cambios NO se ven en la URL publicada
 * hasta que hagas: Implementar > Administrar implementaciones > ícono de lápiz >
 * Versión: "Nueva versión" > Implementar. Así la URL del QR no cambia nunca.
 */

const NOTIFY_EMAIL = 'calidad@nacersanoips.com';
const SHEET_NAME = 'Reportes';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Formulario')
    .setTitle('Reporte de Condición Insegura — UCI Neonatal')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function submitReport(data) {
  guardarYNotificar(data);
  return { ok: true };
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
