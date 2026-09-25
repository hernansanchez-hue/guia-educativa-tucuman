# Análisis visual final de Home

Fecha: 4 de agosto de 2026.

## Método

- Vite y Next.js se ejecutaron simultáneamente y respondieron HTTP 200.
- Las mediciones se realizaron en el mismo navegador y en la misma pestaña para evitar diferencias de viewport o `devicePixelRatio`.
- Viewports medidos: 1440 × 900 en escritorio y 390 × 844 en móvil.
- Los raster comparados miden 1440 × 900 en escritorio y 390 × 843 en móvil.
- Cada imagen `lado-a-lado` coloca Vite a la izquierda y Next.js a la derecha, sin reescalar los originales.
- Cada `superposicion` mezcla ambos raster al 50 %.
- Cada imagen `diferencias` representa la diferencia absoluta por píxel con autocontraste para hacer visibles variaciones pequeñas.

## Artefactos generados

| Escenario | Lado a lado | Superposición | Diferencias |
| --- | --- | --- | --- |
| Escritorio claro | `analisis/desktop-claro-lado-a-lado.png` | `analisis/desktop-claro-superposicion.png` | `analisis/desktop-claro-diferencias.png` |
| Escritorio oscuro | `analisis/desktop-oscuro-lado-a-lado.png` | `analisis/desktop-oscuro-superposicion.png` | `analisis/desktop-oscuro-diferencias.png` |
| Móvil claro | `analisis/mobile-claro-lado-a-lado.png` | `analisis/mobile-claro-superposicion.png` | `analisis/mobile-claro-diferencias.png` |
| Móvil oscuro | `analisis/mobile-oscuro-lado-a-lado.png` | `analisis/mobile-oscuro-superposicion.png` | `analisis/mobile-oscuro-diferencias.png` |

## Mediciones estructurales

Todos los valores de las tablas siguientes fueron iguales en Vite y Next.js. Las cifras subpíxel se redondean a tres decimales.

### Escritorio — 1440 × 900

| Elemento | X | Y | Ancho | Alto | Observación |
| --- | ---: | ---: | ---: | ---: | --- |
| Header Home | 0 | 0 | 1440 | 82 | `position: absolute`; padding vertical 22 px |
| Logotipo completo | 536,100 | 22 | 367,788 | 38 | Centrado horizontal |
| Marca `GE` | 536,100 | 22 | 38 | 38 | Radio 8 px |
| Control de tema | — | — | — | — | No es visible en Home. En Vite existe dentro del header general oculto con caja 0 × 0; Next no lo renderiza en Home. |
| Título principal | 340 | 286,163 | 760 | 94,075 | Dos líneas |
| Panel de ciudades | 260 | 408,238 | 920 | 251,600 | Márgenes laterales de 260 px |
| Buscador | 480 | 483,038 | 480 | 46 | Centrado |
| Concepción | 284,800 | 549,838 | 290,400 | 86 | Primera columna |
| Monteros | 575,200 | 549,838 | 290,400 | 86 | Segunda columna |
| Aguilares | 865,600 | 549,838 | 290,400 | 86 | Tercera columna |
| Botón flotante | 1376 | 836 | 46 | 46 | A 18 px de derecha e inferior |

Separaciones comprobadas: 28 px entre título y panel; 20 px entre buscador y grilla; `column-gap: 0`; 204,163 px entre el borde inferior del header y el inicio del título.

### Móvil — 390 × 844

| Elemento | X | Y | Ancho | Alto | Observación |
| --- | ---: | ---: | ---: | ---: | --- |
| Header Home | 0 | 0 | 390 | 70 | Padding vertical 18 px |
| Logotipo completo | 39,450 | 18 | 311,500 | 34 | Centrado horizontal |
| Marca `GE` | 39,450 | 18 | 34 | 34 | Radio 8 px |
| Control de tema | — | — | — | — | No visible, igual que en escritorio |
| Título principal | 19,513 | 207,175 | 351,375 | 94,050 | Tres líneas |
| Panel de ciudades | 19,513 | 329,225 | 351,375 | 379,600 | Márgenes laterales aproximados de 19,5 px |
| Buscador | 39,513 | 400,025 | 311,375 | 46 | Ancho fluido |
| Concepción | 40,313 | 466,825 | 310,575 | 74 | Primera fila |
| Monteros | 40,313 | 540,825 | 310,575 | 74 | Segunda fila |
| Aguilares | 40,313 | 614,825 | 310,575 | 74 | Tercera fila |
| Botón flotante | 332,400 | 786 | 46 | 46 | A 12 px de derecha e inferior |

Separaciones comprobadas: 28 px entre título y panel; 20 px entre buscador y grilla; `row-gap: 0`; 137,175 px entre el borde inferior del header y el inicio del título. El breakpoint convierte las tres columnas en una sola sin desborde horizontal.

## Tipografía computada

Los valores también coincidieron entre Vite y Next.js.

| Elemento | Familia | Escritorio | Móvil |
| --- | --- | --- | --- |
| Logotipo | `Poppins, Arial, Helvetica, sans-serif` | 24 px; peso 900; altura de línea normal | 20 px; peso 900; altura 22,4 px |
| Marca `GE` | `Poppins, Arial, Helvetica, sans-serif` | 19 px; peso 900 | 17 px; peso 900; altura 19,04 px |
| Título principal | `Poppins, Arial, Helvetica, sans-serif` | 42 px; peso 700; altura 47,04 px | 28 px; peso 700; altura 31,36 px |
| Título del panel | `Poppins, Arial, Helvetica, sans-serif` | 24 px; peso 700; altura normal | 24 px; peso 700; altura normal |
| Buscador | `Poppins, Arial, Helvetica, sans-serif` | 13 px; peso 400; altura normal | 13 px; peso 400; altura normal |
| Nombre de ciudad | `Poppins, Arial, Helvetica, sans-serif` | 18 px; peso 700; altura normal | 18 px; peso 700; altura normal |

## Diferencias por categoría

### Dinámicas del video y la animación

- El MP4 de fondo se reproduce de forma continua, por lo que un fotograma distinto afecta una zona amplia del raster sin implicar una diferencia de DOM o CSS.
- La animación `heroContentFade` dura 800 ms. Las referencias Vite móviles históricas fueron tomadas durante la transición y muestran header, título y panel parcialmente transparentes; las capturas Next.js fueron tomadas después de estabilizar la animación.
- Estas variaciones se conservan en los artefactos de diferencia para hacer transparente el proceso, pero no se consideran fallas estructurales.

### Rasterizado de fuentes e imagen

- Las cajas CSS, familia, tamaño, peso y altura de línea son idénticos.
- Permanecen variaciones menores de antialiasing de glifos y compresión del raster. El backend del navegador entregó las nuevas capturas Vite como raster JPEG; se transcodificaron a PNG real sin reescalar, recortar ni retocar. Esto puede introducir diferencias de píxel que no corresponden al CSS.

### Estructurales

No se encontraron diferencias estructurales. Posición, dimensiones, márgenes, separaciones, columnas/filas y respuesta al breakpoint coinciden en los dos viewports.

### CSS comprobables

No se encontraron reglas divergentes que requieran corrección. La aparente diferencia de color en algunos fotogramas oscuros se comprobó contra la cascada: ambas aplicaciones usan `--blanco: #111c2e` bajo `body.dark-theme` y conservan los mismos selectores efectivos.

### Menores sin impacto visual

- Variación temporal del video.
- Momento diferente de la animación de entrada en las capturas móviles históricas.
- Antialiasing y compresión del raster.
- El control de tema existe oculto en el DOM de Vite y no existe en el DOM de Next.js; en ambos casos el resultado visible de Home es la ausencia del control.

## Métricas de diferencia de raster completo

Estas cifras incluyen video, animación y compresión; por eso no deben interpretarse como error estructural.

| Escenario | Diferencia media por canal | Percentil 95 | Píxeles con diferencia máxima por canal > 12 |
| --- | ---: | ---: | ---: |
| Escritorio claro | 5,0477 | 29 | 14,3598 % |
| Escritorio oscuro | 15,0334 | 55 | 52,5432 % |
| Móvil claro | 31,6151 | 71 | 63,6399 % |
| Móvil oscuro | 21,7590 | 64 | 63,0200 % |

## Correcciones

No se modificó `next-app/`: las mediciones no demostraron diferencias estructurales ni CSS que justificaran una corrección.

## Conclusión

La Home de Next.js reproduce la estructura, geometría, tipografía y comportamiento responsive de la demo Vite en escritorio y móvil. Las diferencias visibles restantes son dinámicas o de rasterizado. La recomendación técnica es **aprobar visualmente Home**.
