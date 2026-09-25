# Comparación visual — Universidad Siglo 21 Concepción

Comparación de la ficha institucional canónica de la demo Vite con la migración Next.js disponible en `/concepcion/universidad-siglo-21`.

## Navegación utilizada

- Vite: Home → `Concepción` → tarjeta `Universidad Siglo 21`.
- Next.js: `/concepcion` → tarjeta `Universidad Siglo 21` → `/concepcion/universidad-siglo-21`.
- Regreso: botón `Volver a instituciones` → `/concepcion` en Next.js y retorno a la vista de ciudad en Vite.

## Método de captura y comparación

- Escritorio solicitado: 1440 × 900.
- Móvil solicitado: 390 × 843.
- Las ocho fuentes son PNG binarios reales, con firma `89 50 4E 47 0D 0A 1A 0A`.
- El backend del navegador exportó el contenido de escritorio calibrado en 1440 × 899. Para completar exactamente 1440 × 900 se duplicó exclusivamente la fila inferior de 1 px; no hubo reescala ni recorte de contenido.
- Las capturas móviles se exportaron directamente en 390 × 843, sin reescala ni recorte.
- `lado-a-lado` concatena Vite y Next.js sin cambiar su escala.
- `superposicion` mezcla ambas fuentes al 50 %.
- `diferencias` representa la diferencia absoluta amplificada 4× para hacer visibles variaciones pequeñas.
- La marquesina es animada; su fotograma no se sincronizó artificialmente. La posición de sus fotos es una diferencia dinámica esperada.
- El círculo negro con `N` que puede aparecer en Next.js es el acceso de herramientas de desarrollo de Next y no forma parte de la interfaz implementada.

## Capturas fuente

| Archivo | Escenario | Dimensiones | Tema | Bytes | Firma PNG | SHA-256 |
|---|---|---:|---|---:|---|---|
| `vite-siglo21-desktop-claro.png` | Vite escritorio | 1440 × 900 | Claro | 881876 | válida | `7c176b91ff6450d72370ecbaa3cb57f338df49ba34a06644074ccde93f2adcf0` |
| `next-siglo21-desktop-claro.png` | Next.js escritorio | 1440 × 900 | Claro | 891453 | válida | `5b4a22f5ca8e04ba49aef450840d5b57fedc2bf32511d27ddf8ece9252a02b8f` |
| `vite-siglo21-desktop-oscuro.png` | Vite escritorio | 1440 × 900 | Oscuro | 862057 | válida | `89fc10304a19ce4f9a0924d320e4097ece6efd7d521478052325b8ded5e62a38` |
| `next-siglo21-desktop-oscuro.png` | Next.js escritorio | 1440 × 900 | Oscuro | 888795 | válida | `6df707de1f7bf061334f3d9226f468000967a16f9c88cf60d4f822ad4cea1c42` |
| `vite-siglo21-mobile-claro.png` | Vite móvil | 390 × 843 | Claro | 442060 | válida | `c3f4744469749070561dc9734edd4518d1930b99ad7c25c341efd17d1d439ab1` |
| `next-siglo21-mobile-claro.png` | Next.js móvil | 390 × 843 | Claro | 446543 | válida | `eed4d6e7954a193d169fbb3f67a62c90c1c1f3dd264f8f73a80be48af0aa45b9` |
| `vite-siglo21-mobile-oscuro.png` | Vite móvil | 390 × 843 | Oscuro | 441850 | válida | `24b0141e5a1660432aaf1a37a301f8f454e7f1699e86268fcdb6c6426a0dbf07` |
| `next-siglo21-mobile-oscuro.png` | Next.js móvil | 390 × 843 | Oscuro | 451919 | válida | `5c88f7dde7e4188130d322fe64e630844020fc589fff97aa3e4575bebb2424c1` |

## Archivos de análisis visual

| Archivo | Dimensiones | Tema | Bytes | Firma PNG | SHA-256 |
|---|---:|---|---:|---|---|
| `desktop-claro-lado-a-lado.png` | 2880 × 900 | Claro | 1391580 | válida | `252461f1cafba0a290a30e60f0be1329d8946f105c14d53cae2ee43011b3374e` |
| `desktop-claro-superposicion.png` | 1440 × 900 | Claro | 950098 | válida | `5452cc676d2db17e6a7062023529bdd5d5b217b083e9498525ad12e13b7fd39d` |
| `desktop-claro-diferencias.png` | 1440 × 900 | Claro | 465154 | válida | `7cec7f66b9efb4e1043331aa50692de5a5f43bf1eee7fb6870b2dcc40f49bd04` |
| `desktop-oscuro-lado-a-lado.png` | 2880 × 900 | Oscuro | 1394356 | válida | `3fe9929d9068a1a5c0f40dd9748ca465f7563bf3bbe1da5320c6c414424aa61a` |
| `desktop-oscuro-superposicion.png` | 1440 × 900 | Oscuro | 937898 | válida | `7270f037982397d333b5e7f9aa11341c4f96ccd3b80cfcb00615e7f8ca2b26b7` |
| `desktop-oscuro-diferencias.png` | 1440 × 900 | Oscuro | 493097 | válida | `839ba259dbbeedc6336364f5f9e70b82f47ea326db7221c560580cccf30548a4` |
| `mobile-claro-lado-a-lado.png` | 780 × 843 | Claro | 469746 | válida | `ae80888cc155b2dfd85d73664f835f50fe39d701e473664e9c7272bcfab47f40` |
| `mobile-claro-superposicion.png` | 390 × 843 | Claro | 335097 | válida | `d46985ba9e23b08a2e33e4edd3da9a51d1d6e73fde924d2dfb6a9a61e37d5830` |
| `mobile-claro-diferencias.png` | 390 × 843 | Claro | 142721 | válida | `f2a829bfd6b1a509d1fb57af30a325ed328e92a95043b54d597628acf745062b` |
| `mobile-oscuro-lado-a-lado.png` | 780 × 843 | Oscuro | 449361 | válida | `e18712c1ed1313b2f89996bd8b2da8f6c3eeda5fc395d9815554eb162cf1396a` |
| `mobile-oscuro-superposicion.png` | 390 × 843 | Oscuro | 316399 | válida | `394b38f4f19e3ce7338dfbdce2aa81eb7a4b429ffcc241c132a6348cf3e0f316` |
| `mobile-oscuro-diferencias.png` | 390 × 843 | Oscuro | 138142 | válida | `61017a94ae9b84e29114ea4ec85f5a89363db92c0601dd727fcdb864668f2ffb` |

## Contenido presente

- Header público, navegación y control de tema.
- Botón `Volver a instituciones`.
- Portada institucional, tipo, ciudad, nombre y eslogan.
- Logo textual `US21` conservado en el DOM y oculto mediante `display: none`.
- Galería marquee con cuatro imágenes originales repetidas una vez: portada, estudiantes, aula e imagen de graduación.
- Cuatro tarjetas, en este orden: `Abogacía`, `Contador Público`, `Lic. en Administración`, `Higiene y Seguridad`.
- Badges, duración `3 años`, modalidad `Presencial`, ciudad `Concepción`, tipo `Privada`, botones `Ver carrera` y `Consultar`.
- Footer público.
- Botón flotante de administración conservado oculto, como corresponde a la ficha pública.

## Contenido deliberadamente ausente

No se añadieron datos de contacto visibles, mapa, email, web, redes sociales institucionales, horarios, video, formulario, leads, CTA nueva, descripción editorial adicional, métricas, carreras extra, breadcrumbs ni contenido SEO visible.

## Destinos temporalmente inactivos

- Las acciones `Ver carrera` y `Consultar` de las cuatro carreras no navegan, no redirigen y no muestran alertas nuevas.
- Las tarjetas de `Instituto Santa Bárbara` e `IES Concepción` continúan inactivas.
- El destacado `Instituto del Sur` continúa inactivo.
- Solo `Universidad Siglo 21` en `/concepcion` abre la ruta institucional migrada.

## Estado

Los cuatro pares tienen dimensiones equivalentes, firma PNG válida y geometría estática comparable. No quedan diferencias estructurales, CSS o de contenido conocidas; las diferencias visibles restantes pertenecen al fotograma del marquee, al rasterizado/compresión de captura y al overlay de desarrollo de Next.js.
