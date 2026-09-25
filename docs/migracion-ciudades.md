# Auditoría inicial de la pantalla general de Ciudades

Fecha: 4 de agosto de 2026.

Rama: `migracion-ciudades`.

Ruta futura auditada: `/ciudades`.

## Alcance y hallazgo principal

La demo Vite no contiene actualmente una vista SPA independiente para el listado general de ciudades. La superficie pública que cumple esa función está embebida en Home, dentro de `#home`, mediante el selector `.city-box` y la grilla `.cities`.

Al seleccionar una ciudad, la SPA no abre una vista general `/ciudades`: ejecuta `showCity(city)` y activa directamente `#cityPage`, que corresponde a la futura página dinámica `/ciudades/[ciudad]` y muestra instituciones de la ciudad elegida.

Por lo tanto, la fuente de verdad visual para una futura `/ciudades` es el selector visible de Home. No existe en la demo una segunda composición, un encabezado “Ciudades”, una imagen propia ni un layout independiente que pueda inventarse durante la migración.

## Ubicación dentro de la SPA

| Elemento | Archivo | Ubicación lógica |
| --- | --- | --- |
| Selector general | `index.html` | `main#home.home > .home-inner > .city-box` |
| Grilla de ciudades | `index.html` | `.city-box > .cities` |
| Pantalla dinámica posterior | `index.html` | `section#cityPage.page` |
| Datos y comportamiento | `src/main.js` | funciones de búsqueda y `showCity(city)` |
| Estilos | `src/styles.css` | reglas de Home, `.city-box`, `.city-search`, `.cities` y `.city-card` |

`#cityPage` forma parte del inventario porque es el destino de cada ciudad, pero su migración queda fuera de esta etapa.

## Estructura HTML actual

La jerarquía efectiva es:

```text
div.app-shell
├── header#homeHeader.home-header
│   └── div.logo
│       ├── span.logo-mark (“GE”)
│       ├── texto “Guía Educativa”
│       └── span (“Tucumán”)
└── main#home.home
    ├── video.hero-video
    ├── div.hero-overlay
    └── div.home-inner
        ├── h1
        └── div.city-box[aria-label="Selector de ciudades"]
            ├── h2
            ├── div.city-search[role="search"]
            │   ├── svg de búsqueda decorativo
            │   ├── input#citySearchInput[type="search"]
            │   ├── button “Buscar ciudad”
            │   ├── span.city-search-divider
            │   └── button “Limpiar búsqueda”
            └── div.cities
                ├── button.city-card[data-city="Concepción"]
                ├── button.city-card[data-city="Monteros"]
                ├── button.city-card[data-city="Aguilares"]
                └── p#cityEmptyState.city-empty.hidden
```

Cada `.city-card` contiene `.city-card-head`, un SVG `.city-card-icon` y un `<strong>` con el nombre de la ciudad. Los botones son elementos HTML reales, no enlaces.

## Textos completos

### Textos visibles

- `GE`
- `Guía Educativa`
- `Tucumán`
- `Toda la oferta educativa de Tucumán en un solo lugar`
- `Elegí tu ciudad`
- `Buscar ciudad` — placeholder del buscador.
- `Concepción`
- `Monteros`
- `Aguilares`
- `No encontramos esa ciudad.` — aparece cuando no existen coincidencias.

### Textos accesibles y títulos

- `Selector de ciudades`
- `Buscar ciudad`
- `Limpiar búsqueda`

La demo no muestra un título visible “Ciudades” en esta superficie.

## Imágenes, video e iconos

- La lista de ciudades no utiliza imágenes raster por ciudad.
- Cada tarjeta repite un pin de ubicación como SVG inline de 24 × 24 de viewport y 20 × 20 computados.
- El buscador contiene un SVG decorativo de lupa, un SVG de acción de búsqueda y un SVG de cierre/limpieza.
- El logotipo es tipográfico; `GE` se dibuja con texto dentro de `.logo-mark`.
- La composición depende visualmente del video de fondo de Home:
  `https://res.cloudinary.com/disj9fs8m/video/upload/q_auto/v1782350401/get/hero/v2l8k0maxocxnxf0yerh.mp4`.
- `.hero-overlay` agrega el degradado azul sobre el video.
- La fuente externa principal es Poppins. Geist también se importa en la hoja global, pero no es la familia computada de esta pantalla.

## Clases y reglas CSS relevantes

### Contenedor y composición

- `.app-shell`
- `.home-header`
- `.home-header .logo`
- `.home-header .logo-mark`
- `.logo`
- `.logo-mark`
- `.home`
- `.hero-video`
- `.hero-overlay`
- `.home-inner`
- `.home h1`
- `.home h1 span`
- `@keyframes heroContentFade`

### Selector y búsqueda

- `.city-box`
- `.city-box h2`
- `.city-search`
- `.city-search:focus-within`
- `.city-search > svg`
- `.city-search input`
- `.city-search input::placeholder`
- `.city-search button`
- `.city-search button:hover`
- `.city-search button svg`
- `.city-search-divider`
- `.city-empty`

### Grilla y tarjetas

- `.cities`
- `.city-card`
- `.city-card:hover`
- `.city-card::before`
- `.city-card:hover::before`
- `.city-card:focus-visible::before`
- `.city-card:focus-visible`
- `.city-card-head`
- `.city-card-icon`
- `.city-card strong`
- `.city-card small`
- `.city-stats`
- `.city-stat`
- `.hidden`

### Valores visuales sensibles

- `.city-box`: ancho máximo 920 px, padding 24 px, radio 8 px y `var(--sombra)`.
- `.city-search`: ancho máximo 480 px, alto 46 px, radio 6 px y separación inferior 20 px.
- `.cities`: tres columnas iguales, gap 0 y bordes superior/izquierdo.
- `.city-card`: alto mínimo 86 px, padding 18 × 22 px, bordes derecho/inferior y radio 0.
- El borde verde de interacción se implementa con `::before`, desde `top: 22px` hasta `bottom: 22px`, ancho 5 px.
- `.city-card-icon`: 20 × 20 px.
- Nombre de ciudad: 18 px, peso 700.

Cambiar la relación de hijos directos, envolver botones innecesariamente o sustituirlos por elementos con estilos de navegador distintos puede romper bordes, alturas y estados de foco.

## Variables visuales

| Variable | Valor claro | Uso en esta superficie |
| --- | --- | --- |
| `--azul` | `#173b7a` | Marca, títulos y nombres de ciudad |
| `--azul-2` | `#2456a6` | Paleta global relacionada |
| `--verde` | `#19a974` | Pin, marca y estado interactivo |
| `--gris` | `#f5f7fa` | Fondo global |
| `--linea` | `#dfe7f2` | Sistema general de bordes |
| `--texto` | `#172033` | Texto principal |
| `--muted` | `#667085` | Estado vacío y texto secundario |
| `--blanco` | `#ffffff` | Panel, buscador y tarjetas |
| `--sombra` | `0 16px 36px rgba(15, 23, 42, 0.13)` | Sombra del panel |
| `--radio` | `8px` | Radio del panel |

También son relevantes los colores literales `#35d083`, `#6b7280`, `#4b5563`, `#dfe3e8`, `#eefaf5` y el fondo base `#0c2349`.

## Responsive

### Escritorio

- `.home-inner` tiene ancho máximo 980 px.
- `.city-box` tiene ancho máximo 920 px.
- La grilla usa tres columnas sin separación.
- En la línea base de 1440 × 900, el panel mide 920 × 251,6 px y el buscador 480 × 46 px.

### Hasta 1100 px

- Se reducen padding horizontal del header, tamaño del logotipo y espacios de navegación.
- No cambia todavía la estructura de tres columnas del selector.

### Hasta 720 px

- Home usa padding lateral de 5 %, padding superior 92 px e inferior 20 px.
- `.cities` pasa a `grid-template-columns: 1fr`.
- El header de Home queda absoluto con padding vertical de 18 px.
- En 390 × 844, el panel mide aproximadamente 351,375 × 379,6 px; el buscador 311,375 × 46 px; cada tarjeta 310,575 × 74 px.

### Hasta 414 px

- `.home-inner` se limita a 352 px.
- `.city-box` reduce padding a 20 px.
- `.city-card` usa alto mínimo 74 px y padding 16 × 18 px.

### Hasta 360 px

- El logo de Home baja a 18 px y `.logo-mark` a 32 × 32 px.
- El título principal usa 31 px.
- El buscador ajusta padding horizontal a 10/8 px.

No existe lógica JavaScript separada para responsive; el comportamiento depende únicamente de CSS.

## Modo claro y oscuro

El tema se activa mediante `body.dark-theme` y se persiste con `localStorage.guiaEducativaTheme`.

En oscuro cambian las variables:

- `--gris: #0b1423`
- `--linea: #2c3a4f`
- `--texto: #e8eef8`
- `--muted: #a5b3c7`
- `--blanco: #111c2e`

Reglas específicas afectan `.city-box`, headings, inputs y `.city-search`. El panel y las tarjetas heredan `--blanco: #111c2e`; el buscador usa `#0c1728` y borde `#34445b`.

El hover de `.city-card` conserva en la demo un degradado claro literal (`#ffffff` a `#eefaf5`) incluso bajo tema oscuro. Esto es parte del comportamiento canónico actual y no debe “corregirse” silenciosamente durante la migración.

## Navegación desde Home

### Demo Vite

- Click en una tarjeta: `showCity('Concepción' | 'Monteros' | 'Aguilares')`.
- Botón de búsqueda: abre la primera tarjeta visible.
- Enter dentro del input: previene el envío y abre la primera tarjeta visible.
- No existe un paso intermedio equivalente a `/ciudades`.
- No se usa `history.pushState`, hash ni URL simulada; el estado vive en memoria y clases CSS.

### Home migrada a Next.js

Los botones de ciudad permanecen visualmente presentes pero su navegación está pendiente, porque las rutas dinámicas todavía no fueron migradas. Una futura `/ciudades` no debe cambiar los destinos canónicos de Home sin autorización: la demo navega desde cada ciudad directamente a su vista dinámica.

## Tarjetas y datos hardcodeados

Las tres tarjetas públicas están escritas directamente en `index.html`:

| Ciudad | `data-city` | Destino actual |
| --- | --- | --- |
| Concepción | `Concepción` | `showCity('Concepción')` |
| Monteros | `Monteros` | `showCity('Monteros')` |
| Aguilares | `Aguilares` | `showCity('Aguilares')` |

No contienen descripción, imagen ni contador visible. Existe código para estadísticas (`renderCityStats()`), pero la función retorna inmediatamente y no produce contenido.

Los datos institucionales hardcodeados relacionan:

- Concepción: Universidad Siglo 21, Instituto Santa Bárbara e IES Concepción.
- Monteros: Universidad Siglo 21, Instituto del Sur, Centro de Formación Tucumán e Instituto San Miguel.
- Aguilares: Universidad Siglo 21, Instituto Santa Bárbara, Centro de Formación Tucumán y Academia Profesional Norte.

## Funciones JavaScript involucradas

### Selector general

- `normalizeCityText(value)`
- `filterCities(value)`
- `firstVisibleCity()`
- `openSearchedCity()`
- `handleCitySearchKey(event)`
- `clearCitySearch()`
- `renderCityStats()` — actualmente deshabilitada por un `return` inicial.

### Navegación y estado SPA

- `goHome()`
- `hidePages()`
- `setHeaderMode(homeVisible)`
- `setFooterVisible(visible)`
- `setActiveNav(name)`
- `showCity(city)`

### Dependencias de la ciudad dinámica

- `cityInstitutions()`
- `activeCityInstitutions()`
- `renderFeatured()`
- `renderCards()`
- `applyInstitutionSearch()`
- `showDetail(name)`
- `backToCity()`

## localStorage y sessionStorage

| Clave | Relación con Ciudades |
| --- | --- |
| `guiaEducativaTheme` | Determina claro/oscuro. |
| `guiaEducativaCities` | Carga `adminCities` y su orden administrativo. No regenera las tres tarjetas públicas hardcodeadas de Home. |
| `guiaEducativaInstitutions` | Alimenta las instituciones filtradas por `currentCity` en `#cityPage`. |
| `guiaEducativaLeads` | No interviene en el selector; se usa posteriormente en consultas de carreras. |

La vista pública general no usa `sessionStorage`. `guiaEducativaAdminSession` pertenece exclusivamente al Centro de Control.

Existe una divergencia importante: editar `guiaEducativaCities` en administración no actualiza automáticamente el DOM público de `.cities`. La migración no debe asumir que `adminCities` ya es la fuente efectiva del selector visible.

## Estados interactivos

- Inicial: tres tarjetas visibles y estado vacío oculto.
- Búsqueda parcial: filtra por inclusión de texto.
- Normalización: ignora mayúsculas, minúsculas y diacríticos.
- Sin resultados: oculta todas las tarjetas y muestra `No encontramos esa ciudad.`.
- Limpiar: vacía el input, restaura tarjetas y oculta el estado vacío.
- Buscar/Enter: usa la primera coincidencia visible.
- Hover: fondo degradado y barra verde lateral.
- Foco visible: outline verde interno y barra lateral.
- Click: abre inmediatamente la ciudad dinámica.
- No hay estados de carga, error de red, selección persistente ni paginación.

## Volver y navegación posterior

- `goHome()` restaura Home, limpia el buscador, oculta el footer, activa navegación “Inicio” y vuelve arriba.
- `showCity(city)` oculta Home, muestra `#cityPage`, muestra header general y footer, reinicia filtros y scroll.
- `showDetail(name)` conserva `currentCity` en memoria.
- `backToCity()` vuelve a ejecutar `showCity(currentCity)`.
- Refrescar la página elimina `currentCity` en memoria y vuelve al estado inicial; no existe URL profunda.
- El botón Atrás del navegador no representa la navegación interna porque no se modifica el historial.

## Dependencias con `/ciudades/[ciudad]`

La futura `/ciudades` debe producir slugs estables y compatibles con las rutas dinámicas que se migren después. Deben resolverse explícitamente:

- `Concepción` → slug normalizado, previsiblemente `concepcion`.
- `Monteros` → `monteros`.
- `Aguilares` → `aguilares`.
- Conservación del nombre con tilde para el texto visible.
- Relación entre slug, `currentCity` actual y filtros de instituciones.
- Comportamiento temporal de los botones mientras `/ciudades/[ciudad]` aún no exista.

No deben crearse rutas dinámicas ni páginas vacías en la siguiente etapa sin autorización.

## Futuros componentes React sugeridos

| Componente | Responsabilidad | Tipo sugerido |
| --- | --- | --- |
| `CitiesPage` | Componer la ruta `/ciudades` y sus metadatos. | Server Component |
| `CitiesClient` | Mantener consulta, lista visible, estado vacío y acción de navegación. | Client Component |
| `CitySearch` | Input, búsqueda, limpiar y Enter. | Parte cliente o subcomponente de `CitiesClient` |
| `CityGrid` | Mantener la estructura de bordes y columnas. | Presentacional dentro del cliente |
| `CityCard` | Renderizar botón, pin y nombre sin alterar el DOM sensible. | Presentacional dentro del cliente |
| `LocationIcon` | SVG inline del pin. | Presentacional |

La separación en archivos no debe agregar wrappers que cambien los hijos directos de `.cities`.

## Elementos que deberán ser componentes cliente

Como mínimo, `CitiesClient` debe usar cliente porque requiere:

- estado de búsqueda;
- normalización y filtrado inmediato;
- eventos `onChange`, `onKeyDown` y `onClick`;
- estado vacío;
- navegación programática futura mediante App Router;
- lectura/aplicación del tema persistido si esa responsabilidad no queda centralizada en un layout compartido.

La página de ruta, textos estáticos e iconos no necesitan por sí solos `use client`.

## Riesgos visuales y funcionales

1. No existe una pantalla general independiente en la demo; diseñar una composición nueva violaría la fuente de verdad visual.
2. Duplicar el selector de Home puede provocar divergencia futura entre `/` y `/ciudades`.
3. Extraer ahora el selector de `HomeClient` modificaría la Home ya aprobada y exigiría una nueva comparación visual completa.
4. Los bordes dependen de `.cities` y de botones `.city-card` contiguos con `gap: 0`.
5. Cambiar `<button>` por `<a>` puede introducir estilos, foco y semántica visual diferentes si no se neutralizan exactamente.
6. Los SVG deben convertir atributos HTML a JSX (`strokeWidth`, `className`) sin alterar paths o viewBox.
7. La animación `heroContentFade`, el video y el overlay son parte de la composición de referencia embebida en Home.
8. El tema oscuro contiene un hover claro canónico; no debe reinterpretarse como error durante la migración.
9. `adminCities` y las tarjetas públicas no comparten actualmente fuente de datos.
10. La demo no tiene URLs reales ni historial; adoptar App Router exige definir slugs sin cambiar el comportamiento visible.
11. Las rutas dinámicas aún no existen y no deben simularse con páginas provisionales no autorizadas.
12. Una decisión sobre reutilizar o duplicar temporalmente el selector debe priorizar no tocar la Home aprobada.

## Correspondencia futura con `/ciudades`

Propuesta conservadora para la próxima etapa:

- `/ciudades` mostrará el mismo selector general que la demo presenta en Home, conservando textos, orden, buscador, tarjetas, estados, video, overlay, tipografía y responsive.
- La ruta no añadirá encabezados, descripciones, imágenes de ciudades, contadores ni nuevas secciones.
- Home permanecerá intacta durante esa migración.
- Los botones mantendrán su estado visual; la conexión definitiva a `/ciudades/[ciudad]` se realizará cuando las páginas dinámicas sean autorizadas.
- Antes de implementar debe confirmarse que esta reutilización fiel de la superficie de Home es la interpretación aprobada para la ruta independiente.

## Lista exacta de archivos para la próxima etapa

Si se aprueba migrar únicamente `/ciudades` sin tocar Home ni rutas dinámicas, el alcance propuesto es:

1. Crear `next-app/app/ciudades/page.js`.
2. Crear `next-app/app/ciudades/CitiesClient.js`.
3. Crear `next-app/app/ciudades/ciudades.css` con solo las reglas necesarias y copiadas fielmente de la demo.
4. Crear capturas y documentación únicamente dentro de `docs/comparaciones/ciudades-next/`.

No se prevé modificar en esa etapa:

- `next-app/app/page.js`;
- `next-app/app/components/HomeClient.js`;
- `next-app/app/home.css`;
- archivos Vite;
- `package.json` o lockfiles.

Si se decide extraer un selector compartido para evitar duplicación, ese cambio alteraría la lista anterior y requerirá autorización explícita porque tocaría la Home ya validada.

## Conclusión

La auditoría identifica con precisión la fuente visual y funcional del futuro `/ciudades`, pero también confirma que esa ruta no existe como pantalla independiente en la demo. La próxima etapa debe limitarse a trasladar el selector general de Home sin rediseñarlo y sin crear todavía páginas dinámicas de ciudad.
