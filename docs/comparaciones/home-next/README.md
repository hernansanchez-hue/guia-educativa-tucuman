# Comparación visual de Home: Vite y Next.js

Fecha: 3 de agosto de 2026.

## Paquete de revisión y validación binaria

Las capturas originales de Next.js provenían de una salida codificada en Base64. Al iniciar esta etapa, el repositorio ya contenía los cuatro archivos `.png` con el contenido binario decodificado y versionado; no había archivos `.png.b64` presentes para convertir o eliminar. Se verificó que no se tratara de un simple cambio de extensión: los cuatro archivos comienzan con la firma PNG `89 50 4E 47 0D 0A 1A 0A`, no están vacíos y se decodifican íntegramente como imágenes PNG sin errores.

Para la revisión manual se creó `docs/comparaciones/home-next/revision/`. Las dos referencias Vite de escritorio se recapturaron a 1440 × 900; las referencias históricas de `docs/baseline-visual/` permanecen intactas. Las capturas móviles y las cuatro capturas Next.js se conservaron. Ninguna imagen original fue reescalada, recortada o retocada para realizar las comparaciones.

| Escenario | Archivo Vite en `revision/` | Archivo Next.js en `revision/` | Viewport solicitado | Dimensiones reales Vite / Next | Tema | Peso Vite / Next | Estado | Observaciones |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Home escritorio claro | `vite-home-desktop-claro.png` | `next-home-desktop-claro.png` | 1440 × 900 | 1440 × 900 / 1440 × 900 | Claro | 1090806 / 987933 bytes | Válidos y equivalentes | Vite fue recapturado al viewport requerido. |
| Home escritorio oscuro | `vite-home-desktop-oscuro.png` | `next-home-desktop-oscuro.png` | 1440 × 900 | 1440 × 900 / 1440 × 900 | Oscuro | 1021063 / 987118 bytes | Válidos y equivalentes | Vite fue recapturado al viewport requerido. |
| Home móvil claro | `vite-home-mobile-claro.png` | `next-home-mobile-claro.png` | 390 × 844 | 390 × 843 / 390 × 843 | Claro | 316108 / 269053 bytes | Válidos | El backend de captura produjo un raster de un píxel menos de alto en ambas aplicaciones. |
| Home móvil oscuro | `vite-home-mobile-oscuro.png` | `next-home-mobile-oscuro.png` | 390 × 844 | 390 × 843 / 390 × 843 | Oscuro | 321300 / 267116 bytes | Válidos | El backend de captura produjo un raster de un píxel menos de alto en ambas aplicaciones. |

### Validación de los PNG de Next.js

| Archivo original | Firma PNG | Dimensiones | Tamaño | Decodificación | SHA-256 |
| --- | --- | --- | ---: | --- | --- |
| `home-next-desktop-claro.png` | Válida | 1440 × 900 | 987933 bytes | Correcta, sin corrupción | `C7C3A9BEB7F95D7CD6953F907A1A2AC280E05E3ED4123B2FFB5854270236448F` |
| `home-next-desktop-oscuro.png` | Válida | 1440 × 900 | 987118 bytes | Correcta, sin corrupción | `B4DF2D035A3CEFAF03C90E01C2E85052F364D489FD442F195A89F42E1E6BF628` |
| `home-next-mobile-claro.png` | Válida | 390 × 843 | 269053 bytes | Correcta, sin corrupción | `9A3F15F42CDCBAEA63AD088856C7773711D4F307EB40DCC0D84195A3D888CD94` |
| `home-next-mobile-oscuro.png` | Válida | 390 × 843 | 267116 bytes | Correcta, sin corrupción | `C13D7A503312831DA3C0A15110B0D84FA2684459BF779DEA3B63BD09553F6E26` |

### Validación de los PNG Vite de escritorio recapturados

| Archivo de revisión | Firma PNG | Dimensiones | Tamaño | Decodificación | SHA-256 |
| --- | --- | --- | ---: | --- | --- |
| `revision/vite-home-desktop-claro.png` | Válida | 1440 × 900 | 1090806 bytes | Correcta, sin corrupción | `27458002B958CE9B9B6516466AF28129F5F85C8A4020F7A5D09CE69C1FD9DBEB` |
| `revision/vite-home-desktop-oscuro.png` | Válida | 1440 × 900 | 1021063 bytes | Correcta, sin corrupción | `B449B49913005DC883AEDAB481CAA6502F164D68653DEEEC96F886E50C8905F5` |

## Capturas de Next.js

| Archivo | Viewport solicitado | Raster PNG | Tema |
| --- | --- | --- | --- |
| `home-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro |
| `home-next-desktop-oscuro.png` | 1440 × 900 | 1440 × 900 | Oscuro |
| `home-next-mobile-claro.png` | 390 × 844 | 390 × 843 | Claro |
| `home-next-mobile-oscuro.png` | 390 × 844 | 390 × 843 | Oscuro |

Las capturas se tomaron sobre un build local de producción de Next.js para excluir el indicador visual de `next dev`. `npm run dev` se validó por separado. El navegador confirmó `window.innerWidth`/`window.innerHeight` de 1440 × 900 y 390 × 844. En móvil, el backend de capturas genera un raster de 390 × 843; el mismo recorte aparece en la línea base Vite.

## Referencias Vite

- `docs/baseline-visual/home-desktop-claro.png`: 1280 × 720.
- `docs/baseline-visual/home-desktop-oscuro.png`: 1280 × 720.
- `docs/baseline-visual/home-mobile-claro.png`: 390 × 843.
- `docs/baseline-visual/home-mobile-oscuro.png`: 390 × 843.

El README de la línea base registra que se solicitó 1440 × 900, pero el navegador disponible en esa etapa devolvió 1280 × 720 para escritorio. Esas referencias históricas no se reemplazaron. Las copias dentro de `revision/` sí fueron recapturadas a 1440 × 900 y ahora permiten una comparación directa con Next.js.

## Resultado visual

### Estructura y dimensiones

En la comparación en vivo de escritorio, Vite y Next.js produjeron exactamente las mismas cajas CSS:

| Elemento | X | Y | Ancho | Alto |
| --- | ---: | ---: | ---: | ---: |
| Header Home | 0 | 0 | 1440 | 82 |
| Título principal | 340 | 286,1625 | 760 | 94,075 |
| Panel de ciudades | 260 | 408,2375 | 920 | 251,6 |
| Buscador | 480 | 483,0375 | 480 | 46 |
| Grilla de ciudades | 284 | 549,0375 | 872 | 86,8 |

El orden de DOM visible coincide: header propio de Home, video, overlay, título, panel, buscador, tres botones de ciudad y botón flotante. No se renderizan el header general ni el footer porque la pantalla Vite también los oculta en Home.

### Tipografía

La familia calculada para el título fue `Poppins, Arial, Helvetica, sans-serif` en ambas aplicaciones. Se conservan pesos, tamaños, interlineado y colores. Geist sigue importada porque forma parte de las dependencias tipográficas registradas por la demo, aunque Home no la aplica.

### Imágenes, video y overlay

Next.js usa el mismo MP4 remoto de Cloudinary, con `autoplay`, `muted`, `loop`, `playsinline`, `preload="auto"`, `object-fit: cover` y el mismo overlay. El navegador confirmó `readyState = 4` antes de cada captura.

Los fotogramas no son deterministas: el video continúa reproduciéndose y la línea base no fija un tiempo de video. Por eso no corresponde interpretar un cambio de fotograma como diferencia visual de implementación.

### Responsive

En 390 × 844 se conserva:

- header de 70 px;
- título de 351,375 × 94,05 px;
- panel de 351,375 × 379,6 px;
- buscador de 311,375 × 46 px;
- ciudades en una sola columna de 311,375 × 222,8 px;
- acceso flotante a 12 px de los bordes.

La composición coincide visualmente con las referencias móviles aprobadas. No se detectaron desbordes horizontales ni cambios de breakpoint.

### Tema oscuro

Se conserva la clave `localStorage.guiaEducativaTheme` y la clase `body.dark-theme`. El fondo calculado del panel oscuro fue `rgb(17, 28, 46)` (`#111c2e`) tanto en Vite como en Next.js. Títulos, buscador, variables y tarjetas heredan las mismas reglas de la demo.

Home no tiene un selector de tema visible. Para automatizar las dos capturas oscuras se utilizó temporalmente un parámetro de validación que aplicaba la misma clase; ese código se retiró antes de las validaciones finales y no forma parte de la migración. El estado final vuelve a leer exclusivamente `guiaEducativaTheme`, igual que Vite.

La animación `heroContentFade` dura 800 ms. Algunas imágenes de la línea base fueron capturadas durante esa transición y muestran el contenido parcialmente transparente. Las capturas Next se tomaron después de estabilizarla; no se alteró la animación para imitar un fotograma transitorio.

## Comportamiento validado

- La búsqueda ignora mayúsculas y diacríticos y filtra por coincidencia parcial.
- Una consulta sin coincidencias muestra `No encontramos esa ciudad.`.
- `Limpiar búsqueda` restaura las tres ciudades y oculta el estado vacío.
- Enter conserva el primer resultado visible y ejecuta la acción pendiente sin recargar.
- Los botones de ciudad y Centro de Control mantienen su aspecto, pero no navegan porque sus pantallas están fuera del alcance de esta etapa.
- No se observaron errores ni advertencias en la consola de Vite o del build de Next.js durante la comparación.

## Elementos simulados o pendientes

- Navegación desde Concepción, Monteros y Aguilares: pendiente de las futuras rutas de ciudad.
- Acceso a Login/Centro de Control: pendiente de sus futuras rutas y autenticación.
- Header general, navegación móvil y footer: no se incluyen porque no son visibles en Home.
- No se crearon rutas provisionales, modales, sliders, Supabase ni autenticación.

## Correcciones realizadas durante la comparación

1. Se eliminó el shell técnico temporal y se trasladó la estructura visible de Home.
2. Se copió únicamente el CSS efectivo de Home, variables y breakpoints necesarios.
3. Se retiró una limpieza de efecto React que quitaba `dark-theme` durante la verificación estricta de desarrollo; Vite mantiene esa clase durante la pantalla y Next.js ahora hace lo mismo.

No quedan diferencias visuales estructurales de bloqueo. La variación restante corresponde al fotograma del video, al momento de la animación y al raster de la herramienta de capturas, no a cambios de DOM o CSS.

## Cierre visual final de Home

Los cuatro pares tienen dimensiones equivalentes:

| Escenario | Dimensiones del par | Resultado |
| --- | --- | --- |
| Escritorio claro | 1440 × 900 | Estructura, geometría, tipografía y CSS equivalentes |
| Escritorio oscuro | 1440 × 900 | Estructura, geometría, tipografía y CSS equivalentes; el video cambia de fotograma |
| Móvil claro | 390 × 843 | Geometría responsive equivalente; Vite histórico fue capturado durante la animación de entrada |
| Móvil oscuro | 390 × 843 | Geometría responsive equivalente; Vite histórico fue capturado durante la animación de entrada |

Se generaron vistas lado a lado, superposiciones y diferencias en `revision/analisis/`. Las mediciones completas están en `revision/analisis.md`.

- Diferencias dinámicas aceptadas: fotograma del video y momento de la animación `heroContentFade`.
- Diferencias de rasterizado aceptadas: antialiasing de fuentes y compresión del raster de captura.
- Diferencias estructurales: ninguna.
- Diferencias CSS comprobables: ninguna.
- Correcciones en esta etapa: ninguna; `next-app/` no fue modificado.
- Estado final de escritorio: apto para aprobación visual.
- Estado final de móvil: apto para aprobación visual.

La recomendación técnica final es **aprobar visualmente Home**.
