# Auditoría aislada de la página de ciudad: Concepción

Fecha: 4 de agosto de 2026.

Rama: `migracion-ciudad-concepcion`.

Ruta futura aprobada: `/concepcion`, implementada mediante la arquitectura dinámica raíz `/[ciudad]`.

## Alcance

Esta auditoría describe únicamente la pantalla de Concepción de la demo Vite. No implementa la ruta, no conecta los botones de Home o `/ciudades`, no migra instituciones ni carreras y no modifica la fuente de verdad visual.

La arquitectura aprobada reserva `/ciudades` para el índice general. Las páginas de ciudad serán `/concepcion`, `/monteros` y `/aguilares`; no se utilizará `/ciudades/[ciudad]`.

## Ubicación en la SPA actual

| Elemento | Archivo | Ubicación lógica |
| --- | --- | --- |
| Header público | `index.html` | `header#siteHeader.site-header` |
| Pantalla de ciudad | `index.html` | `section#cityPage.page[aria-live="polite"]` |
| Slider o portada | `index.html` | `#cityPage > section.featured-block` |
| Buscador y filtros | `index.html` | `form.institution-search-bar` |
| Título y tarjetas | `index.html` | `.institutions-section` |
| Footer público | `index.html` | `footer#siteFooter.site-footer` |
| Datos y comportamiento | `src/main.js` | estado SPA, filtros, slider y navegación |
| Apariencia | `src/styles.css` | reglas públicas, responsive y tema oscuro |

La pantalla no tiene URL propia. Al elegir Concepción se mantiene el documento raíz y se intercambian clases de visibilidad.

## Método actual para mostrar la vista

Home ejecuta `showCity('Concepción')`. Esa función:

1. asigna `currentCity = "Concepción"`;
2. llama a `hidePages()`, que detiene el autoplay, desactiva todas las páginas SPA, oculta Home y activa el header público;
3. quita el estado activo de la navegación;
4. agrega `.active` a `#cityPage`;
5. muestra el footer;
6. escribe `Instituciones de Concepción` en `#cityTitle`;
7. elimina resultados de búsqueda anteriores y reinicia el formulario;
8. reinicia el índice y la pausa del slider;
9. ejecuta `renderFeatured()` y `renderCards()`;
10. desplaza la ventana al inicio.

No se usan `history.pushState`, hashes ni rutas simuladas. Un refresh vuelve al estado inicial de Home.

## Estructura DOM completa de la pantalla

La jerarquía relevante cuando Concepción está activa es:

```text
div.app-shell
├── header#homeHeader.home-header.hidden
├── header#siteHeader.site-header.visible
│   ├── button.logo
│   │   └── span.logo-mark + textos de marca
│   ├── nav#siteMenu.site-nav
│   │   ├── button[data-nav="inicio"]
│   │   ├── button[data-nav="eventos"]
│   │   ├── button[data-nav="nosotros"]
│   │   ├── button.mobile-course-link
│   │   └── button.mobile-menu-close > svg
│   └── div.site-header-actions
│       ├── button#themeToggle.theme-toggle > 2 svg
│       ├── button.course-cta > svg + texto
│       └── button.mobile-menu-toggle > svg
├── main#home.home.hidden
├── section#cityPage.page.active[aria-live="polite"]
│   ├── section.featured-block[aria-labelledby="featuredTitle"]
│   │   ├── h2#featuredTitle.hidden
│   │   └── div.featured-slider
│   │       ├── div#featuredViewport.featured-viewport
│   │       │   └── div#featuredTrack.featured-track
│   │       │       └── article.featured-slide (generado, uno por destacado)
│   │       │           ├── div.featured-copy
│   │       │           │   ├── div.featured-brand > span.featured-plan
│   │       │           │   ├── h3
│   │       │           │   ├── p
│   │       │           │   └── button.btn
│   │       │           ├── div.featured-media > img
│   │       │           └── div.featured-facts
│   │       │               └── 3 div.featured-fact con SVG y texto
│   │       └── div.featured-controls
│   │           ├── span#featuredCount.featured-count
│   │           ├── button.featured-arrow-button
│   │           └── button.featured-arrow-button
│   ├── form.institution-search-bar
│   │   ├── label.institution-search-field > svg + input#institutionSearchInput
│   │   ├── select#institutionModalityFilter
│   │   ├── select#institutionLevelFilter
│   │   └── button.institution-search-submit
│   └── div.institutions-section
│       ├── div.city-hero > h2#cityTitle
│       ├── div#institutionCards.cards
│       │   └── article.card (generado, uno por institución)
│       │       ├── div.card-media > img + span oculto
│       │       └── div.card-body
│       │           ├── span.badge
│       │           ├── h3
│       │           ├── p
│       │           └── button.card-cta > texto + svg
│       └── div#institutionSearchEmpty.featured-search-empty.hidden
├── button.admin-fab.hidden
└── footer#siteFooter.site-footer
    ├── div.footer-inner > 4 div.footer-column
    ├── div.footer-social-box
    └── div.footer-bottom
```

Los restantes paneles SPA permanecen en el DOM pero sin `.active`. No forman parte visual de esta pantalla.

## Header y navegación

El header visible es `#siteHeader`, no `#homeHeader`. Es una cápsula sticky centrada, con:

- marca `GE Guía Educativa Tucumán` como botón;
- `Inicio`;
- `Eventos`;
- `Nosotros`;
- `Cursos Docentes`;
- control de tema con iconos sol/luna;
- apertura y cierre del menú móvil.

La marca y `Inicio` ejecutan `goHome()`. Eventos, Nosotros y Cursos Docentes cambian a otras secciones SPA. En móvil, la navegación se convierte en menú mediante `openSiteMenu()` y `closeSiteMenu()`.

### Volver

La pantalla de ciudad no contiene un botón propio “Volver”. Las vías canónicas para volver son:

- la marca del header;
- el botón `Inicio` del header;
- la marca del footer;
- el botón `Volver al inicio` del footer.

`backToCity()` existe, pero se utiliza desde la ficha de institución para regresar a la ciudad conservada en `currentCity`; no aparece como control dentro de `#cityPage`.

## Portada, descripción y slider destacado

No existe una portada estática ni una descripción editorial de Concepción. La parte superior de la vista es `.featured-block`, un slider de instituciones. `#featuredTitle` contiene `Instituciones destacadas`, pero está oculto.

Cada slide muestra:

- `★ Institución destacada`;
- nombre de institución;
- descripción de institución;
- botón `Ver institución`;
- imagen remota;
- `Modalidad`;
- `Carreras`;
- `Sedes`;
- contador y flechas anterior/siguiente.

Para Concepción, el orden producido por los datos predeterminados es:

1. Universidad Siglo 21 — `Presencial y Online`, `4 opciones`, `3 ciudades`.
2. Instituto Santa Bárbara — `Presencial y Online`, `3 opciones`, `2 ciudades`.
3. Instituto del Sur — `Presencial`, `3 opciones`, `1 ciudades`.

El tercer destacado no pertenece a Concepción. Es el resultado literal del fallback de `renderFeatured()`: primero instituciones Premium locales, luego Premium externas y finalmente instituciones privadas o terciarias, hasta completar tres. Este comportamiento es canónico y no debe corregirse silenciosamente durante la migración.

El slider cambia cada 5.200 ms, se pausa con hover, se reanuda al salir, responde a flechas y admite swipe horizontal superior a 45 px. El slide activo recibe `.active` y `aria-hidden="false"`.

## Textos existentes

### Header y contenido principal

- `GE`
- `Guía Educativa`
- `Tucumán`
- `Inicio`
- `Eventos`
- `Nosotros`
- `Cursos Docentes`
- `Instituciones destacadas` — oculto visualmente.
- `★ Institución destacada`
- `Ver institución`
- `Modalidad`
- `Carreras`
- `Sedes`
- `Buscar institución o carrera...`
- `Modalidad`
- `Presencial`
- `Online`
- `Presencial y Online`
- `Nivel`
- `Universidad`
- `Terciario`
- `Cursos y capacitaciones`
- `Buscar`
- `Instituciones de Concepción`
- `No encontramos instituciones con esos filtros.`

### Instituciones listadas para Concepción

| Tipo | Institución | Descripción | Etiqueta de medio |
| --- | --- | --- | --- |
| `Privada` | `Universidad Siglo 21` | `Educación innovadora, profesional y conectada con el mundo.` | `Video institucional` |
| `Terciario Privado` | `Instituto Santa Bárbara` | `Formación terciaria con valores, prácticas y salida laboral.` | `Video institucional` |
| `Público` | `IES Concepción` | `Educación pública, gratuita y de calidad para todos.` | `Imagen superior` |

La etiqueta de medio existe en el DOM de cada tarjeta, pero `.card-media span` tiene `display: none`. Todas las tarjetas incluyen `Ver institución`.

### Footer visible

El footer conserva los textos `Guía Educativa Tucumán`, `Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.`, `Explorar`, `Preguntas frecuentes`, `Cursos docentes`, `Lo Próximo`, `Quiénes somos`, `Contacto`, `Dall Asta 2469, Concepción, Tucumán`, `3865 751273`, `Descargá la app`, textos de Google Play y App Store, `Seguinos en redes`, nombres de redes, copyright y `Volver al inicio`.

## Instituciones, tarjetas, botones y enlaces

`cityInstitutions()` filtra por inclusión exacta de `currentCity` en `inst.city`. Con los datos originales devuelve, en este orden:

1. Universidad Siglo 21.
2. Instituto Santa Bárbara.
3. IES Concepción.

Cada tarjeta es un `article.card` interactivo con `tabIndex="0"`, `role="link"` y nombre accesible. Click, Enter o Espacio llaman a `showDetail(inst.name)`. El botón interno detiene la propagación y llama a la misma función.

Otros controles y enlaces:

- flechas del slider: `changeFeatured(-1 | 1)`;
- botón destacado: `showDetail(inst.name)`;
- formulario: `applyInstitutionSearch()`;
- control de tema: `toggleTheme()`;
- enlaces externos del footer: Google Maps y WhatsApp;
- botones de app/redes aún no disponibles: `footerComingSoon()`.

## Imágenes e iconos

- Las instituciones usan imágenes remotas de Unsplash definidas en `imageBank`.
- `cloudinaryImage()` transforma las URL para el tamaño solicitado cuando corresponde.
- Universidad Siglo 21 usa `imageBank.siglo`.
- Instituto Santa Bárbara usa `imageBank.santa`.
- IES Concepción usa `imageBank.ies`.
- Instituto del Sur, presente en el fallback destacado, usa `imageBank.students`.
- Header, buscador, controles, hechos del slider, CTA de tarjetas, menú y footer emplean SVG inline.
- La marca es tipográfica: `GE` dentro de `.logo-mark`; no existe archivo de logo raster.

La migración debe conservar URL, `alt`, `viewBox`, paths y atributos gráficos. La conversión a JSX solo cambia nombres sintácticos como `class` a `className` y `stroke-width` a `strokeWidth`.

## Clases CSS utilizadas

### Estructura pública

`app-shell`, `site-header`, `visible`, `logo`, `logo-mark`, `site-nav`, `active`, `mobile-course-link`, `mobile-menu-close`, `site-header-actions`, `theme-toggle`, `theme-icon-sun`, `theme-icon-moon`, `course-cta`, `mobile-menu-toggle`, `page`, `active`, `hidden`, `site-footer`.

### Destacados

`featured-block`, `featured-slider`, `featured-viewport`, `featured-track`, `featured-slide`, `featured-copy`, `featured-brand`, `featured-plan`, `featured-media`, `featured-facts`, `featured-fact`, `featured-fact-icon`, `featured-controls`, `featured-count`, `featured-arrow-button`, `btn`.

### Filtros e instituciones

`institution-search-bar`, `institution-search-field`, `institution-search-submit`, `institutions-section`, `city-hero`, `cards`, `card`, `card-media`, `card-body`, `badge`, `card-cta`, `featured-search-empty`.

### Footer

`footer-inner`, `footer-column`, `footer-logo`, `footer-brand-copy`, `footer-heading`, `footer-link-list`, `footer-contact-list`, `footer-contact-link`, `footer-app-buttons`, `footer-app-button`, `footer-social-box`, `footer-social-links`, `footer-social-link`, `footer-bottom`.

## Variables y valores visuales sensibles

| Variable | Valor claro | Uso relevante |
| --- | --- | --- |
| `--azul` | `#173b7a` | Marca, headings y CTA |
| `--azul-2` | `#2456a6` | Paleta secundaria |
| `--verde` | `#19a974` | Acción primaria, iconos y acentos |
| `--amarillo` | `#f6c85f` | Paleta global |
| `--coral` | `#ef6f6c` | Paleta global |
| `--gris` | `#f5f7fa` | Fondo global |
| `--linea` | `#dfe7f2` | Bordes |
| `--texto` | `#172033` | Texto principal |
| `--muted` | `#667085` | Texto secundario |
| `--blanco` | `#ffffff` | Superficies |
| `--sombra` | `0 16px 36px rgba(15, 23, 42, 0.13)` | Sombra global |
| `--radio` | `8px` | Radios principales |

La tipografía computada pública es Poppins, con fallback Arial, Helvetica y sans-serif. Poppins y Geist se importan desde Google Fonts; Geist no es la familia computada de esta pantalla.

Valores estructurales especialmente sensibles:

- `.page`: padding `28px 6% 48px`.
- `.featured-block` y buscador: ancho `min(1240px, 100%)`.
- slide de escritorio: tres columnas y altura mínima de 250 px.
- `.institution-search-bar`: cuatro columnas, gap 10 px, padding 13 px.
- `.cards`: ancho `min(1080px, 100%)`, tres columnas y gap 24 px.
- `.card`: altura mínima 390 px, padding 14 px, radio 8 px.
- `.card-media`: 200 px de alto y `object-fit: cover`.
- `.institutions-section`: margen `38px -6% -48px` y padding `42px 6% 56px`.
- header público final: ancho `min(1120px, calc(100% - 32px))`, borde tipo cápsula y posición sticky.

La hoja contiene reglas anteriores y overrides posteriores para varios selectores. La migración debe respetar la cascada efectiva, no copiar solo la primera aparición.

## Responsive

### Más de 980 px

- slider destacado en tres columnas: copy, imagen y hechos;
- formulario en cuatro columnas;
- tarjetas en tres columnas;
- header completo en cápsula con navegación y CTA visibles.

### Hasta 980 px

- formulario en dos columnas; campo de texto y botón ocupan ambas;
- slider pasa a dos columnas y los hechos ocupan una fila completa de tres columnas;
- controles del slider suben a `bottom: 86px`;
- tarjetas pasan a dos columnas.

### Hasta 720 px

- `.page` usa 5 % de padding lateral; un override final fija 24 px arriba y 40 px abajo;
- header sticky compacto, dos columnas, menú desplegable y CTA móvil;
- slider pasa a una columna: imagen arriba, copy debajo y hechos en tres columnas;
- imagen destacada mide 210–220 px según la cascada final;
- copy tiene espacio inferior para los controles;
- filtros permanecen en dos columnas para los selects, con input y botón a ancho completo;
- inputs, selects y botón tienen altura mínima de 46 px y tamaño táctil;
- tarjetas pasan a una columna, altura mínima 370 px e imagen de 190 px;
- `institutions-section` compensa el padding de página con márgenes negativos del 5 %.

### Hasta 414 px y 360 px

Los overrides finales compactan logo, navegación, títulos, botones, slider y espaciados. Deben verificarse en 390 × 844 y, como prueba de borde, en 360 px; no se debe inferir el diseño móvil solo desde el breakpoint de 720 px.

## Modo claro y oscuro

`applyTheme()` agrega o quita `body.dark-theme` y persiste `localStorage.guiaEducativaTheme` con `dark` o `light`. Al iniciar, la demo lee esa clave. El control actual del header sigue siendo la única interfaz visible para alternar tema.

En oscuro se redefinen:

- `--gris: #0b1423`;
- `--linea: #2c3a4f`;
- `--texto: #e8eef8`;
- `--muted: #a5b3c7`;
- `--blanco: #111c2e`;
- fondo del body: `#08111f`.

Además cambian header, navegación, icono del tema, página, instituciones, slider, tarjetas, formulario, headings, párrafos, inputs, selects y footer. Las superficies principales usan `#111c2e`; los campos usan `#0c1728` y borde `#34445b`. No deben “normalizarse” colores literales aunque parezcan inconsistentes.

## JavaScript involucrado

### Estado, navegación y tema

- `currentCity`
- `pages`
- `setHeaderMode()`
- `setFooterVisible()`
- `setActiveNav()`
- `hidePages()`
- `showCity()`
- `goHome()`
- `openSiteMenu()` / `closeSiteMenu()`
- `applyTheme()` / `toggleTheme()`

### Datos, filtros y tarjetas

- `readStoredData()`
- `normalizeInstitution()` / `normalizeCareer()`
- `cityInstitutions()`
- `institutionModality()`
- `institutionLevel()`
- `activeCityInstitutions()`
- `applyInstitutionSearch()`
- `renderCards()`

### Slider y navegación posterior

- `renderFeatured()`
- `setFeatured()`
- `changeFeatured()`
- `updateFeatured()`
- `startFeaturedAutoplay()` / `stopFeaturedAutoplay()`
- `showDetail()`
- `backToCity()`
- `cloudinaryImage()`

## Búsqueda y estados interactivos

El formulario filtra únicamente las tarjetas de la ciudad activa. La consulta se normaliza sin diacríticos, en minúsculas y con espacios extremos eliminados. Busca sobre nombre, descripción y nombres de carreras.

Los filtros son:

- modalidad: presencial, online o mixta;
- nivel: universidad, terciario o cursos/capacitaciones.

Si no hay resultados, se muestra `No encontramos instituciones con esos filtros.`. Tras buscar, la grilla se desplaza suavemente al inicio. El slider destacado no se vuelve a filtrar y conserva sus tres elementos.

Estados adicionales:

- autoplay activo o pausado por hover;
- slide activo/inactivo con `aria-hidden`;
- swipe táctil;
- hover y foco de tarjetas con elevación y zoom de imagen;
- activación de tarjeta mediante click, Enter o Espacio;
- tema claro/oscuro;
- menú móvil abierto/cerrado.

## Datos hardcodeados y persistencia

`defaultInstitutions` contiene los registros originales. Concepción se relaciona con Universidad Siglo 21, Instituto Santa Bárbara e IES Concepción. Cada objeto aporta nombre, sigla, tipo, ciudades, plan, slogan, descripción, domicilio, WhatsApp, imagen, etiqueta de medio y carreras.

| Almacenamiento | Uso en esta pantalla |
| --- | --- |
| `localStorage.guiaEducativaInstitutions` | Puede reemplazar el arreglo predeterminado y, por tanto, instituciones, orden, slider, textos e imágenes. |
| `localStorage.guiaEducativaTheme` | Persiste claro u oscuro. |
| `localStorage.guiaEducativaCities` | Alimenta `adminCities`, pero no determina directamente el título ni el filtro público de esta vista. |
| `localStorage.guiaEducativaLeads` | No altera la página de ciudad; interviene después en consultas. |
| `sessionStorage.guiaEducativaAdminSession` | Pertenece al Centro de Control y no interviene en esta vista pública. |

La pantalla depende de estado global mutable: `institutions`, `currentCity`, `featuredIndex`, `featuredSource`, `featuredTimer`, `featuredPaused` e `institutionSearchResults`. No puede trasladarse como HTML estático sin reproducir esas relaciones.

## Comportamiento al elegir una institución

`showDetail(name)` busca la institución por nombre, la guarda en `currentInstitution`, oculta todas las páginas, activa `#detailPage`, mantiene header y footer públicos, completa portada, tipo, ciudad, slogan, galería y carreras, y vuelve arriba.

La ficha usa `currentCity` para mostrar el contexto y `backToCity()` para reconstruir la pantalla anterior. Como la SPA no tiene URL profunda, ese contexto se pierde al recargar. La migración futura de `/concepcion` debe preservar la transición visual sin implementar todavía la ficha institucional en esta etapa.

## Relación futura con `/concepcion`

- `app/[ciudad]/page.js` resolverá el segmento `concepcion` contra la lista canónica.
- El texto visible seguirá usando `Concepción`, con tilde.
- `/ciudades` seguirá siendo el índice y no será padre de la ruta.
- La ruta dinámica deberá rechazar o resolver únicamente slugs autorizados, sin crear contenido placeholder.
- Una ruta estática como `/ciudades` tiene prioridad sobre `[ciudad]` en App Router y debe conservarse.
- Los botones de Home y `/ciudades` no se conectarán hasta una autorización posterior.

## Componentes React sugeridos

| Componente | Responsabilidad | Tipo sugerido |
| --- | --- | --- |
| `[ciudad]/page.js` | Resolver slug y componer la ruta. | Server Component |
| `CityPageClient` | Estado de slider, filtros, tema y navegación interactiva. | Client Component |
| `PublicHeader` | Replicar header público y menú responsive. | Client por menú y tema |
| `FeaturedInstitutionSlider` | DOM, autoplay, flechas, hover y swipe. | Client Component |
| `InstitutionFilters` | Consulta, selects, submit y estado vacío. | Client Component |
| `InstitutionGrid` | Grilla sin wrappers que alteren CSS. | Presentacional |
| `InstitutionCard` | Tarjeta accesible y activación por teclado. | Cliente o hijo del cliente |
| `PublicFooter` | Footer y sus acciones. | Cliente por botones SPA/alertas |
| Iconos inline | Mantener exactamente paths y viewBox. | Presentacional |

La composición en componentes no autoriza cambios de DOM. Conviene que `CityPageClient` conserve el orden y las clases exactas, incluso si los subcomponentes se mantienen en el mismo archivo durante la primera equivalencia visual.

## Recursos compartibles con Home y `/ciudades`

- lista canónica y mapeo slug/nombre: Concepción, Monteros, Aguilares;
- normalización de texto sin tildes;
- marca tipográfica y SVG del header;
- estado de tema basado en `localStorage.guiaEducativaTheme`;
- variables CSS, Poppins y reglas globales de foco;
- header y footer públicos cuando se extraigan sin alterar Home;
- iconos inline de búsqueda, ubicación, tema y navegación;
- utilidades de imágenes remotas.

`CitySelector` ya es compartido por Home y `/ciudades`, pero la página de Concepción no debe incluirlo. Extraer ahora header, tema o estilos desde Home modificaría una pantalla ya validada y exigiría regresión visual explícita.

## Riesgos visuales

1. Copiar solo reglas tempranas de `styles.css` omitiría overrides posteriores de slider, header, oscuro y móvil.
2. Agregar wrappers React puede romper grid, orden, selectores descendientes y posición absoluta de controles.
3. Cambiar `article[role="link"]` por `Link` alteraría foco, teclado y estilos de navegador.
4. El slider combina tres layouts distintos en 1440, hasta 980 y hasta 720 px.
5. El autoplay puede producir falsos positivos en capturas si Vite y Next muestran índices distintos.
6. Imágenes remotas pueden cargar o recortarse en momentos distintos; `object-fit` y `object-position` deben coincidir.
7. Poppins remota puede provocar diferencias de rasterizado o captura antes de cargar la fuente.
8. El header sticky y los márgenes negativos de `.institutions-section` son sensibles a cambios de contenedor.
9. El footer completo aumenta la altura total; omitirlo o simplificarlo invalidaría la comparación.
10. El tema oscuro depende de una clase en `body`; aplicarla en un wrapper cambia la especificidad.
11. La página no tiene un botón volver propio. Inventarlo sería un cambio visual.
12. El texto `1 ciudades` del fallback es resultado actual de la plantilla y no debe corregirse sin autorización.

## Riesgos derivados de datos dinámicos

1. `guiaEducativaInstitutions` puede reemplazar el orden y contenido hardcodeado.
2. Los destacados no se limitan estrictamente a la ciudad; el fallback incluye instituciones externas.
3. Los ids de carreras legacy incorporan un sufijo aleatorio durante la normalización.
4. La modalidad se infiere desde plan, descripción y slogan, no desde un campo normalizado.
5. El nivel se infiere desde tipo y nombre.
6. Una edición del Centro de Control puede cambiar textos, imágenes, planes, ciudades y cantidad de tarjetas.
7. URLs de Unsplash y transformaciones externas pueden fallar o devolver variantes.
8. El nombre es la clave usada por `showDetail()`; duplicados podrían seleccionar una institución incorrecta.
9. El estado global de búsqueda no forma parte de la URL y se reinicia al volver a ejecutar `showCity()`.

Para la primera migración visual debe fijarse explícitamente el dataset canónico de la demo y dejar la futura capa de datos para una etapa posterior.

## Lista exacta de archivos prevista para la migración

La próxima etapa, si se autoriza únicamente `/concepcion`, debería limitarse a:

1. Crear `next-app/app/[ciudad]/page.js`.
2. Crear `next-app/app/[ciudad]/CityPageClient.js`.
3. Crear `next-app/app/[ciudad]/ciudad.css` con las reglas efectivas estrictamente necesarias.
4. Crear `next-app/app/data/institutions.js` con una copia canónica temporal de los datos requeridos, sin Supabase.
5. Crear `next-app/app/components/PublicHeader.js`.
6. Crear `next-app/app/components/PublicFooter.js`.
7. Crear `docs/comparaciones/ciudad-concepcion-next/README.md` y las capturas/comparaciones de validación de esa pantalla.

No se prevé modificar en esa etapa inicial:

- `next-app/app/page.js`;
- `next-app/app/components/HomeClient.js`;
- `next-app/app/components/CitySelector.js`;
- `next-app/app/ciudades/page.js`;
- `next-app/app/home.css`;
- `next-app/app/globals.css`;
- archivos de Vite;
- `package.json` ni lockfiles.

Si para compartir header, footer o tema fuera imprescindible modificar un archivo ya validado, el cambio deberá informarse y autorizarse antes; además requerirá regresión de Home y `/ciudades`.

## Método de comparación visual Vite–Next.js

1. Ejecutar Vite y Next.js simultáneamente en puertos distintos, sin modificar la demo.
2. Abrir Concepción en Vite mediante Home → Concepción y en Next mediante `/concepcion`.
3. Usar viewports idénticos: 1440 × 900 y 390 × 844.
4. Capturar claro y oscuro con el mecanismo normal `localStorage.guiaEducativaTheme`.
5. Esperar carga completa de Poppins e imágenes; comprobar consola y HTTP antes de capturar.
6. Fijar el mismo índice del slider mediante sus controles y capturar antes del siguiente intervalo, sin agregar parámetros temporales versionados.
7. Repetir para estados: inicial, cada slide, búsqueda, cada filtro, combinación sin resultados, hover/foco, menú móvil y scroll con footer.
8. Verificar que cada par tenga dimensiones idénticas y conservar PNG originales sin reescalar.
9. Generar lado a lado, superposición semitransparente y diferencia de píxeles por escenario.
10. Medir con DOM y estilos computados: header, slider, formulario, título, grilla, tarjetas, imágenes, controles, márgenes, tipografía, tamaño, peso y altura de línea.
11. Separar diferencias de rasterizado/fuentes y carga de imágenes de diferencias estructurales o CSS comprobables.
12. Ejecutar regresión de Home y `/ciudades` si se comparte o modifica cualquier recurso usado por esas pantallas.

Las capturas históricas canónicas ya disponibles son:

- `docs/baseline-visual/pagina-ciudad-concepcion-desktop-claro.png`;
- `docs/baseline-visual/pagina-ciudad-concepcion-desktop-oscuro.png`;
- `docs/baseline-visual/pagina-ciudad-concepcion-mobile-claro.png`;
- `docs/baseline-visual/pagina-ciudad-concepcion-mobile-oscuro.png`.

## Conclusión

La futura `/concepcion` debe reproducir una vista SPA dinámica compuesta por header público, slider destacado, filtros, tres tarjetas institucionales y footer. No existe descripción propia de ciudad ni botón volver dedicado. La mayor precaución funcional es conservar el fallback del slider y la dependencia del dataset; la mayor precaución visual es trasladar la cascada efectiva completa sin alterar DOM, breakpoints, tema o estados interactivos.
