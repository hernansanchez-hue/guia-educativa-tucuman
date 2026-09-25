# Migración aislada de Home

## Alcance

Este inventario cubre únicamente la pantalla Home de la demo Vite. La demo permanece como fuente de verdad visual. No se migran ciudades, instituciones, carreras, cursos, Nosotros, Contacto, Login ni Centro de Control; tampoco se crean sus rutas.

## Estructura y orden visual

1. Contenedor global `.app-shell`.
2. Encabezado exclusivo de Home `.home-header`, absoluto y transparente, con la marca centrada.
3. Área principal `main#home.home`, a altura completa de viewport.
4. Video de fondo `.hero-video` y capa oscura `.hero-overlay`.
5. Contenedor centrado `.home-inner`.
6. Título principal.
7. Panel `.city-box` con título, buscador y grilla/lista de ciudades.
8. Botón flotante `.admin-fab` en la esquina inferior derecha.

El encabezado general `.site-header`, su navegación, el menú móvil y el footer están presentes en el documento Vite, pero Home los mantiene ocultos mediante `setHeaderMode(true)` y `setFooterVisible(false)`. Por lo tanto no se renderizan en esta migración aislada. Se preserva el encabezado propio visible de Home y el acceso flotante visible.

## Textos visibles y accesibles

- Marca: `GE`, `Guía Educativa`, `Tucumán`.
- Título: `Toda la oferta educativa de Tucumán en un solo lugar`.
- Panel: `Elegí tu ciudad`.
- Placeholder: `Buscar ciudad`.
- Ciudades: `Concepción`, `Monteros`, `Aguilares`.
- Estado vacío: `No encontramos esa ciudad.`
- Botón de búsqueda: `Buscar ciudad` en `aria-label` y `title`.
- Botón de limpieza: `Limpiar búsqueda` en `aria-label` y `title`.
- Acceso flotante: `Abrir panel de control` en `aria-label` y `title`.

No hay textos visibles adicionales en Home. Los textos del header general, menú y footer pertenecen a otras vistas y no se trasladan en este paso porque permanecen ocultos en la pantalla de referencia.

## Recursos, iconos y fuentes

- Video MP4 remoto de Cloudinary, conservado sin sustitución: `https://res.cloudinary.com/disj9fs8m/video/upload/q_auto/v1782350401/get/hero/v2l8k0maxocxnxf0yerh.mp4`.
- Iconos SVG inline: lupa principal, lupa de acción, cerrar/limpiar, marcador de ubicación y engranaje del panel.
- Fuente principal: Poppins, pesos 100–900, cargada desde Google Fonts; fallback Arial, Helvetica, sans-serif.
- La hoja general también importa Geist, pero Home no la usa en sus reglas efectivas.
- No hay imágenes raster locales ni iconotecas externas en Home.

## Clases y variables CSS efectivas

Clases visibles principales: `app-shell`, `home-header`, `logo`, `logo-mark`, `home`, `hero-video`, `hero-overlay`, `home-inner`, `city-box`, `city-search`, `city-search-divider`, `cities`, `city-card`, `city-card-head`, `city-card-icon`, `city-empty`, `hidden` y `admin-fab`.

Variables utilizadas directa o indirectamente:

- `--azul: #173b7a`
- `--azul-2: #2456a6`
- `--verde: #19a974`
- `--amarillo: #f6c85f`
- `--coral: #ef6f6c`
- `--gris: #f5f7fa`
- `--linea: #dfe7f2`
- `--texto: #172033`
- `--muted: #667085`
- `--blanco: #ffffff`
- `--sombra: 0 16px 36px rgba(15, 23, 42, 0.13)`
- `--radio: 8px`

Aunque no todas se ven en cada selector de Home, se conservará el bloque de variables de la demo para mantener los mismos valores y evitar reinterpretaciones.

## Responsive

- Base/escritorio: Home usa `min-height: 100vh` y `100svh`, padding `102px 7% 56px`, contenido máximo de 980 px y panel máximo de 920 px. Las ciudades forman tres columnas.
- `max-width: 1100px`: se ajustan tipografía y dimensiones de la marca mediante las reglas compartidas de logo.
- `max-width: 720px`: encabezado Home con padding vertical de 18 px; Home pasa a padding lateral 5%, superior 92 px e inferior 20 px; ciudades en una columna; video centrado; botón flotante a 12 px de los bordes.
- `max-width: 414px`: `.home-inner` se limita a 352 px, el panel usa 20 px y las tarjetas bajan a 74 px de alto mínimo.
- `max-width: 360px`: marca a 18 px, distintivo GE de 32 × 32 px, título a 31 px y padding horizontal del buscador ajustado.
- `prefers-reduced-motion: reduce`: la demo contiene reglas para otros módulos, pero no desactiva la animación de entrada de Home. No se agrega una conducta distinta en esta etapa.

## Tema claro y oscuro

La demo lee `localStorage.guiaEducativaTheme` al iniciar. Con valor `dark` agrega `body.dark-theme`; de lo contrario guarda/aplica `light`.

En Home no existe un control visible para alternar tema: el control pertenece al header general oculto. El modo oscuro heredado cambia el fondo global, el panel `.city-box`, títulos, buscador, entradas y placeholders. El video, overlay, tarjetas y botón flotante conservan sus reglas base. La migración leerá la misma clave y aplicará la misma clase al `body`, sin agregar un control visual nuevo.

## Formularios y controles

El buscador visual usa `role="search"`, pero no es una etiqueta `<form>`. Contiene un `input type="search"` sin autocompletado, un botón de abrir el primer resultado visible y un botón de limpieza. Pulsar Enter equivale a la acción de búsqueda. Las tarjetas de ciudad son botones. No hay envío a servidor.

No hay sliders ni modales visibles o funcionales en Home. No se incorporarán los sliders/modales de otras pantallas.

## Comportamiento JavaScript de la demo

- `normalizeCityText`: elimina diacríticos, convierte a minúsculas y recorta espacios.
- `filterCities`: filtra las tres tarjetas por coincidencia parcial y alterna el estado vacío.
- `firstVisibleCity`: devuelve la primera tarjeta no oculta.
- `openSearchedCity`: invoca `showCity` para el primer resultado.
- `handleCitySearchKey`: intercepta Enter y abre el primer resultado.
- `clearCitySearch`: vacía el campo y restaura todas las ciudades.
- `showCity`: cambia a la página de ciudad y dispara sus renderizados; esa pantalla está fuera del alcance actual.
- `showAdmin`: comprueba `sessionStorage.guiaEducativaAdminSession` y abre Login o Centro de Control; ambas pantallas están fuera del alcance actual.
- `setHeaderMode`, `setFooterVisible` y `goHome`: garantizan que Home muestre sólo su header, oculte el footer y restaure la búsqueda.
- `renderCityStats`: actualmente retorna de inmediato; no produce contenido visible.

En Next.js se reproducen filtrado, Enter y limpieza. Las acciones que conducirían a pantallas todavía no migradas se mantienen como botones visibles temporalmente inertes; no se crean destinos falsos ni páginas adicionales.

## Datos y almacenamiento

- Los nombres de las tres ciudades están hardcodeados en el HTML de Home.
- `guiaEducativaTheme` en `localStorage` sí afecta Home.
- `guiaEducativaInstitutions`, `guiaEducativaCities` y `guiaEducativaLeads` se cargan globalmente en Vite, pero no alimentan el contenido visible actual de Home.
- `guiaEducativaAdminSession` en `sessionStorage` sólo se consulta al pulsar el engranaje; el destino queda fuera de alcance.
- No hay cookies, API, Supabase, autenticación real ni variables de entorno para Home.

## Límites de componentes React

- `app/page.js` permanecerá como Server Component de la ruta `/` y compondrá Home.
- `app/components/HomeClient.js` será el único límite cliente porque necesita estado, eventos y `localStorage`.
- El video, encabezado, panel e iconos se renderizan dentro del componente cliente para conservar exactamente la estructura y evitar duplicar la grilla interactiva.
- No se necesita `next/image`: Home no contiene imágenes raster y el video remoto se conserva con `<video>`/`<source>`.
- No se necesita `next/link` todavía porque los destinos no existen y los controles originales son botones.

## Archivos exactos de implementación

Antes de programar se fija este límite:

- Modificar `next-app/app/page.js`: sustituir el shell técnico por la composición de Home.
- Modificar `next-app/app/layout.js`: reemplazar metadatos temporales por los metadatos existentes de GET; mantener `lang="es"`.
- Modificar `next-app/app/globals.css`: conservar sólo reset, variables y base global necesarios, sin copiar la hoja completa de Vite.
- Crear `next-app/app/home.css`: copiar de forma controlada únicamente reglas efectivas de Home, tema y breakpoints necesarios.
- Crear `next-app/app/components/HomeClient.js`: trasladar estructura JSX, SVG, filtrado, limpieza, Enter y lectura del tema.

No se modificará ningún otro archivo de `next-app`, ni ningún archivo de la demo Vite.

## Criterio de validación

Se compararán Vite y Next.js en 1440 × 900 y 390 × 844, claro y oscuro. Se revisarán estructura, posiciones, dimensiones, fuente, video/overlay, responsive, estados del buscador y consola. El video y la animación de entrada generan fotogramas no deterministas; la comparación debe hacerse después de estabilizar la animación y distinguir diferencias de fotograma de diferencias de layout.
