# Nutre — Psicología y bienestar

Sitio web estático (HTML, CSS y JavaScript sin dependencias) para un proyecto
de psicología y bienestar enfocado en mejorar la relación de las personas
con la comida.

## Contenido del sitio

- **Inicio** (`index.html`): presentación del proyecto y sus tres pilares.
- **Artículos** (`articulos.html` y `articulos/*.html`): textos educativos
  sobre relación con la comida, alimentación consciente, comer emocional y
  ansiedad, e imagen corporal.
- **Recursos** (`recursos.html`): datos, señales de alerta y mitos frente a
  realidades sobre la relación con la comida.
- **Habla con alguien** (`hablar.html`): formulario para agendar una primera
  conversación con un profesional.
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
├── hablar.html
├── sobre-nosotros.html
├── css/styles.css
└── js/main.js
```

## Cómo verlo localmente

No requiere instalación ni build. Basta con levantar un servidor estático
en la raíz del proyecto, por ejemplo:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000` en el navegador.

## Notas

- El formulario de contacto (`hablar.html`) valida los campos en el
  navegador y muestra un mensaje de confirmación, pero **no envía el
  correo automáticamente**: para recibir los mensajes hay que conectarlo a
  un backend o a un servicio de formularios (por ejemplo, un endpoint
  propio, Formspree, o similar).
- Todo el contenido es educativo y no sustituye la atención profesional
  individualizada.
