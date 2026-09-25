# Comparación visual — IES Concepción

Comparación de la ficha canónica de la demo Vite con la ruta Next.js `/concepcion/ies-concepcion`.

## Método

- Escritorio: 1440 × 900.
- Móvil: Chromium headless vía CDP con `window.innerWidth = 390`, `window.innerHeight = 843` y `devicePixelRatio = 1` antes de cada captura.
- En móvil, `document.documentElement.clientWidth = 375` y `scrollWidth = 375`: Chromium reserva 15 px para el scrollbar vertical; no existe overflow horizontal.
- La navegación Vite fue Home → tarjeta `Concepción` → tarjeta `IES Concepción`. En Next.js se abrió `/concepcion/ies-concepcion`.
- Todos los PNG tienen firma `89 50 4E 47 0D 0A 1A 0A`, son legibles y no fueron reescalados ni retocados.

## Capturas fuente

| Archivo | Viewport / dimensión | Tema | Bytes | SHA-256 |
|---|---|---|---:|---|
| `ies-vite-desktop-claro.png` | 1440 × 900 | Claro | 1761178 | `b836f5481dd5eaa5bff94137660b1323fff3b84a8fef681e03d0e21ab73fb9ca` |
| `ies-next-desktop-claro.png` | 1440 × 900 | Claro | 1765015 | `9db19b46a3da54580e96d8fe98e8d59bf44eb0bb1aa6d9069eeaa122bb4eb5ef` |
| `ies-vite-desktop-oscuro.png` | 1440 × 900 | Oscuro | 1771241 | `e3c502b1531e210d97dbbb8d5e4d4e613d4a897c33267a0086d08e21441f46f5` |
| `ies-next-desktop-oscuro.png` | 1440 × 900 | Oscuro | 1748794 | `f058af3fc4b6e6c90d54ce0fcc05e75f52c09ab127908ba218b9dd739828db61` |
| `ies-vite-mobile-claro.png` | 390 × 843 | Claro | 419026 | `259cfe009b60d0ab81d91addcc07251ba974344245e1396095d08f40dbe78218` |
| `ies-next-mobile-claro.png` | 390 × 843 | Claro | 418079 | `17f10a7716f577c33f96f2b89bf12640a0c1e057e1b5d6e3001a935b8c369a73` |
| `ies-vite-mobile-oscuro.png` | 390 × 843 | Oscuro | 377987 | `9dd29563276c34a2c7e9e2150b5f8ae530f49d19444c169caae2a98a2a9ce516` |
| `ies-next-mobile-oscuro.png` | 390 × 843 | Oscuro | 367788 | `5f373649080d9d85609c31ab6555149f6a431a3ffad64f74dd8c0e817d3f47ff` |

Para cada uno de los cuatro escenarios se incluyen `lado-a-lado`, `superposicion` y `diferencias`: doce imágenes comparativas en total.

## Resultado

Los cuatro pares tienen dimensiones equivalentes. La ficha conserva portada, tipo, nombre, slogan, logo `IES` oculto, galería de ocho nodos, tres carreras y footer. Las diferencias de píxel restantes se concentran en la fase no sincronizada del marquee y en el rasterizado/compresión de la captura.
