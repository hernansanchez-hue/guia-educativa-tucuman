# Análisis visual y técnico de `/concepcion`

## Método

Se ejecutaron simultáneamente la demo Vite y la aplicación Next.js, con fuentes cargadas, el primer destacado visible, tema equivalente y los viewports solicitados: 1440 × 900 y 390 × 843. Cada par se validó por inspección directa, lado a lado, superposición al 50 % y diferencia RGB absoluta. No se reescalaron los originales.

## Resultado cuantitativo

| Escenario | Píxeles con alguna diferencia | Porcentaje | Diferencia RGB media | RMS RGB | Interpretación |
|---|---:|---:|---:|---:|---|
| Escritorio claro | 6.038 | 0,465895 % | 0,048400 | 1,735192 | Rasterizado subpíxel y pequeños estados de captura; geometría coincidente. |
| Escritorio oscuro | 1.481 | 0,114275 % | 0,005424 | 0,239909 | Diferencia imperceptible de rasterizado; estructura coincidente. |
| Móvil claro | 40.921 | 12,446695 % | 0,266261 | 2,682851 | Variaciones de intensidad muy baja distribuidas por compresión/rasterizado y scrollbar; sin desplazamiento geométrico visible. |
| Móvil oscuro | 216 | 0,065699 % | 0,018368 | 1,270225 | Diferencia localizada en el scrollbar; contenido coincidente. |

El porcentaje cuenta cualquier canal distinto, incluso una variación de un nivel. Por eso el caso móvil claro muestra muchos píxeles distintos con una diferencia media de solo 0,266 sobre 255; la superposición y el lado a lado no revelan desplazamientos de estructura.

## Mediciones de estructura

### Escritorio

Las mediciones se realizaron sobre un ancho documental efectivo de 1440 px.

| Elemento | Vite | Next.js | Resultado |
|---|---:|---:|---|
| Header | 1120 × 62 px; x=160, y=12 | 1120 × 62 px; x=160, y=12 | Coincide. |
| Logotipo | 287,34 × 38 px; x=172,8, y=24 | 287,34 × 38 px; x=172,8, y=24 | Coincide. |
| Bloque de destacados | 1240 × 251,6 px; x=100, y=102 | 1240 × 251,6 px; x=100, y=102 | Coincide. |
| Diapositiva activa | 1238,4 px de ancho; x=100,8 | 1238,4 px de ancho; x=100,8 una vez asentada la transición | Coincide. |
| Barra de filtros | 1240 × 71,6 px; x=100, y=387,6 | 1240 × 71,6 px; x=100, y=387,6 | Coincide. |
| Título | 1267,2 × 48,95 px; x=86,4, y=540 | 1267,2 × 48,95 px; x=86,4, y=540 | Coincide. |
| Grilla de tarjetas | 1080 × 403,7 px; x=180, y=608,95 | 1080 × 403,7 px; x=180, y=608,95 | Coincide. |
| Footer | 1440 × 398 px; y=1068,65 | 1440 × 398 px; y=1068,65 | Coincide. |

Durante una medición tomada antes de finalizar la transición de 0,38 s, el track de Next.js registró un desplazamiento transitorio de 3,7 px. Al asentarse la diapositiva, las posiciones coincidieron. Se clasifica como estado dinámico del slider, no como diferencia estructural.

### Móvil

La captura física es 390 × 843. El backend de automatización informa un viewport CSS interno de 406 px y un ancho documental de 390 px; ambos proyectos se compararon bajo la misma calibración.

| Elemento | Medición estable | Resultado Vite/Next.js |
|---|---:|---|
| Header | 370,4 × 58 px; x=10, y=8 | Coincide visualmente y en superposición. |
| Logotipo | 244,13 × 34 px; x=20,8, y=20 | Coincide. |
| Control de tema | 40 × 40 px; x=283,6, y=17 | Coincide. |
| Bloque de destacados | 351,38 × 558,3 px; x=19,51, y=90 | Coincide. |
| Diapositiva activa | 349,77 × 556,7 px; x=20,31, y=90,8 | Coincide. |
| Barra de filtros | 351,38 × 179,2 px; x=19,51, y=666,3 | Coincide. |
| Título | 351,38 × 57,1 px; x=19,51, y=926,3 | Coincide. |
| Grilla de tarjetas | 351,38 px de ancho; una columna | Coincide. |
| Footer | 390,4 px de ancho; cuatro bloques apilados | Coincide. |

El título computa `Poppins, Arial, Helvetica, sans-serif`, 28 px, peso 700 y altura de línea 28,56 px. Los títulos de tarjeta computan Poppins, 17 px, peso 700 y altura de línea 22,1 px. Las mismas reglas, cortes y proporciones aparecen en ambos proyectos.

## Comparación por área

- **Header y navegación:** mismo contenedor, logotipo, enlaces, control de tema, CTA y menú móvil. No hay texto ni control agregado.
- **Slider:** tres destacados, mismo orden, imágenes, copia, hechos, controles y temporización. El autoplay y el fotograma temporal pueden producir diferencias entre tomas no sincronizadas.
- **Imágenes:** mismas URL canónicas y encuadre `object-fit`; las capturas finales muestran el mismo recurso y recorte.
- **Filtros:** misma distribución en escritorio, apilado en móvil, valores y botón. El filtrado por texto, modalidad y nivel reproduce el estado vacío.
- **Tarjetas:** tres tarjetas en el orden Universidad Siglo 21, Instituto Santa Bárbara e IES Concepción; tres columnas en escritorio y una en móvil.
- **Espacios y márgenes:** anchos máximos, separación vertical, padding y alineaciones coinciden en las cuatro comparaciones.
- **Footer:** contenido, columnas, enlaces externos, caja social, franja inferior y apilado responsive coinciden.
- **Botón flotante:** permanece oculto en la vista pública de ciudad, igual que en la demo en este estado.
- **Modo oscuro:** fondos, bordes, sombras, texto y controles coinciden. Se conserva incluso el bajo contraste canónico de ciertos datos del destacado; no se “mejoró”.
- **Breakpoints:** se conservaron las reglas efectivas de 1100, 980, 900, 720, 414 y 360 px aplicables a esta pantalla.

## Clasificación de diferencias

### Estructurales

No se detectaron diferencias estructurales pendientes: orden DOM visible, cantidades, columnas, alturas, anchos, márgenes y responsive son equivalentes.

### CSS

No se detectaron diferencias CSS comprobables que requieran corrección. Solo se trasladaron las reglas necesarias de la vista de ciudad; no se reorganizó el CSS de la demo.

### Datos

No hay diferencias visibles de datos. `Instituto del Sur` se conserva como tercer destacado mediante identificador estable aunque no pertenezca a Concepción: **“inconsistencia canónica conservada temporalmente para mantener fidelidad visual”**.

### Dinámicas del slider y de fotograma

El índice puede cambiar por autoplay cada 5.200 ms y la transición dura 0,38 s. Las capturas finales se sincronizaron en la primera diapositiva y se pausaron durante la toma. Una medición intermedia dentro de la transición no representa una diferencia persistente.

### Rasterizado de fuentes e imágenes

Quedan diferencias subpíxel de baja intensidad atribuibles al rasterizado, la conversión del backend de captura y el scrollbar. No alteran posición, tamaño, tipografía computada ni legibilidad.

### Diferencias aceptadas

- Diferencias subpíxel de rasterizado descritas arriba.
- Estado temporal del slider entre fotogramas no sincronizados.
- Inconsistencia canónica de Instituto del Sur, exigida para fidelidad visual.

## Pruebas funcionales de `/concepcion`

- HTTP 200 y render completo desde la ruta dinámica `app/[ciudad]`.
- Slider: avance automático, anterior, siguiente, pausa al hover y swipe móvil.
- Filtros: `siglo` devuelve una tarjeta; una búsqueda inexistente devuelve cero y muestra el estado vacío; limpiar restaura tres. Nivel Universidad devuelve una y Terciario devuelve dos.
- Las tarjetas y CTA institucionales conservan foco y apariencia, pero no navegan a rutas inexistentes.
- Tema claro/oscuro mediante `localStorage.guiaEducativaTheme` y control visible.
- Consola del navegador sin errores.

## Regresión de Home y `/ciudades`

Se comparó la geometría del selector directamente en ambas rutas, sin regenerar capturas históricas. En móvil se obtuvo exactamente la misma caja en Home y `/ciudades`: header 405,6 × 70 px, título 352 × 94,05 px, panel 352 × 379,6 px, buscador 312 × 46 px, lista 312 × 222,8 px, primer botón 311,2 × 74 px y botón flotante 46 × 46 px. En escritorio se conservaron header 1440 × 82 px, título 760 × 94,08 px, panel 920 × 251,6 px, buscador 480 × 46 px y botones de aproximadamente 290,4 × 86 px.

Se probaron claro y oscuro, escritorio y móvil, búsqueda parcial, búsqueda sin resultados, estado vacío, limpieza y Enter. Home y `/ciudades` mantienen el mismo DOM visual, clases y CSS. `Concepción` navega a `/concepcion`; `Monteros` y `Aguilares` permanecen inactivos. La única modificación es la acción de navegación condicionada en `CitySelector.js`.

## Conclusión

La ruta `/concepcion` es funcional y visualmente comparable con la demo Vite. No quedan diferencias estructurales o CSS que bloqueen el commit de esta etapa.
