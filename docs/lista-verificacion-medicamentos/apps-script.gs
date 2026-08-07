/**
 * Backend de la Lista de Verificación para la Administración Segura de
 * Medicamentos (UCIN). Recibe cada envío, lo guarda como fila en esta hoja
 * de cálculo (queda en Drive) y envía una notificación por correo a
 * coorenfermeria@nacersanoips.com. La página del formulario vive aparte,
 * en docs/lista-verificacion-medicamentos/index.html (GitHub Pages) — este
 * script solo recibe los datos por detrás, así que no importa qué cuenta
 * de Google tenga iniciada quien lo diligencie.
 *
 * CÓMO DESPLEGARLO
 * Puede hacerlo cualquier cuenta de Google (recomendado: la misma cuenta
 * personal ya usada para el formulario de condición insegura, para no
 * manejar demasiadas cuentas distintas).
 *
 * 1. Entra a https://sheets.google.com y crea una hoja de cálculo nueva.
 *    Llámala, por ejemplo, "Lista Verificacion Medicamentos - UCIN".
 * 2. En esa hoja: menú Extensiones > Apps Script.
 * 3. Borra el código de ejemplo y pega todo el contenido de este archivo.
 * 4. Guarda el proyecto (ícono de disquete).
 * 5. Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: "Yo".
 *    - Quién tiene acceso: "Cualquier usuario".
 * 6. Autoriza los permisos que pida Google.
 * 7. Copia la URL de la aplicación web y pégala como valor de
 *    APPS_SCRIPT_URL en docs/lista-verificacion-medicamentos/index.html.
 * 8. Comparte esta hoja con coorenfermeria@nacersanoips.com (y con quien
 *    más deba verla) como Editora.
 * 9. Además, en el mismo botón "Compartir", cambia el "Acceso general" a
 *    "Cualquier persona con el enlace" en modo "Lector" — esto evita el
 *    mismo problema de acceso que tuvimos con el otro formulario.
 */

const NOTIFY_EMAIL = 'coorenfermeria@nacersanoips.com';
const SHEET_NAME = 'Respuestas';

const ITEM_LABELS = [
  '1. Orden médica completa, vigente y legible',
  '2. Identidad del recién nacido confirmada',
  '3. Indicación correcta del medicamento',
  '4. Medicamento correcto',
  '5. Dosis correcta',
  '6. Vía correcta de administración',
  '7. Hora correcta de administración',
  '8. Higiene de manos antes de preparar',
  '9. Nombre, concentración, envase y vencimiento verificados',
  '10. Técnica aséptica en la preparación',
  '11. Diluyente y volumen correctos',
  '12. Jeringas/soluciones etiquetadas',
  '13. Compatibilidad con otros medicamentos verificada',
  '14. Paciente correcto reconfirmado',
  '15. Asepsia del acceso antes de administrar',
  '16. Permeabilidad del acceso venoso verificada',
  '17. Bomba de infusión programada correctamente',
  '18. Tiempo y velocidad de administración respetados',
  '19. Respuesta clínica vigilada',
  '20. Signos vitales monitoreados',
  '21. Reacciones adversas reportadas de inmediato',
  '22. Administración registrada en historia clínica',
  '23. Respuesta del paciente registrada',
  '24. Eventos adversos documentados',
  '25. Educación a la familia brindada',
  '26. Residuos y cortopunzantes eliminados correctamente',
  '27. Higiene de manos al finalizar',
  '28. Registro completo y oportuno',
  '29. Derecho a atención segura garantizado'
];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Fecha de registro', 'Fecha', 'Nombre de quien evalúa', 'Cargo'].concat(ITEM_LABELS).concat(['Observaciones']));
  }

  const items = data.items || [];
  const row = [new Date(), data.fecha || '', data.nombre || '', data.cargo || ''].concat(items).concat([data.observaciones || '']);
  sheet.appendRow(row);

  const noItems = [];
  items.forEach((val, i) => {
    if (val === 'No') noItems.push(ITEM_LABELS[i]);
  });

  let body =
    'Se registró una nueva Lista de Verificación de Administración Segura de Medicamentos:\n\n' +
    'Fecha: ' + (data.fecha || '') + '\n' +
    'Evaluado por: ' + (data.nombre || '') + ' (' + (data.cargo || '') + ')\n\n';

  if (noItems.length > 0) {
    body += '⚠ Ítems marcados como "No" (' + noItems.length + '):\n' + noItems.map(t => '- ' + t).join('\n') + '\n\n';
  } else {
    body += 'Todos los ítems se marcaron como Sí o N/A.\n\n';
  }

  if (data.observaciones) {
    body += 'Observaciones:\n' + data.observaciones + '\n\n';
  }

  body += 'Ver el detalle completo en Drive: ' + ss.getUrl();

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Lista de Verificación de Medicamentos — UCI Neonatal' + (noItems.length > 0 ? ' (con hallazgos)' : ''),
    body: body
  });

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
