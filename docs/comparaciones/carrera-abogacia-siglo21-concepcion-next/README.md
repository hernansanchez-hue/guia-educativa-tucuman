# Comparación visual — Abogacía · Universidad Siglo 21 · Concepción

Ruta Next.js validada: `/concepcion/universidad-siglo-21/carreras/abogacia`.

## Método

Las capturas se generaron con Chrome local headless mediante CDP, sin instalar dependencias ni crear herramientas dentro del repositorio. Vite se abrió mediante la navegación SPA Home → Concepción → Universidad Siglo 21 → Abogacía. Next.js se abrió mediante la ruta contextual. Se esperaron fuentes e imágenes externas antes de capturar.

- Escritorio: `window.innerWidth=1440`, `window.innerHeight=900`, `devicePixelRatio=1`, `documentElement.clientWidth=1425`; la diferencia de 15 px corresponde a la barra vertical.
- Móvil: `window.innerWidth=390`, `window.innerHeight=843`, `devicePixelRatio=1`, `documentElement.clientWidth=390` y `scrollWidth=390`.
- No existe overflow horizontal accidental.
- Todos los archivos tienen firma PNG `89504e470d0a1a0a`, fueron leídos completamente por Sharp y no fueron reescalados.

## Capturas fuente

| Escenario | Aplicación | Archivo | Dimensiones | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| Escritorio claro | Vite | `abogacia-vite-desktop-claro.png` | 1440×900 | 449479 | `26f2abb45c141dcac298b5e55d68868368fa7d20824cfcc4a32d979293f95989` |
| Escritorio claro | Next | `abogacia-next-desktop-claro.png` | 1440×900 | 449522 | `fab98676a4556163fd7f13e64dcfb6435d325e2d63f38d1582fe7dc33fb9c43a` |
| Escritorio oscuro | Vite | `abogacia-vite-desktop-oscuro.png` | 1440×900 | 277938 | `17a670beb006ca4371653dc9585332629e68226bba231563fd225be4cb9ca189` |
| Escritorio oscuro | Next | `abogacia-next-desktop-oscuro.png` | 1440×900 | 277973 | `4d98910cec3af319dd84833018238af6180cd2c81f66c25cfb243c63dd1834f5` |
| Móvil claro | Vite | `abogacia-vite-mobile-claro.png` | 390×843 | 209459 | `35bacb6b0bcecd96adfc1bc5d5dcc86f1ee5b9d7467235f890ae6fc59e4a6cff` |
| Móvil claro | Next | `abogacia-next-mobile-claro.png` | 390×843 | 209912 | `feabe22dc8d04700bd9f99dee25bc83d6dc9a40cfaff34a50e90c29ce96ee826` |
| Móvil oscuro | Vite | `abogacia-vite-mobile-oscuro.png` | 390×843 | 166092 | `f275dbf227fcd9630838908e30e80eb4ee168c392f3169039e04f9d0c2f7cfc1` |
| Móvil oscuro | Next | `abogacia-next-mobile-oscuro.png` | 390×843 | 165943 | `5c90308d0ba731c259bef602c0b09b3ec0865bb542c231b197488f55411293e4` |

## Comparaciones derivadas

| Escenario | Lado a lado | Superposición | Diferencias |
|---|---|---|---|
| Escritorio claro | `desktop-claro-lado-a-lado.png` · 550483 B · `431c9dc06f2545430543937c095ef4699f2e2ecab140f4c779cb5d506b7dcf7d` | `desktop-claro-superposicion.png` · 476405 B · `0994a5e7b8ffcccaa24b7105aff8cbfc87bc73ea3bb3c968b2c0bb7e049f78ff` | `desktop-claro-diferencias.png` · 28211 B · `213a9983c2ae746a9abaf1d99fb1e239f6163d5b61bb5937396935ba4d066590` |
| Escritorio oscuro | `desktop-oscuro-lado-a-lado.png` · 405989 B · `1996c75418b79c443731ffb95194b4aa15b7c8c22b0eb001f91742f29ae9e7f8` | `desktop-oscuro-superposicion.png` · 347604 B · `39306283837d6c56d5ded9aaeb69a9e16a8bde318d9ba6d461cf950dc43545a2` | `desktop-oscuro-diferencias.png` · 28128 B · `e2a1a19879bc3c8c4bc0c8e21b6613555a2fccf16b0d5b41522c760c4bb8e06b` |
| Móvil claro | `mobile-claro-lado-a-lado.png` · 308806 B · `5466b69c5e2d5cef397bb74d7073c7ac3b0ce671191e04991dbe4f28768610f3` | `mobile-claro-superposicion.png` · 260314 B · `ed1e2a43f7a265952dfaa071327d9dc6aee61d90937e5bed7eb44b97e6348154` | `mobile-claro-diferencias.png` · 38666 B · `002ca4e6c2c9300e08803a1b275bc92d511bbffb51e50a242afc5dabcf85bddf` |
| Móvil oscuro | `mobile-oscuro-lado-a-lado.png` · 241132 B · `29bbde4a4b25f3e380dfa28634fc814c865e20ee81c7a28fc83d2e5590c75dc2` | `mobile-oscuro-superposicion.png` · 220609 B · `b98c8b1238cb8c3418efb5773045b407f8bd21a136895d64de9ef88d1e9c71a0` | `mobile-oscuro-diferencias.png` · 9298 B · `ebddd59844b5058578a85480524e1bbf27bf53fa9d2a7d76bf68b9beea96593c` |

Las imágenes lado a lado miden 2880×900 en escritorio y 780×843 en móvil. Superposiciones y diferencias conservan las dimensiones del par fuente.

## Estructura y comportamiento validado

- Header, regreso, hero, imagen, nombre, institución, ciudad, seis hechos, cinco tabs, contenido académico, plan, requisitos, dos FAQ, sidebar, formulario, WhatsApp y footer están presentes.
- Las tabs conservan `position: sticky`, offset 82 px en escritorio y 72 px en móvil. En 390 px el `flex-wrap` canónico las distribuye en varias filas; aunque el contenedor declara `overflow-x:auto`, el resultado real no requiere desplazamiento horizontal.
- El formulario continúa simulado y escribe en `localStorage.guiaEducativaLeads`; la prueba se eliminó después de validarla.
- WhatsApp usa el fallback institucional `3865 41 2020`, convertido a `543865412020`, porque la oferta no posee número específico.
- Carrera maestra: `abogacia`. Oferta: `universidad-siglo-21-concepcion-abogacia`. Institución: `universidad-siglo-21`.
- Acción activa: `Ver carrera` de Abogacía. Permanecen inactivas las tarjetas Contador Público, Lic. en Administración e Higiene y Seguridad.
- Duplicación temporal: la ficha institucional mantiene los datos resumidos de Abogacía en `institutions.js`; la página contextual usa `careers.js` y `offerings.js`.

## Resultado

No quedan diferencias estructurales, CSS o de contenido propias de la ficha contextual. Las diferencias de píxel corresponden a rasterizado/antialiasing y al fondo degradado. El footer compartido de Next tiene una altura móvil distinta de la demo, diferencia preexistente en el componente común ya validado y no introducida por esta ruta.
