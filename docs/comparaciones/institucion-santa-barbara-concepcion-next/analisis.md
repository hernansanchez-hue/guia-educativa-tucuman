# Análisis visual — Instituto Santa Bárbara Concepción

## Resultado general

La ficha de Next.js reproduce la estructura, contenido y geometría canónicos de Vite en escritorio y móvil, tanto en tema claro como oscuro. La plantilla institucional dinámica existente se reutilizó sin duplicarla. Durante la comparación se detectó una sola diferencia CSS comprobable: el footer móvil de Santa Bárbara no heredaba el apilado vertical que la SPA aplica a esa ficha. La corrección quedó aislada con `.institution-santa-barbara` y no alteró Universidad Siglo 21.

## Mediciones estructurales

Las mediciones computadas finales de Vite y Next.js coinciden. La posición horizontal instantánea de las tarjetas del marquee queda fuera de esta equivalencia porque depende de la fase de animación.

| Elemento | Escritorio 1440 px | Móvil 390 px | Resultado |
|---|---:|---:|---|
| Header | 1120 × 62 px; `x=160`, `y=12` | 370.4 × 58 px | Coincidente |
| Botón de regreso | 216.7 × 45.6 px; `x=86.4`, `y=102` | 216.7 × 45.6 px | Coincidente |
| Portada | 1267.2 × 310 px; `x=86.4`, `y=165.6` | 351.38 × 310 px | Coincidente |
| Título institucional | 780 × 63 px; 60/63 px, peso 700 | 303.38 × 75.6 px; 36/37.8 px, peso 700 | Coincidente |
| Panel de galería | 1267.2 × 429.2 px | 351.38 × 359.2 px | Coincidente |
| Galería visible | 1152 × 336 px | 305.77 × 266 px | Coincidente |
| Tarjeta del marquee | 224 × 320 px | 176 × 250 px | Coincidente |
| Tarjetas de carreras | tres columnas de 360 × 433.15 px | una columna de 305.77 px; alturas 444.64, 466.74 y 444.64 px | Coincidente |
| Footer | 398 px de alto | 900.7 px de alto, contenido apilado | Coincidente tras corrección aislada |
| Logo `ISB` | `display: none`, 0 × 0 | `display: none`, 0 × 0 | Coincidente |

La tipografía computada es `Poppins, Arial, Helvetica, sans-serif` en ambos proyectos. Coinciden familia, tamaños, pesos y alturas de línea del título, slogan, rótulos y contenido de las tarjetas.

## Portada, textos y logo oculto

- Tipo, ciudad contextual, nombre `Instituto Santa Bárbara`, slogan y descripción coinciden con la demo.
- La portada usa el mismo recurso y conserva altura, recorte, overlay, bordes y radios.
- El logo textual `ISB` sigue presente donde corresponde en el DOM canónico.
- Su estilo computado continúa siendo `display: none`; no ocupa espacio y no fue reemplazado.
- La dirección de Aguilares permanece en los datos por fidelidad canónica, pero la plantilla no la muestra.

## Galería marquee

- Cuatro imágenes originales repetidas una vez para formar ocho nodos `.creation-card`.
- Orden canónico: portada de Santa Bárbara, estudiantes, aula y graduación; luego el mismo orden repetido.
- Tarjetas de 224 × 320 px en escritorio y 176 × 250 px en móvil.
- Animación `creationMarquee`, lineal, infinita y con duración computada de 10 s.
- Durante la prueba, la transformación cambió aproximadamente de `translateX(-26.88 px)` a `translateX(-47.36 px)` en 250 ms, confirmando movimiento real.
- Se conservaron pausa por hover y respeto por `prefers-reduced-motion`.

La fase no se sincronizó entre aplicaciones. Por lo tanto, las imágenes aparecen en posiciones horizontales diferentes en los PNG sin que esto indique una diferencia de orden, velocidad o geometría.

## Tarjetas de carreras

Se conservaron tres tarjetas y su orden:

1. `Instrumentación Quirúrgica` — `Inscripciones abiertas` — imagen de laboratorio.
2. `Laboratorio de Análisis Clínicos` — `Nueva carrera` — imagen de aula.
3. `Diagnóstico por Imágenes` — `Próximo ingreso` — imagen de estudiantes.

Todas muestran `3 años`, `Presencial`, `Concepción`, `Privada`, su descripción canónica y los botones `Ver carrera` y `Consultar`. Las seis acciones mantienen hover/focus y apariencia, pero no cambian la URL ni muestran diálogos o alertas.

## Métrica de diferencia visual

La zona estática superior se midió hasta antes de la porción animada dominante: `y=0–573` en escritorio y `y=0–561` en móvil. El umbral registra píxeles cuya diferencia RGB media supera 10 niveles.

| Escenario | Diferencia absoluta media total | Píxeles >10 total | Diferencia media zona estática | Píxeles >10 zona estática |
|---|---:|---:|---:|---:|
| Escritorio claro | 9.3028 | 14.8392 % | 0.0016 | 0.0029 % |
| Escritorio oscuro | 10.3042 | 16.1201 % | 0.2576 | 0.3431 % |
| Móvil claro | 6.2590 | 10.6549 % | 0.1657 | 0.3655 % |
| Móvil oscuro | 8.8606 | 12.5373 % | 0.8517 | 0.7975 % |

La diferencia casi nula de la zona estática confirma que header, regreso, portada, textos, márgenes, colores y tipografía son equivalentes. El valor total está dominado por el fotograma del marquee.

## Diferencias clasificadas

### Estructurales

No quedan diferencias estructurales. La jerarquía visible, cantidades, portada, panel, ocho nodos del marquee, tres carreras, footer y logo oculto coinciden.

### CSS comprobables

Se corrigió el apilado móvil de `.footer-social-box`, `.footer-bottom` y la alineación de `.footer-social-links` bajo la clase contextual `.institution-santa-barbara`. Antes de la corrección el footer Next.js medía 825.2 px frente a 900.7 px en Vite; después ambos miden 900.7 px. La ficha de Siglo 21 conserva la clase raíz `app-shell` y sus estilos previos.

No quedan diferencias CSS comprobables pendientes.

### Contenido

No se encontraron diferencias de contenido. Nombre, tipo, ciudad, slogan, descripción, imágenes, badges, duración, modalidad, textos auxiliares y orden coinciden.

### Dinámicas del marquee

Las imágenes ocupan posiciones distintas por el instante de captura. Se acepta porque nombre de animación, duración de 10 s, función lineal, bucle infinito, cantidad, orden, dimensiones y desplazamiento real coinciden.

### Rasterizado y compresión

Persisten variaciones menores por rasterizado subpíxel de Poppins, carga de recursos y codificación de la captura del navegador. Los PNG finales son binarios válidos y no fueron reescalados ni retocados.

### Diferencias aceptadas

- Fotograma dinámico no sincronizado del marquee.
- Variaciones menores de rasterizado y compresión de captura.

## Modo oscuro, responsive y breakpoints

- Claro y oscuro mantienen las mismas variables visuales, fondos, contraste, bordes y sombras de la demo.
- A 1440 px, las carreras forman tres columnas equivalentes.
- A 390 px, portada, galería, carreras, acciones y footer se apilan como en Vite.
- El título computa 36 px / 37.8 px en el viewport móvil probado.
- Hover, focus y transiciones se conservan mediante las reglas canónicas de la plantilla.
- La corrección contextual del footer solo actúa en `max-width: 720px` y solo en Santa Bárbara.

## Regresión funcional y visual

- Home conserva `Concepción`, `Monteros` y `Aguilares`, en ese orden.
- `/ciudades` conserva las tres ciudades canónicas.
- `/concepcion` conserva las tarjetas Siglo 21, Santa Bárbara e IES, su orden, dimensiones, slider, filtros, temas y disposición responsive.
- El filtro `Instrumentación Quirúrgica` devuelve únicamente Santa Bárbara.
- La tarjeta Santa Bárbara navega a la nueva ficha; la de Siglo 21 sigue navegando a su ficha validada.
- IES Concepción y el destacado Instituto del Sur permanecen inactivos.
- Siglo 21 conserva portada, datos, ocho nodos de marquee, cuatro carreras, logo oculto y clase raíz previa.
- El botón de regreso de Santa Bárbara vuelve a `/concepcion`.
- No se observaron errores en la consola del navegador.

## Conclusión

La ficha es funcional y visualmente comparable. La única diferencia CSS detectada fue corregida de forma contextual y verificada sin regresión sobre Siglo 21. No queda una diferencia estructural importante que bloquee el commit; las únicas diferencias aceptadas son dinámicas o de rasterizado/captura.
