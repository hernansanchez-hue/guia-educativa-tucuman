# Comparación visual — Lic. en Administración, Universidad Siglo 21, Concepción

## Alcance y resolución de identidad

Ruta contextual Next.js: `/concepcion/universidad-siglo-21/carreras/lic-en-administracion`.

La demo Vite abre la tercera tarjeta de Universidad Siglo 21 mediante un id efímero con prefijo `lic-en-administracion`. Por ello, la carrera maestra usa id/slug `lic-en-administracion`. La tarjeta existente conserva su id visual/dato `licenciatura-en-administracion`; se la conecta mediante un mapeo explícito a la ruta canónica. La URL con el id legado permanece inválida.

Carrera maestra: `lic-en-administracion`. Offering: `universidad-siglo-21-concepcion-lic-en-administracion`. No tiene WhatsApp propio; el enlace usa el fallback institucional `3865 41 2020`. El formulario sigue siendo simulado y usa solamente `localStorage.guiaEducativaLeads`; los datos de prueba se eliminaron.

## Capturas fuente verificadas

Chrome/CDP generó las capturas sin modificar las aplicaciones. Escritorio: 1440×900 CSS px. Móvil: 390×843 CSS px reales, `devicePixelRatio: 1`, `window.innerWidth: 390`, `window.innerHeight: 843` y `document.documentElement.clientWidth: 390`.

| Escenario | Vite (bytes / SHA-256) | Next.js (bytes / SHA-256) | PNG |
|---|---|---|---|
| Escritorio claro | `administracion-vite-desktop-claro.png` — 430.735 B — `02263fe4823b2a8a4231ae38ec3e7df061c49e28979a1f0adee0796dccf3f0e3` | `administracion-next-desktop-claro.png` — 430.648 B — `c54238b26345b23ce2858ceb2a8d71067c7a9f3cb3f6f2c0d747eca1a3fe3f39` | 1440×900, claro |
| Escritorio oscuro | `administracion-vite-desktop-oscuro.png` — 258.597 B — `1fa78a36343698763338d58faf7319f4cc0ee2fa9400cb26eee19029dea534fa` | `administracion-next-desktop-oscuro.png` — 258.619 B — `69a59d5156812a96bd7c5f6216a6cb8193afb294a148968217633045aa72b68f` | 1440×900, oscuro |
| Móvil claro | `administracion-vite-mobile-claro.png` — 182.210 B — `75463ecbd927082d9599197dcc9aa6a8051448408f2b96384636a68f44c044e4` | `administracion-next-mobile-claro.png` — 182.335 B — `06079ab70dbbc000c04e009412b90447736bf7b70ae7b11c8037801829150eb9` | 390×843, claro |
| Móvil oscuro | `administracion-vite-mobile-oscuro.png` — 141.523 B — `25fdff17de8a2ab010a81bc74249161aae029d891b25343e79722b89bc8a3750` | `administracion-next-mobile-oscuro.png` — 141.372 B — `fb7d15166060fe5b1d3a9388116f16223a52696b6ff6bc7866d671fd80f64fe3` | 390×843, oscuro |

Cada par tiene dimensiones idénticas, firma PNG válida y lectura completa. Para cada escenario se incluyen lado a lado, superposición y diferencia, sin reescalar ni alterar originales.

## Resultado

La ficha coincide con Vite: imagen `imageBank.design`, nombre `Lic. en Administración`, badge `Próximo ingreso` en la tarjeta, seis hechos, tabs, contenido, sidebar, formulario, footer y temas. `CareerPageClient.js` y `carrera.css` no se modificaron. Abogacía y Contador mantienen navegación; Higiene y Seguridad continúa inactiva.
