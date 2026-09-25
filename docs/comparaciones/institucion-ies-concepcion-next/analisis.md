# Análisis visual — IES Concepción

## Viewport móvil validado

En las cuatro capturas móviles, antes de capturar se obtuvo `window.innerWidth = 390`, `window.innerHeight = 843`, `devicePixelRatio = 1` y `document.documentElement.clientWidth = 375`. El ancho menor del documento corresponde al scrollbar vertical de Chromium; `scrollWidth = 375`, por lo que no hay scroll horizontal accidental.

## Resultado responsive

- Header público y control de tema: coincidentes.
- Regreso, portada, tipo, nombre y slogan: coincidentes y apilados en una sola columna.
- Logo textual `IES`: presente en el DOM y oculto; no ocupa espacio.
- Marquee: ocho nodos, cuatro imágenes repetidas en el orden canónico; las tarjetas reducen a 176 × 250 px en móvil.
- Carreras: tres tarjetas, badges, duración `3 años` y modalidad `Presencial` conservadas en una columna.
- Footer, espaciados, bordes, colores, modo claro y oscuro: coincidentes.

## Diferencias aceptadas

No se encontró una diferencia estructural o CSS comprobable que requiera modificar Next.js. La diferencia visual global está dominada por el fotograma variable del marquee; también existen variaciones menores de rasterizado de Poppins y codificación PNG.

## Regresiones

La incorporación queda aislada al dato, la ruta estática y la acción de la tarjeta IES. Home, `/ciudades`, `/concepcion`, Universidad Siglo 21 e Instituto Santa Bárbara no recibieron cambios de código ni CSS.
