# Comparación visual — Contador Público, Universidad Siglo 21, Concepción

## Alcance

Ruta Next.js: `/concepcion/universidad-siglo-21/carreras/contador-publico`.

Referencia Vite: Home → Concepción → Universidad Siglo 21 → segunda tarjeta **Contador Público** → **Ver carrera**. Las capturas se generaron con Chrome/CDP local, sin modificar las aplicaciones. El escritorio usa 1440×900 CSS px y el móvil usa 390×843 CSS px reales, con `devicePixelRatio: 1`. En móvil se verificaron `window.innerWidth = 390`, `window.innerHeight = 843` y `document.documentElement.clientWidth = 390`; no es un recorte de escritorio.

La carrera maestra local es `contador-publico`; la offering local es `universidad-siglo-21-concepcion-contador-publico`. El formulario continúa simulado, escribe solamente en `localStorage.guiaEducativaLeads` y se limpia tras las pruebas. La offering no posee WhatsApp propio: la ficha usa el fallback institucional `3865 41 2020`.

## Capturas fuente verificadas

| Escenario | Vite | SHA-256 Vite | Next.js | SHA-256 Next.js | Viewport / dimensiones PNG | Tema |
|---|---|---|---|---|---|---|
| Escritorio claro | `contador-vite-desktop-claro.png` — 468.305 B | `b0267636e134f2ce056c124582699abf8f662afba241450ff74d396beced1e14` | `contador-next-desktop-claro.png` — 468.328 B | `32a93bfb0c67d0c47e65fad06c682ffdf4e9e325c65e4235bd0f8457a624c710` | 1440×900 | Claro |
| Escritorio oscuro | `contador-vite-desktop-oscuro.png` — 291.757 B | `47b6484582088b03b10fcb9d87963a48424b3d3473759c6173e4c93c2b1be27e` | `contador-next-desktop-oscuro.png` — 291.779 B | `d5f3f4806444d1cc257f4ad9c441af2760d385baf2ee0bd71055af1dbbe64663` | 1440×900 | Oscuro |
| Móvil claro | `contador-vite-mobile-claro.png` — 289.383 B | `5bb32cc6fadbe292ac2aa9a4908fd23dfd8fc63b7df1b8e31a2e0a284a7e42a6` | `contador-next-mobile-claro.png` — 289.775 B | `2175735783090bb2fe3d914ca1a4c2048ad01b443a104dc9a1769441af97921d` | 390×843 | Claro |
| Móvil oscuro | `contador-vite-mobile-oscuro.png` — 253.303 B | `b4df5e5463c00720cd01cd1937250026848829ece36680471b673908cabf14f5` | `contador-next-mobile-oscuro.png` — 253.147 B | `0e721d5b9919a200a2c02f96759526d3b36fe8a2e8d28f3c36a4b8e389b4302e` | 390×843 | Oscuro |

Los ocho archivos tienen firma PNG válida, son legibles y sus dimensiones coinciden por par. Para cada escenario se incluyen `-lado-a-lado.png`, `-superposicion.png` y `-diferencias.png`; no se reescalaron ni retocaron los originales.

## Resultado

La ficha Next.js coincide visual y funcionalmente con la demo Vite para la región capturada. Se conservaron hero, imagen contextual, título, seis hechos, tabs sticky, contenido, sidebar, formulario, WhatsApp de fallback, modo claro/oscuro y comportamiento móvil. No se modificaron `CareerPageClient.js` ni `carrera.css`.

La tarjeta institucional mantiene sus cuatro carreras en el mismo orden: Abogacía, Contador Público, Lic. en Administración e Higiene y Seguridad. Solo Abogacía y Contador Público tienen navegación; las otras dos permanecen inactivas.
