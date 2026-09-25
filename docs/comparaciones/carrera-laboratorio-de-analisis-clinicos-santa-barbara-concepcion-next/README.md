# Validación — Laboratorio de Análisis Clínicos

## Contexto

- Carrera: Laboratorio de Análisis Clínicos.
- Carrera maestra: `laboratorio-de-analisis-clinicos`.
- Institución: Instituto Santa Bárbara.
- Ruta: `/concepcion/instituto-santa-barbara/carreras/laboratorio-de-analisis-clinicos`.
- Offering: `instituto-santa-barbara-concepcion-laboratorio-de-analisis-clinicos`.
- Datos de offering: Presencial, 3 años, título Laboratorio de Análisis Clínicos, turnos Consultar y validez Sí.
- Imagen: `imageBank.classroom`.
- Badge: Nueva carrera.

## Plantilla y comportamiento compartido

La ficha reutiliza íntegramente la plantilla contextual aprobada para Instrumentación Quirúrgica y las carreras de Siglo 21. `CareerPageClient.js` y `carrera.css` permanecen intactos, al igual que el formulario, tabs, FAQ, sidebar, footer y lógica de WhatsApp.

El formulario conserva los campos, labels, validación, reset y escritura en `localStorage.guiaEducativaLeads` ya validados en la plantilla compartida. No se repitió automatización de navegador para localStorage, porque no hubo cambios en ese componente.

La offering no define WhatsApp propio. La ficha usa el fallback institucional `3865 55 1188`, cuya normalización esperada es `543865551188`, con mensaje contextual para Laboratorio de Análisis Clínicos.

## Validación funcional

- HTTP 200: Home, Ciudades, Concepción, las tres instituciones, las cuatro carreras de Siglo 21, Instrumentación Quirúrgica y esta ruta.
- HTTP 404: Diagnóstico por Imágenes —tercera carrera aún no migrada—, esta carrera bajo Universidad Siglo 21 o IES, slug alternativo y carrera inexistente.
- Instrumentación Quirúrgica conserva su ruta contextual; la tercera tarjeta de Santa Bárbara permanece sin navegación contextual.

## Capturas Next.js con Chrome headless CLI

| Archivo | Viewport solicitado | Dimensiones PNG | Resultado |
| --- | --- | --- | --- |
| `laboratorio-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | PNG válido; contexto, imagen, badge y datos de Laboratorio de Análisis Clínicos correctos. |
| `laboratorio-next-mobile-claro.png` | 390 × 843 | 390 × 843 | PNG válido; hero en columna, título envuelto en dos líneas, tabs y datos visibles. |

No se usó CDP. No se modificaron Vite, baseline, paquetes, lockfiles, dependencias, `CareerPageClient.js` ni `carrera.css`.

## Validación técnica

- `npm run lint`: correcto.
- `npm run build`: correcto; la ruta se prerenderiza estáticamente.
- Advertencia conocida no bloqueante: Next.js detecta los lockfiles de la raíz Vite y de `next-app` al inferir el workspace root.
