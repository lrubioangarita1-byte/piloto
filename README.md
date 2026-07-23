# Nutre — Psicología y bienestar

Sitio web estático (HTML, CSS y JavaScript sin dependencias) para un proyecto
de psicología y bienestar enfocado en mejorar la relación de las personas
con la comida.

## Contenido del sitio

- **Inicio** (`index.html`): presentación del proyecto y sus pilares.
- **Artículos** (`articulos.html` y `articulos/*.html`): textos educativos
  sobre relación con la comida, alimentación consciente, comer emocional y
  ansiedad, e imagen corporal.
- **Recursos** (`recursos.html`): datos, señales de alerta y mitos frente a
  realidades sobre la relación con la comida.
- **Videos** (`videos.html`): charlas y guías en video (ver más abajo cómo
  publicar una nueva).
- **Habla con alguien** (`hablar.html`): formulario para agendar una primera
  conversación con un profesional. El formulario envía correos reales (ver
  más abajo cómo activarlo).
- **Sobre nosotros** (`sobre-nosotros.html`): misión y enfoque del proyecto.

## Estructura de archivos

```
├── index.html
├── articulos.html
├── articulos/
│   ├── relacion-con-la-comida.html
│   ├── alimentacion-consciente.html
│   ├── comer-emocional-y-ansiedad.html
│   └── imagen-corporal-autoestima.html
├── recursos.html
├── videos.html
├── hablar.html
├── sobre-nosotros.html
├── css/styles.css
└── js/
    ├── main.js          # navegación móvil + envío del formulario
    ├── videos.js         # arma la página de videos
    └── videos-data.js    # lista de videos editable (ver abajo)
```

## Cómo verlo localmente

No requiere instalación ni build. Basta con levantar un servidor estático
en la raíz del proyecto, por ejemplo:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000` en el navegador.

## Cómo funciona el formulario de contacto

El formulario de `hablar.html` envía los datos a
[FormSubmit](https://formsubmit.co), un servicio gratuito que reenvía la
información por correo sin necesidad de programar un backend propio. Está
configurado para enviar a `lrubioangarita1@gmail.com`.

**Paso obligatorio para activarlo:** la primera vez que alguien complete el
formulario, FormSubmit va a mandar un correo de confirmación a
`lrubioangarita1@gmail.com` pidiendo activar ese formulario (un solo clic).
Ese primer envío de prueba no llega como mensaje normal hasta confirmar el
correo; a partir de ahí, todos los envíos del formulario llegan directo a
la bandeja de entrada con el asunto "Nueva solicitud de conversación · Nutre".

Si en algún momento quieres cambiar el correo de destino o migrar a otro
proveedor (Formspree, un backend propio, etc.), el único lugar que hay que
tocar es el atributo `data-formsubmit-endpoint` del `<form>` en `hablar.html`
y, si el nuevo proveedor lo requiere, el bloque de envío en `js/main.js`.

## Cómo publicar un video nuevo

La página `videos.html` se arma automáticamente a partir de la lista que
está en `js/videos-data.js`. No hace falta tocar HTML ni CSS:

1. Sube el video a YouTube (puede ser "oculto"/"no listado" si no quieres
   que aparezca en las búsquedas de YouTube; con el enlace alcanza para que
   se vea en el sitio).
2. Copia el ID del video: en una URL como
   `https://www.youtube.com/watch?v=ABC12345678`, el ID es `ABC12345678`.
3. Abre `js/videos-data.js` y agrega un objeto al array `VIDEOS`, por ejemplo:

   ```js
   const VIDEOS = [
     {
       titulo: "Cómo reconocer el hambre emocional",
       descripcion: "Una mini charla de 10 minutos con ejercicios prácticos.",
       youtubeId: "ABC12345678",
       duracion: "10:24",
       categoria: "Comer emocional",
     },
   ];
   ```

4. Guarda el archivo. El video más nuevo debe ir primero en el array: se
   muestra como video destacado y el resto aparece debajo, en la grilla.

Mientras el array esté vacío, la página muestra un mensaje de "muy pronto"
en lugar de una grilla vacía.

## Notas

- Todo el contenido es educativo y no sustituye la atención profesional
  individualizada.
