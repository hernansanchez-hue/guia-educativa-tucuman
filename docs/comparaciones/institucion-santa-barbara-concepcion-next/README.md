# Comparación visual — Instituto Santa Bárbara Concepción

Comparación de la ficha institucional canónica de la demo Vite con la migración Next.js disponible en `/concepcion/instituto-santa-barbara`.

## Navegación utilizada

- Vite: Home → `Concepción` → tarjeta `Instituto Santa Bárbara`.
- Next.js: `/concepcion` → tarjeta `Instituto Santa Bárbara` → `/concepcion/instituto-santa-barbara`.
- Regreso: botón `Volver a instituciones` → `/concepcion` en Next.js y retorno a la vista de ciudad en Vite.

## Método de captura y comparación

- Escritorio: 1440 × 900.
- Móvil: 390 × 843.
- Las ocho fuentes son PNG binarios reales, legibles y con firma `89 50 4E 47 0D 0A 1A 0A`.
- Las capturas se conservaron sin reescala, compresión posterior ni retoque visual.
- `lado-a-lado` concatena Vite y Next.js sin cambiar la escala de las fuentes.
- `superposicion` mezcla ambas fuentes al 50 %.
- `diferencias` representa la diferencia absoluta de píxeles.
- El marquee es animado y sus fotogramas no se sincronizaron artificialmente. La posición instantánea de sus imágenes es una diferencia dinámica esperada.

## Capturas fuente

| Archivo | Escenario | Dimensiones | Tema | Bytes | Firma PNG | SHA-256 |
|---|---|---:|---|---:|---|---|
| `vite-santa-barbara-desktop-claro.png` | Vite escritorio | 1440 × 900 | Claro | 1649680 | válida | `91564992c71cd3c17485c70071b0e8b55441c3ba7ad2b44b3bc19ece959b7b5e` |
| `next-santa-barbara-desktop-claro.png` | Next.js escritorio | 1440 × 900 | Claro | 1647687 | válida | `1730503fbfcd6cfc812eb47c90eab2d5a4089e45139acda010d07cc8f8ad8a4a` |
| `vite-santa-barbara-desktop-oscuro.png` | Vite escritorio | 1440 × 900 | Oscuro | 1648566 | válida | `9fad9b4ed24937f1ba5a35d22f77fa313b4e86694456bf42b04375de9b63b17e` |
| `next-santa-barbara-desktop-oscuro.png` | Next.js escritorio | 1440 × 900 | Oscuro | 1658953 | válida | `62d5c5a238fd7894cbbe18e722c24a863fe1932c59f37dd06faf80b87dff5004` |
| `vite-santa-barbara-mobile-claro.png` | Vite móvil | 390 × 843 | Claro | 416143 | válida | `5f3169b5ccd9d2701f7f4e4eca745601d3203aecd8d334273d942389d6299d5e` |
| `next-santa-barbara-mobile-claro.png` | Next.js móvil | 390 × 843 | Claro | 417157 | válida | `cbdc2fcf5498b1e366f2727e9b0c5f7a59d38767f0b881b1fbf4b18b3fde68d4` |
| `vite-santa-barbara-mobile-oscuro.png` | Vite móvil | 390 × 843 | Oscuro | 408816 | válida | `3a4aa3fb4bd499bb1f5cf348255bf23d42b357a68482527e939921f801565d6c` |
| `next-santa-barbara-mobile-oscuro.png` | Next.js móvil | 390 × 843 | Oscuro | 411935 | válida | `847aeb89df30eddd19858a9d1cb50e1133a5724009aa540de2413b273fc6de31` |

## Archivos de análisis visual

| Archivo | Dimensiones | Tema | Bytes | Firma PNG | SHA-256 |
|---|---:|---|---:|---|---|
| `desktop-claro-lado-a-lado.png` | 2880 × 900 | Claro | 2570882 | válida | `9d7120328630e162be8d4670014cb0f748ee98b42b6d4cf77a13499cd27316b6` |
| `desktop-claro-superposicion.png` | 1440 × 900 | Claro | 1817284 | válida | `f18ec865a2aaa2f1479baf6934e173b6769533094bb6462be98b6c2301bfaeec` |
| `desktop-claro-diferencias.png` | 1440 × 900 | Claro | 864857 | válida | `57a7a869d99f3e0322021776841031f7adb64e94bcd8effcb6734e04255b3742` |
| `desktop-oscuro-lado-a-lado.png` | 2880 × 900 | Oscuro | 2611589 | válida | `b14b4fba257d3837cf946f543d0677a0ee3a92d2b7337fd6a7970debc2e0a4c2` |
| `desktop-oscuro-superposicion.png` | 1440 × 900 | Oscuro | 1836023 | válida | `b48e5208721dd1c35f79b5ffa2fb61e47fb046d92f225a115b9f55432e3da916` |
| `desktop-oscuro-diferencias.png` | 1440 × 900 | Oscuro | 896616 | válida | `d9c5c6943431fc5f54b4df5e12b9f8b02fdd9eef4918be5f3d8a513df7157130` |
| `mobile-claro-lado-a-lado.png` | 780 × 843 | Claro | 615339 | válida | `90cca7eefe5454b9bc199682a8b8e1e4424b9a4fe17ab638204302b4a89b0e28` |
| `mobile-claro-superposicion.png` | 390 × 843 | Claro | 443147 | válida | `24ecfe3dc3ad1dc639c636026fa8f7af9a6f43a8388b3a3653a5c200f1c56b97` |
| `mobile-claro-diferencias.png` | 390 × 843 | Claro | 175841 | válida | `e5e80d26c166a3682734ef5d45a011f81ccdaccb0c374865acfc5d6bc1612ca7` |
| `mobile-oscuro-lado-a-lado.png` | 780 × 843 | Oscuro | 609419 | válida | `c33d4f11836387a1ca0e8cd6ad2e628b13d9d8b35aafdbb70b4beb396c525736` |
| `mobile-oscuro-superposicion.png` | 390 × 843 | Oscuro | 441709 | válida | `5b523b7c5e5925a7c1cbbb4df1170a45720072f9f4347191984c30ddec5969e1` |
| `mobile-oscuro-diferencias.png` | 390 × 843 | Oscuro | 183192 | válida | `36ed0cd25bedd8c735a9ad8e81bc36dfabdced0c8374cfef657d684a17f19643` |

## Secciones presentes

- Header público, navegación y control de tema.
- Botón `Volver a instituciones`.
- Portada, tipo, ciudad, nombre, slogan y descripción canónicos.
- Logo textual `ISB` presente en el DOM y oculto mediante CSS, sin ocupar espacio visual.
- Marquee formado por cuatro imágenes canónicas repetidas una vez: ocho nodos en total y en el mismo orden de la demo.
- Tres carreras, en este orden: `Instrumentación Quirúrgica`, `Laboratorio de Análisis Clínicos` y `Diagnóstico por Imágenes`.
- Imágenes, badges, duración `3 años`, modalidad `Presencial`, ciudad `Concepción`, tipo `Privada`, descripción y botones canónicos de cada tarjeta.
- Footer público y botón flotante administrativo oculto.

## Secciones deliberadamente ausentes

No se añadieron dirección visible, WhatsApp, teléfono, email, web, mapa, redes sociales institucionales, horarios, video, formulario, leads, contacto, métricas, carreras adicionales, breadcrumbs ni contenido SEO visible.

## Estados y datos conservados

- Las acciones `Ver carrera` y `Consultar` de las tres tarjetas permanecen visualmente activas pero funcionalmente inactivas: no navegan, no redirigen y no generan alertas.
- La dirección cargada corresponde a Aguilares aunque la ficha pertenece al contexto de Concepción. Se conserva sin mostrarla: **inconsistencia canónica conservada temporalmente para mantener fidelidad con la demo**.
- `IES Concepción` y el destacado `Instituto del Sur` permanecen sin ruta.
- Universidad Siglo 21 continúa navegando a su ficha validada.

## Estado

Los cuatro pares tienen dimensiones equivalentes, firma PNG válida y geometría comparable. Tras corregir el apilado del footer móvil exclusivamente para Santa Bárbara, no quedan diferencias estructurales, CSS ni de contenido conocidas. Las diferencias visibles restantes corresponden al fotograma dinámico del marquee y a variaciones menores de rasterizado/compresión de captura.
