# Regresión visual de Home después de extraer CitySelector

Fecha: 4 de agosto de 2026.

## Alcance

Home fue refactorizada únicamente para reemplazar el fragmento embebido del selector por el componente compartido `CitySelector`. El componente devuelve como raíz el mismo `div.city-box`; por lo tanto, no agrega wrappers ni altera la relación entre `.city-box`, `.city-search`, `.cities` y los botones `.city-card`.

No se modificaron `home.css`, `globals.css`, textos, SVG, clases, atributos visibles, video, overlay, breakpoints ni archivos de la demo Vite.

## Capturas de regresión

| Escenario | Captura nueva | Referencia Home aprobada | Dimensiones | Estado |
| --- | --- | --- | --- | --- |
| Escritorio claro | `home-regresion-desktop-claro.png` | `../home-next/revision/next-home-desktop-claro.png` | 1440 × 900 | Sin diferencias estructurales ni CSS |
| Escritorio oscuro | `home-regresion-desktop-oscuro.png` | `../home-next/revision/next-home-desktop-oscuro.png` | 1440 × 900 | Sin diferencias estructurales ni CSS |
| Móvil claro | `home-regresion-mobile-claro.png` | `../home-next/revision/next-home-mobile-claro.png` | 390 × 843 | Sin diferencias estructurales ni CSS |
| Móvil oscuro | `home-regresion-mobile-oscuro.png` | `../home-next/revision/next-home-mobile-oscuro.png` | 390 × 843 | Sin diferencias estructurales ni CSS |

Las capturas se hicieron sobre un build local de producción para excluir el indicador de `next dev`. El backend entregó raster JPEG y, como en la validación anterior de Home, se transcodificó a PNG real sin reescalar, recortar ni retocar. Los ocho archivos de esta etapa poseen la firma PNG `89 50 4E 47 0D 0A 1A 0A` y se decodifican completamente.

En móvil se utilizó un viewport técnico de 390 × 844 porque el backend descuenta una fila al producir la captura. El PNG resultante mide 390 × 843, igual que las referencias aprobadas.

## Mediciones comparadas

Los valores siguientes coinciden con `docs/comparaciones/home-next/revision/analisis.md`.

### Escritorio — viewport y raster 1440 × 900

| Elemento | X | Y | Ancho | Alto |
| --- | ---: | ---: | ---: | ---: |
| Header | 0 | 0 | 1440 | 82 |
| Logotipo | 536,100 | 22 | 367,788 | 38 |
| Título | 340 | 286,163 | 760 | 94,075 |
| Panel | 260 | 408,238 | 920 | 251,600 |
| Buscador | 480 | 483,038 | 480 | 46 |
| Grilla | 284 | 549,038 | 872 | 86,800 |
| Concepción | 284,800 | 549,838 | 290,400 | 86 |
| Monteros | 575,200 | 549,838 | 290,400 | 86 |
| Aguilares | 865,600 | 549,838 | 290,400 | 86 |
| Botón flotante | 1376 | 836 | 46 | 46 |

### Móvil — viewport 390 × 844 y raster 390 × 843

| Elemento | X | Y | Ancho | Alto |
| --- | ---: | ---: | ---: | ---: |
| Header | 0 | 0 | 390,400 | 70 |
| Logotipo | 39,450 | 18 | 311,500 | 34 |
| Título | 19,513 | 207,175 | 351,375 | 94,050 |
| Panel | 19,513 | 329,225 | 351,375 | 379,600 |
| Buscador | 39,513 | 400,025 | 311,375 | 46 |
| Grilla | 39,513 | 466,025 | 311,375 | 222,800 |
| Concepción | 40,313 | 466,825 | 310,575 | 74 |
| Monteros | 40,313 | 540,825 | 310,575 | 74 |
| Aguilares | 40,313 | 614,825 | 310,575 | 74 |
| Botón flotante | 332,400 | 786 | 46 | 46 |

Se conservaron 28 px entre título y panel, 20 px entre buscador y grilla, `gap: 0`, tres columnas en escritorio y una columna en el breakpoint móvil.

## Tipografía, temas y comportamiento

- Poppins continúa como familia computada.
- El título usa 42 px/700/47,04 px en escritorio y 28 px/700/31,36 px en móvil.
- Los nombres de ciudad usan 18 px y peso 700.
- Claro conserva panel y buscador blancos.
- Oscuro conserva panel `rgb(17, 28, 46)` y buscador `rgb(12, 23, 40)`.
- El modo normal continúa leyendo y persistiendo `localStorage.guiaEducativaTheme` en `HomeClient`.
- El mecanismo local utilizado exclusivamente para producir las capturas oscuras fue retirado completamente antes de las validaciones finales y no forma parte del commit.

## Resultado funcional

- Búsqueda parcial: `cep` muestra únicamente Concepción.
- Normalización: `concepcion` y `CONCEPCIÓN` muestran Concepción.
- Sin resultados: se ocultan las tarjetas y aparece `No encontramos esa ciudad.`.
- Limpiar: restaura Concepción, Monteros y Aguilares en el orden canónico.
- Enter y el botón de búsqueda conservan la primera coincidencia sin navegar mientras las rutas dinámicas no existan.

## Diferencias aceptadas

Las diferencias de píxel respecto de las capturas históricas corresponden al fotograma dinámico del video, al antialiasing y a la compresión previa del raster entregado por el navegador. No se detectaron diferencias en DOM visible, cajas CSS, tipografías, textos, iconos, colores, responsive o modo oscuro.

## Conclusión

La extracción de `CitySelector` no produjo regresión visual ni funcional en Home. La geometría aprobada se conserva en escritorio y móvil, tanto en tema claro como oscuro.
