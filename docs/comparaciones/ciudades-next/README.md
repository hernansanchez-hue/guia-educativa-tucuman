# Migración inicial de la ruta /ciudades

Fecha: 4 de agosto de 2026.

## Resultado

La ruta real `/ciudades` responde con la misma composición visual validada de Home. No se diseñó una pantalla nueva ni se agregaron títulos, subtítulos, breadcrumbs, tarjetas, filtros, footer o contenido inventado.

Las únicas diferencias respecto de Home son la URL pública `/ciudades` y el archivo de ruta de App Router. El DOM visible, los textos, video, overlay, header, título, selector, botones, tema, responsive y botón flotante son los mismos.

## Estructura reutilizada

- `app/components/CitySelector.js`: componente cliente compartido. Contiene estado, normalización, buscador, SVG, botones y estado vacío.
- `app/components/HomeClient.js`: conserva la composición completa de Home y ahora renderiza `CitySelector` en la ubicación exacta del fragmento extraído.
- `app/page.js`: Home continúa renderizando `HomeClient` sin cambios.
- `app/ciudades/page.js`: página de seis líneas que importa `HomeClient`, carga la hoja existente `home.css` y reutiliza la composición aprobada.

No se creó CSS nuevo ni se modificó `home.css`.

## Lista canónica

Se conserva exactamente este orden:

1. Concepción.
2. Monteros.
3. Aguilares.

Los tres elementos siguen siendo botones `.city-card`, con los mismos `data-city`, iconos SVG, estructura interna, clases y estados visuales.

## Búsqueda y estados

| Prueba | Resultado |
| --- | --- |
| Parcial `cep` | Solo Concepción visible |
| Sin tilde `concepcion` | Solo Concepción visible |
| Mayúsculas y tilde `CONCEPCIÓN` | Solo Concepción visible |
| Sin coincidencia `sin-resultados` | Tarjetas ocultas y estado vacío visible |
| Limpiar | Campo vacío y tres ciudades restauradas |
| Enter con `mon` | Monteros permanece como primera coincidencia; URL sin cambios |
| Botón de búsqueda | URL sin cambios |

## Navegación

La composición visible de Home no contiene actualmente un enlace o ítem general “Ciudades” que pueda conectarse sin inventar DOM. Por esa razón no se agregó navegación visible nueva. `/ciudades` queda disponible como ruta directa HTTP 200.

Concepción, Monteros y Aguilares permanecen temporalmente sin destino real. El botón de búsqueda, Enter y los botones individuales no crean rutas hasta que se autorice `/ciudades/[ciudad]`. El botón flotante del Centro de Control también conserva su aspecto y permanece inactivo en esta etapa.

## Responsive

- Escritorio: viewport y raster 1440 × 900; grilla de tres columnas.
- Móvil: viewport técnico 390 × 844 y raster final 390 × 843; grilla de una columna.
- No existen desbordes horizontales.
- Se mantienen los breakpoints de 1100, 720, 414 y 360 px.
- La geometría de `/ciudades` coincide con Home: panel de 920 × 251,6 px en escritorio y 351,375 × 379,6 px en móvil.

El backend de captura descuenta una fila vertical en móvil. Se usó el mismo método ya validado para Home, de modo que los PNG finales coinciden con las referencias móviles de 390 × 843.

## Tema claro y oscuro

El comportamiento definitivo no agrega controles visibles y continúa basado exclusivamente en `localStorage.guiaEducativaTheme` y `body.dark-theme`.

- Claro: panel y buscador `rgb(255, 255, 255)`.
- Oscuro: panel `rgb(17, 28, 46)` y buscador `rgb(12, 23, 40)`.

Se utilizó un mecanismo temporal local para activar oscuro durante la captura. Fue retirado completamente antes de lint, build y commit; no sustituye `localStorage` ni forma parte de los archivos versionados.

## Capturas

Todas provienen de un build local de producción, sin indicadores de desarrollo. El backend devolvió raster JPEG y se transcodificó a PNG binario real sin reescalar, recortar ni retocar. Todos los archivos se leen completamente y poseen firma PNG válida.

| Archivo | Tema | Dimensiones | Tamaño | SHA-256 |
| --- | --- | --- | ---: | --- |
| `ciudades-desktop-claro.png` | Claro | 1440 × 900 | 1067188 bytes | `F01CB8050DF394E8DBA5677D42DB15787D2DCB2E80EACB4BE8AA669CEE0D39EB` |
| `ciudades-desktop-oscuro.png` | Oscuro | 1440 × 900 | 1054184 bytes | `BC81E449AE8ED2AB92952911939F664A34C44100EF1BF146FE7AF68EFCDDC5FC` |
| `ciudades-mobile-claro.png` | Claro | 390 × 843 | 290416 bytes | `95963D5CD8DE98666745022524B23C9D02B3DC03992376D7A648708CBF587B21` |
| `ciudades-mobile-oscuro.png` | Oscuro | 390 × 843 | 277601 bytes | `6655B6450E7BE630A81EA3EB3B31414F53EA667FF07F0F6BA1FBFCE00A9D9AB1` |

Las cuatro capturas adicionales `home-regresion-*` documentan la regresión de Home y se detallan en `regresion-home.md`.

## Diferencias respecto de la demo Vite

- Vite no posee una pantalla general independiente; Next.js sí expone la URL real `/ciudades` reutilizando la superficie de Home.
- Los botones de la demo abren vistas dinámicas de ciudad dentro de la SPA. En Next.js permanecen inactivos porque esas rutas están fuera del alcance autorizado.
- No hay otras diferencias visibles o estructurales.

## Validación técnica

- `/`: HTTP 200.
- `/ciudades`: HTTP 200.
- Consola: sin errores ni advertencias de la aplicación.
- App Router: `/ciudades` se genera como contenido estático.
- Lint: correcto.
- Build: correcto.
- Advertencia conocida: Next.js detecta los lockfiles independientes de la raíz Vite y `next-app`; no se cambió configuración ni se eliminó ningún lockfile para ocultarla.

## Riesgos pendientes

1. Definir slugs y correspondencia de datos para Concepción, Monteros y Aguilares antes de crear `/ciudades/[ciudad]`.
2. Conectar la primera coincidencia y cada botón únicamente cuando existan rutas dinámicas reales.
3. Mantener el nombre visible con tilde separado del slug `concepcion`.
4. Evitar que una futura capa de datos altere orden, cantidad, DOM, bordes o responsive del selector.
5. Resolver la divergencia de la demo entre ciudades públicas hardcodeadas y `guiaEducativaCities` sin modificar la referencia visual.
6. Repetir comparación visual de Home y `/ciudades` cuando se conecten rutas dinámicas.
