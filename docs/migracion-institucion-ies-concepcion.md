# Auditoría aislada — IES Concepción

## Alcance y fuente de verdad

Esta auditoría cubre exclusivamente la ficha institucional que la SPA Vite abre desde la ciudad `Concepción` al seleccionar `IES Concepción`. La futura ruta prevista es `/concepcion/ies-concepcion`, dentro de la arquitectura dinámica `app/[ciudad]/[institucion]`.

No se implementa ni habilita esa ruta en esta etapa. La demo Vite es la única fuente de verdad para los datos, textos, orden, estados y apariencia documentados aquí.

## 1. Ubicación actual

### Vista, IDs y selectores

- La estructura fija está en `index.html`, sección `<section id="detailPage" class="page" aria-live="polite">`.
- Sus puntos de montaje son `#detailCover`, `#detailLogo`, `#detailType`, `#instName`, `#instSlogan`, `#institutionGallery` y `#careerGrid`.
- La tarjeta de ciudad se crea en `#institutionCards` como `.card`, con `role="link"`, `tabindex="0"` y `aria-label="Ver institución IES Concepción"`.
- La ficha visible usa `.detail-hero`, `.detail-cover`, `.brand-row`, `.mini-logo`, `.eyebrow`, `.panel`, `.creation-gallery`, `.creation-marquee`, `.creation-card`, `.career-grid` y `.career-summary-card`.

### Navegación y estado global de la SPA

1. `showCity("Concepción")` asigna `currentCity`, muestra `#cityPage` y renderiza las tarjetas de instituciones de la ciudad.
2. La tarjeta IES llama a `showDetail("IES Concepción")` tanto por clic como por teclado `Enter` o `Espacio`.
3. `showDetail` busca la institución, asigna `currentInstitution`, oculta las demás secciones, activa `#detailPage`, actualiza portada/textos y llama a `renderInstitutionGallery` y `renderCareers`.
4. `backToCity()` invoca `showCity(currentCity)`; desde IES vuelve a `Instituciones de Concepción`.

Variables involucradas: `currentCity`, `currentInstitution`, `currentCareer`, `institutions` e `institutionSearchResults`. La navegación no tiene URL propia: es estado de una SPA.

Funciones directas: `showCity`, `cityInstitutions`, `activeCityInstitutions`, `showDetail`, `renderInstitutionGallery`, `renderCareers`, `careerCardBadge`, `showCareer`, `consultCareer`, `backToCity`, `applyTheme` y `toggleTheme`.

## 2. Estructura visual canónica

La ficha IES contiene exactamente:

- Header público visible, navegación y control de tema.
- Botón `Volver a instituciones`.
- Portada con overlay azul, rótulo, nombre y slogan.
- Logo textual `IES` presente en `#detailLogo`, pero oculto mediante `display: none`; no ocupa espacio visual.
- Panel `Galería de fotos` con marquee horizontal continuo.
- Panel `Carreras` con tres tarjetas.
- Footer público global.
- Botón flotante administrativo en el DOM con `.admin-fab.hidden`.

No hay dentro de `#detailPage` formulario, modal, mapa, iframe, video, enlaces institucionales, ficha de contacto, dirección, WhatsApp ni botón de leads. La dirección y WhatsApp globales del footer pertenecen a GET y no se deben atribuir a IES Concepción.

## 3. Contenido canónico

### Datos institucionales visibles

| Campo | Valor canónico |
|---|---|
| Nombre | `IES Concepción` |
| Logo DOM oculto | `IES` |
| Tipo/rótulo | `Público | Concepción` |
| Slogan | `Educación pública, gratuita y de calidad para todos.` |
| Descripción de tarjeta | `Educación pública, gratuita y de calidad para todos.` |
| Portada | `https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=1200&q=80` |
| Etiqueta de media en la tarjeta de ciudad | `Imagen superior` |
| Dirección almacenada, no visible en la ficha | `España 320, Concepción` |
| WhatsApp almacenado, no visible en la ficha | `3865 50 3300` |

### Marquee

IES no declara una galería propia en `defaultInstitutions`. `normalizeInstitution` aplica el fallback canónico, en este orden:

1. Portada IES: `photo-1568792923760-d70635a89fdc`.
2. Estudiantes: `photo-1517486808906-6ca8b3f04846`.
3. Aula: `photo-1509062522246-3755977927d7`.
4. Graduación: `photo-1523580846011-d3a5bc25702b`.

`renderInstitutionGallery` duplica esos cuatro elementos y muestra ocho `.creation-card`, con alt `Foto 1 de IES Concepción` a `Foto 8 de IES Concepción`. El orden se repite una vez. El estilo inline da `10000ms`; el valor computado es `creationMarquee`, lineal, infinito, `10s` en escritorio.

### Carreras

Las carreras de la demo son arreglos legacy, normalizados en tiempo de ejecución. Orden, textos, imagen, badge y metadatos visibles:

| Orden | Carrera | Descripción canónica | Imagen | Badge | Duración | Modalidad |
|---:|---|---|---|---|---|---|
| 1 | `Profesorado de Educación Primaria` | `Formación docente para nivel primario.` | Aula (`photo-1509062522246-3755977927d7`) | `Inscripciones abiertas` | `3 años` | `Presencial` |
| 2 | `Tecnicatura en Administración` | `Gestión administrativa para organizaciones públicas y privadas.` | Estudiantes (`photo-1517486808906-6ca8b3f04846`) | `Nueva carrera` | `3 años` | `Presencial` |
| 3 | `Profesorado de Inglés` | `Formación pedagógica y práctica del idioma.` | Feria (`photo-1519389950473-47ba0277781c`) | `Próximo ingreso` | `3 años` | `Presencial` |

Cada tarjeta muestra además `IES Concepción · Concepción`, `Concepción`, `Público`, el texto `Propuesta académica con ficha completa disponible.` y los botones `Ver carrera` / `Consultar`.

### Fallbacks, campos vacíos e inconsistencias

- La normalización legacy asigna IDs aleatorios en la demo: slug derivado del nombre más un sufijo aleatorio. La futura migración debe usar IDs y slugs estables, sin inventar contenido ni heredar aleatoriedad.
- La normalización completa añade duración `3 años`, modalidad `Presencial`, sede `España 320, Concepción`, turnos `Consultar`, título igual al nombre, validez `Sí`, descripciones de perfil/campo de trabajo, plan de tres años, requisitos, FAQ, WhatsApp y `formEnabled: true`. Esos campos sirven a la página contextual de carrera de la SPA, no están visibles en la ficha institucional actual.
- IES no tiene `gallery` explícita: el orden documentado es un fallback funcional y por eso debe declararse explícitamente en la futura capa de datos antes de usar la plantilla Next.js.
- No se encontraron campos visibles vacíos en la ficha. No se debe corregir, ampliar ni exponer los datos almacenados de dirección/WhatsApp.

## 4. Elementos presentes y ausentes

| Elemento | Estado en la ficha canónica |
|---|---|
| Dirección institucional | Almacenada; no visible |
| WhatsApp institucional | Almacenado; no visible |
| Teléfono, email, web | Ausentes |
| Mapa | Ausente |
| Instagram, Facebook, TikTok institucionales | Ausentes |
| Horarios | Ausentes |
| Video | Ausente; la tarjeta usa `Imagen superior` |
| Contacto/formulario | Ausentes de la ficha |
| Carreras | Presentes, tres |
| Galería | Presente, cuatro fuentes repetidas para ocho nodos |
| Header, regreso, portada y footer | Presentes |
| Logo textual | Presente en DOM y oculto |
| Botón flotante | Presente y oculto |
| Modales | Ausentes |

## 5. Comportamiento

- El marquee se desplaza realmente; durante la revisión cambió su transformación entre dos lecturas separadas por 250 ms.
- Hover sobre `.creation-gallery` pausa el marquee; hover o foco dentro de `.creation-card` aplica escala `0.9` y muestra el overlay. `prefers-reduced-motion` lo pausa.
- Hover sobre una carrera aplica `translateY(-5px)`, borde verde y sombra mayor. Los controles conservan focus del navegador y estilos globales.
- En Vite, `Ver carrera` abre `#careerPage` de la SPA; `Consultar` abre WhatsApp en una pestaña nueva usando el número institucional. Estas acciones no deben habilitarse todavía en Next.js porque no se migran carreras ni contacto.
- Claro/oscuro se controlan por el botón visible y la clase `body.dark-theme`.
- `localStorage.guiaEducativaTheme` conserva el tema. `localStorage.guiaEducativaInstitutions` puede reemplazar toda la fuente de instituciones desde el Centro de Control de la demo; `localStorage.guiaEducativaLeads` no afecta la ficha hasta una carrera/formulario. `sessionStorage.guiaEducativaAdminSession` afecta solo el acceso administrativo.
- La ficha no usa `sessionStorage` de forma directa ni genera alertas. Alertas globales del footer o del Centro de Control no pertenecen a IES.

## 6. CSS y responsive

### Variables y reglas reutilizables

- Tipografía: `Poppins`, con fallback `Arial, Helvetica, sans-serif`.
- Variables principales: `--azul #173b7a`, `--verde #19a974`, `--coral #ef6f6c`, `--linea #dfe7f2`, `--blanco #ffffff`, `--sombra 0 16px 36px rgba(15,23,42,.13)` y `--radio 8px`.
- Portada: mínimo `310px`, padding `34px`, overlay `rgba(10,29,63,.82)` a `.28`, título `clamp(36px, 5vw, 60px)` y slogan `20px`.
- Panel: padding `22px`, borde `#e8eef6`, radio `8px`; título de sección centrado `30px`.
- Galería: ancho máximo `1152px`; fades laterales de `90px`; tarjetas `224 × 320px`, margen horizontal `16px`, radio `7px`.
- Grilla de carreras: `repeat(auto-fit, minmax(260px, 1fr))`, gap `16px`; tarjeta de ancho máximo `360px`, radio `8px`; imagen 16:9; badge coral de `9px`; cuerpo `17px`; metadata en dos columnas; acciones en dos columnas.

### Temas y breakpoints

- Oscuro: tarjetas `#111c2e`, bordes `#2c3a4f`, fades de galería `#0b1423`.
- A `max-width: 720px`: header móvil, portada con padding `24px`, título `36px`, fades `36px`, tarjetas de galería `176 × 250px` con margen `8px`, marquee `12s`, gap de carreras `13px` y cuerpo de tarjetas `15px`.
- A `max-width: 414px`: las acciones de carrera pasan a una columna.
- A `max-width: 360px`: título de portada `30px`.

La regla contextual de footer `.institution-santa-barbara` no se debe aplicar a IES; fue una corrección específica de Santa Bárbara. No hay variante visual IES comprobada que requiera CSS adicional.

## 7. Datos disponibles en Next.js

`next-app/app/data/institutions.js` ya contiene para IES: `id`, `slug`, nombre, logo, tipo, ciudad, plan, slogan, descripción, dirección, WhatsApp, imagen y media. La ciudad `concepcion` ya lo incluye en `institutionIds`.

Faltan para reproducir la ficha:

- `gallery` explícita con las cuatro imágenes fallback en el orden canónico.
- Tres resúmenes estructurados de carrera: ID estable, slug estable, nombre, descripción, imagen, badge, duración y modalidad.
- La entrada conjunta `concepcion/ies-concepcion` en `institutionPages`.
- La combinación correspondiente en `generateStaticParams`.

Los datos institucionales son nombre, tipo, ciudad contextual, slogan, portada, media, logo oculto, dirección y WhatsApp almacenados. Los resúmenes de carrera son los siete campos visibles de cada tarjeta. Los datos de carrera maestra y oferta institucional futura (sede, turnos, título, validez, requisitos, FAQ, formulario, contacto y disponibilidad) no deben duplicarse ni migrarse ahora.

Sin `gallery`, la plantilla actual intenta expandir `institution.gallery` y no puede representar IES. Sin carreras estructuradas, la plantilla no dispone de imagen, badge, duración ni modalidad. Son faltantes de datos, no justificación para duplicar una página o alterar CSS.

## 8. Reutilización de la plantilla

La combinación actual de `app/[ciudad]/[institucion]/page.js`, `InstitutionPageClient.js`, `institucion.css`, `PublicHeader.js` y `PublicFooter.js` puede representar fielmente IES Concepción únicamente con datos canónicos completos y la habilitación explícita de su par de parámetros.

No se observa incompatibilidad visual que justifique una página duplicada. `InstitutionPageClient.js`, `institucion.css`, `PublicHeader.js` y `PublicFooter.js` deben conservarse sin cambios, salvo que una comparación futura demuestre una diferencia CSS o DOM concreta.

## 9. Archivos previstos para la futura migración

Modificaciones previstas y necesarias:

1. `next-app/app/data/institutions.js`: completar los datos canónicos de IES y habilitar su mapa de ruta conjunta.
2. `next-app/app/[ciudad]/[institucion]/page.js`: agregar únicamente `concepcion/ies-concepcion` a `generateStaticParams`.
3. `next-app/app/[ciudad]/CityPageClient.js`: permitir la navegación de la tarjeta IES sin cambiar su estructura, orden o clases.
4. `docs/comparaciones/institucion-ies-concepcion-next/README.md` y `analisis.md`, junto con cuatro fuentes Vite, cuatro fuentes Next.js y doce comparaciones PNG.

Archivos que deben conservarse en principio:

- `InstitutionPageClient.js`.
- `institucion.css`.
- `PublicHeader.js`.
- `PublicFooter.js`.

Solo una diferencia visual comprobada autorizaría modificar cualquiera de esos cuatro archivos. No se deben tocar Home, `/ciudades`, `/concepcion`, la ficha Siglo 21, Santa Bárbara, Vite, paquetes ni lockfiles.

## 10. Método de comparación visual futura

Se deben generar pares equivalentes Vite–Next.js en:

- Escritorio claro: 1440 × 900.
- Escritorio oscuro: 1440 × 900.
- Móvil claro: 390 × 843.
- Móvil oscuro: 390 × 843.

Para cada escenario se crearán fuente Vite, fuente Next.js, lado a lado sin reescalado, superposición al 50 % y diferencia absoluta. Se validarán firma PNG, lectura, dimensiones, bytes y SHA-256.

Zonas dinámicas aceptables: el fotograma horizontal del marquee, variaciones menores de rasterizado de Poppins y compresión de la captura. Zonas inaceptables: header, regreso, portada/overlay, logo oculto, textos, cantidad y orden de ocho nodos, tamaño/velocidad de marquee, tres tarjetas, imágenes, badges, metadata, acciones, columnas, márgenes, footer, tema, breakpoints y comportamiento de navegación.

## Riesgos visuales y técnicos

- Convertir los strings de carreras actuales de Next.js sin recuperar imágenes, badges, duración y modalidad produciría una ficha incompleta.
- Omitir la galería explícita provocaría incompatibilidad con `InstitutionPageClient` y perdería la secuencia fallback canónica.
- Hacer visible, eliminar o dar espacio al logo `IES` rompería la composición de la portada.
- Conectar `Ver carrera` o `Consultar` antes de migrar carreras/contacto cambiaría el comportamiento autorizado.
- Aplicar la corrección móvil exclusiva de Santa Bárbara a IES alteraría el footer canónico.
- Las modificaciones del Centro de Control de la demo pueden alterar `localStorage.guiaEducativaInstitutions`; la auditoría usa el estado canónico sin datos locales personalizados.

## Conclusión

IES Concepción es compatible con la plantilla institucional dinámica existente. La próxima etapa puede limitarse a completar datos, habilitar el par estático y conectar su tarjeta, seguida de comparación visual rigurosa. No corresponde migrar carreras, contacto ni otra ciudad junto con esa ficha.
