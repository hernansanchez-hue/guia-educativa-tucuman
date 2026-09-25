# Validación — Diagnóstico por Imágenes

- Carrera maestra: `diagnostico-por-imagenes` — Diagnóstico por Imágenes.
- Institución: Instituto Santa Bárbara; ruta: `/concepcion/instituto-santa-barbara/carreras/diagnostico-por-imagenes`.
- Offering: `instituto-santa-barbara-concepcion-diagnostico-por-imagenes`.
- Datos: Presencial, 3 años, título Diagnóstico por Imágenes, imagen `imageBank.students`, badge Próximo ingreso, turnos Consultar y validez Sí.
- Sin WhatsApp propio; reutiliza fallback institucional `3865 55 1188` (normalizado `543865551188`).

La ficha reutiliza sin cambios `CareerPageClient.js`, `carrera.css`, formulario, `localStorage.guiaEducativaLeads`, tabs, FAQ, sidebar, footer y lógica WhatsApp ya validados.

Validación HTTP: las rutas base, tres instituciones, cuatro carreras Siglo 21 y las tres carreras Santa Bárbara respondieron 200; combinaciones de Diagnóstico bajo Siglo 21/IES, slug alternativo y carrera inexistente respondieron 404.

| Archivo | Viewport | Resultado |
| --- | --- | --- |
| `diagnostico-next-desktop-claro.png` | 1440 × 900 | PNG CLI válido. |
| `diagnostico-next-mobile-claro.png` | 390 × 843 | PNG CLI válido; comportamiento responsive reutilizado. |

`npm run lint` y `npm run build` finalizaron correctamente. Persiste la advertencia no bloqueante conocida de lockfiles múltiples. Vite, baseline, paquetes, lockfiles y dependencias permanecen intactos.
