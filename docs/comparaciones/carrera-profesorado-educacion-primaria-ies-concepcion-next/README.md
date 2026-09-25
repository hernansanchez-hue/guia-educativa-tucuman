# Validación — Profesorado de Educación Primaria

- Carrera maestra: `profesorado-educacion-primaria`.
- Institución: IES Concepción.
- Ruta: `/concepcion/ies-concepcion/carreras/profesorado-educacion-primaria`.
- Offering: `ies-concepcion-concepcion-profesorado-educacion-primaria`.
- Datos: Presencial, 3 años, título Profesorado de Educación Primaria, imagen `imageBank.classroom`, badge Inscripciones abiertas, turnos Consultar y validez Sí.
- Sin WhatsApp propio; usa fallback institucional IES `3865 50 3300`.

La ficha reutiliza íntegramente la plantilla contextual validada. `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y lógica de WhatsApp permanecen sin cambios. El formulario conserva campos, labels, validación, reset y `localStorage.guiaEducativaLeads`; no se repitió automatización por no haber cambios compartidos.

La matriz HTTP confirmó 200 para Home, Ciudades, Concepción, tres instituciones, cuatro carreras Siglo 21, tres carreras Santa Bárbara y esta primera carrera IES. Tecnicatura en Administración y Profesorado de Inglés de IES, rutas bajo institución incorrecta, slug alternativo y carrera inexistente responden 404.

| Archivo | Viewport | Resultado |
| --- | --- | --- |
| `profesorado-primaria-next-desktop-claro.png` | 1440 × 900 | PNG CLI válido. |
| `profesorado-primaria-next-mobile-claro.png` | 390 × 843 | PNG CLI válido; responsive heredado de la plantilla validada. |

Lint y build finalizaron correctamente. Vite, baseline, paquetes, lockfiles y dependencias continúan intactos; permanece solo la advertencia conocida de lockfiles múltiples.
