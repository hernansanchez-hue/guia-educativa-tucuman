# Validación reducida — Instrumentación Quirúrgica

- Carrera: Instrumentación Quirúrgica
- ID y slug: `instrumentacion-quirurgica`
- Institución: Instituto Santa Bárbara
- Ruta: `/concepcion/instituto-santa-barbara/carreras/instrumentacion-quirurgica`
- Offering: `instituto-santa-barbara-concepcion-instrumentacion-quirurgica`

## Datos contextuales

- Modalidad: Presencial.
- Duración: 3 años.
- Imagen: `imageBank.lab`.
- Badge: Inscripciones abiertas.
- La offering no define WhatsApp propio. Se utiliza el fallback institucional `3865 55 1188`, con normalización esperada `543865551188`.

## Plantilla y formulario

La pantalla reutiliza la plantilla contextual ya validada. `CareerPageClient.js` y `carrera.css` permanecen intactos.

El formulario reutiliza íntegramente el componente, los campos, la validación y la lógica de `localStorage` previamente validados. En esta ejecución no se repitió una interacción automatizada: CDP fue descartado por la inestabilidad del WebSocket DevTools. Esta condición es externa a GET y no constituye un error de la aplicación.

## Capturas CLI

Las imágenes se generaron con Chrome headless CLI, sin CDP, contra un servidor Next.js de producción temporal:

| Archivo | Viewport solicitado | Dimensiones PNG | Resultado |
| --- | --- | --- | --- |
| `instrumentacion-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | PNG válido; se ve Instituto Santa Bárbara e Instrumentación Quirúrgica, sin contexto de Universidad Siglo 21. |
| `instrumentacion-next-mobile-claro.png` | 390 × 843 | 390 × 843 | PNG válido; la portada y el contenido pasan a disposición móvil. El título largo queda recortado horizontalmente en esta captura, por lo que requiere decisión visual antes de declarar la validación móvil aprobada. |

No se generaron capturas oscuras, Vite nuevas, superposiciones, diferencias ni imágenes lado a lado en esta etapa.

## Paso 132 — equivalencia estructural Vite → Next

No fue posible capturar directamente la ficha Vite con Chrome CLI porque la SPA no dispone de una URL profunda para esa vista. La verificación se resolvió mediante comparación fuente, sin modificar Vite ni la plantilla Next.js.

- Vite: el hero está en `index.html` líneas 193–206; el nombre usa `<h1 id="careerPageName">` dentro de `.career-page-copy`. `showCareer()` asigna literalmente `career.name` en `src/main.js` líneas 694–715. Sus reglas relevantes están en `src/styles.css` líneas 2175–2275, 2589–2623, 6547–6550 y 6796–6805.
- Next.js: el markup equivalente está en `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/CareerPageClient.js` líneas 88–121. Las reglas se encuentran en `carrera.css` líneas 1–102 y 381–455; las reglas heredadas de `.page` provienen de `ciudad.css` líneas 223–230 y 1209–1211, importadas por `page.js`.
- DOM, nesting, IDs, clases, columnas de grid, contenedor de 1180 px, `min-width`, gaps, márgenes y padding son equivalentes. A 390 px ambos pasan el hero y layout a una columna a 900 px, aplican padding de página `24px 5% 40px` a 720 px y, a 414 px, usan padding de copy `25px 20px` y `font-size: 29px` para el título.
- Ambos usan Poppins, `line-height: 1.08`, sin reglas adicionales de `white-space`, `overflow-wrap`, `word-break` o `text-overflow` para el `h1`. Ambos heredan `box-sizing: border-box`, margen cero y el mismo fondo/anchura de `body`.
- El texto de la demo y la carrera maestra Next.js es exactamente `Instrumentación Quirúrgica`.

Conclusión: el comportamiento móvil observado está heredado de la definición canónica Vite, no de una diferencia estructural o CSS de Next.js. **PASO 132 APROBADO POR EQUIVALENCIA ESTRUCTURAL.**

## Validación funcional previa aprobada

- La ruta canónica respondió HTTP 200.
- Las rutas contextuales incorrectas respondieron 404.
- Las cuatro carreras de Universidad Siglo 21 continuaron respondiendo 200.
- Las otras dos carreras de Instituto Santa Bárbara continuaron sin ruta contextual habilitada.
