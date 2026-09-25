# Contacto — migración Vite a Next.js v1

## Fuente canónica

- HTML: `index.html`, `#contactPage`.
- Apertura SPA: `showInfoPage('contact')` en `src/main.js`.
- Estilos: `src/styles.css` (`.section-title`, `.detail-content`, `.panel`, `.form-grid` y `.contact-info`).

## Contenido e interacción

La ruta `/contacto` preserva los textos, la estructura de dos paneles, los seis campos del formulario y las tres opciones de plan. El formulario Vite no llama a un backend: previene el envío y muestra el aviso `Mensaje listo para seguimiento comercial.`. Next reproduce exactamente ese comportamiento, sin API, email, leads ni Supabase.

## Validación

- HTTP `/contacto`: 200.
- Comparación temporal Edge: geometría equivalente a Vite en escritorio 1440 × 900 y móvil 390 × 843; sin overflow horizontal.
- Modo claro/oscuro cubierto por el mecanismo global existente y las reglas canónicas de panel.
- `npm run lint` y `npm run build` ejecutados al cierre editorial.
- Vite y Supabase remoto permanecen intactos.
