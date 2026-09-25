# Centro de Formación Tucumán — Monteros

- ID interno: `centro-de-formacion-tucuman-monteros`.
- Slug público canónico: `centro-de-formacion-tucuman`; ruta: `/monteros/centro-de-formacion-tucuman`.
- Tipo: `Capacitación`.
- Las tarjetas visibles conservan la semántica canónica de ofertas/capacitaciones de esta institución: Auxiliar Administrativo, Secretariado y Operador de PC. Aún no tienen rutas contextuales.
- El dato `3863 40 2100` corresponde a `whatsapp` de Centro de Formación Tucumán, no a Instituto del Sur; será fallback institucional de futuras ofertas. No hay web, teléfono separado ni horarios auditados.
- Se reutiliza la plantilla institucional sin cambios a componentes ni CSS: header, portada, marquee, tarjetas, footer, tema y responsive. La galería replica el fallback de Vite.

| Archivo | Viewport CSS | Tema | Estado |
| --- | --- | --- | --- |
| `centro-formacion-tucuman-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido, 969326 bytes |
| `centro-formacion-tucuman-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido, 305612 bytes |

`npm run lint` y `npm run build` finalizaron correctamente. HTTP 200 validado para la ficha; las rutas contextuales del Centro y la ficha de Instituto San Miguel continúan en 404. No se modificaron Vite, `careers.js`, `offerings.js`, `CareerPageClient.js`, `carrera.css`, dependencias ni lockfiles.
