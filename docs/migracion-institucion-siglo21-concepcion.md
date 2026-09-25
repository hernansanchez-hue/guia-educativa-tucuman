# Auditoría aislada: Universidad Siglo 21 en Concepción

## Alcance

Esta auditoría documenta exclusivamente la ficha institucional que la demo Vite muestra para **Universidad Siglo 21** después de entrar a **Concepción**. La futura URL aprobada es:

`/concepcion/universidad-siglo-21`

La arquitectura prevista es `app/[ciudad]/[institucion]/page.js`, pero en esta etapa no se creó ni programó esa ruta. Tampoco se conectaron las tarjetas institucionales de Next.js.

La demo Vite sigue siendo la fuente de verdad visual y textual. Los estilos, datos o módulos administrativos que existen en el código pero no aparecen en `section#detailPage` se registran como datos disponibles o CSS residual; no justifican agregar contenido visible.

## 1. Ubicación actual

### Vista dentro de la SPA

- Archivo estructural: `index.html`, líneas 167–191.
- Contenedor principal: `section#detailPage.page`.
- Estado visible: la clase `active` convierte la vista de `display: none` a `display: block`.
- La URL del navegador no cambia: la navegación sigue ocurriendo dentro de `/`.
- La vista se abre desde la primera tarjeta de `#institutionCards` en `section#cityPage`, después de seleccionar Concepción.

### Selectores principales

| Región | Selector |
|---|---|
| Vista institucional | `#detailPage.page` |
| Botón para volver | `#detailPage > .btn.light` |
| Portada | `.detail-hero` |
| Imagen de portada | `#detailCover.detail-cover` mediante `background-image` inline |
| Identidad | `.brand-row` |
| Logo textual o imagen | `#detailLogo.mini-logo` |
| Tipo y ciudad | `#detailType.eyebrow` |
| Nombre | `#instName` |
| Slogan | `#instSlogan` |
| Panel de galería | `.panel` + `#institutionGallery.creation-gallery` |
| Marquee | `.creation-marquee` y `.creation-marquee-group` |
| Tarjeta de galería | `.creation-card` |
| Panel de carreras | `.panel` + `#careerGrid.career-grid` |
| Tarjeta de carrera | `.career-summary-card` |
| Footer | `#siteFooter.site-footer` |
| Botón flotante global | `.admin-fab` |

### Estado global y funciones

- `currentCity` comienza como `"Concepción"` y se actualiza con `showCity(city)`.
- `currentInstitution` comienza con `institutions[0]`, Universidad Siglo 21, y se actualiza en `showDetail(name)`.
- `institutions` se obtiene de `localStorage.guiaEducativaInstitutions` o, si no existe/es inválido, de una copia de `defaultInstitutions` normalizada.
- `pages` incluye `cityPage`, `detailPage`, `careerPage` y las demás vistas de la SPA.
- `hidePages()` desactiva todas las páginas, oculta Home, muestra el header público y oculta el botón flotante.
- `showDetail(name)` localiza la institución, asigna `currentInstitution`, activa `#detailPage`, muestra el footer, carga portada/identidad/galería/carreras y vuelve al inicio del documento.
- `renderInstitutionGallery(inst)` construye la galería animada.
- `renderCareers(inst)` construye las cuatro tarjetas de carreras.
- `backToCity()` vuelve a ejecutar `showCity(currentCity)`.

### Navegación actual desde Concepción

Cada tarjeta institucional recibe:

- `role="link"`;
- `tabindex="0"`;
- `aria-label="Ver institución Universidad Siglo 21"`;
- click sobre la tarjeta;
- click sobre el CTA `Ver institución` con detención de propagación;
- teclado Enter o Espacio.

Las cuatro vías ejecutan `showDetail("Universidad Siglo 21")`. La validación manual confirmó que la ficha se abre desde la tarjeta de Concepción y que `Volver a instituciones` restaura `Instituciones de Concepción` con las tres tarjetas canónicas.

## 2. Estructura visual

### Header público

Se usa `#siteHeader.site-header`, no el header especial de Home. Contiene:

- logo `GE Guía Educativa Tucumán`, que vuelve a Home;
- navegación `Inicio`, `Eventos`, `Nosotros`;
- `Cursos Docentes` en escritorio y su variante dentro del menú móvil;
- control claro/oscuro;
- botón de apertura/cierre del menú móvil.

El header es sticky, centrado y con forma de píldora en escritorio. En móvil pasa a 58 px de alto, radio de 18 px y dos columnas.

### Botón de regreso

Antes de la portada aparece `Volver a instituciones`. Ejecuta `backToCity()` y conserva `currentCity`. No existe breadcrumb.

### Portada

La portada es `.detail-hero`, con `#detailCover` como fondo. Para Siglo 21 usa:

`https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80`

La imagen tiene `background-size: cover`, posición centrada y un degradado azul superpuesto de izquierda a derecha.

Contenido visible, en este orden:

1. `Privada | Concepción`.
2. `Universidad Siglo 21`.
3. `Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.`

### Logo institucional

`#detailLogo` recibe el texto `US21` porque no existe `logoImage`. Sin embargo, la regla `.mini-logo` tiene `display: none`; por lo tanto el logo textual está en el DOM pero **no es visible**. No se debe hacer visible durante la migración. Si en el futuro existiera `logoImage`, `institutionLogoMarkup()` produciría una imagen con `.detail-logo-image`, pero ese no es el estado canónico actual.

### Tipo, descripción y slogan

- Tipo visible: `Privada | Concepción`.
- Slogan visible: `Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.`
- Descripción disponible en datos: `Educación innovadora, profesional y conectada con el mundo.`
- La descripción **no se renderiza** en la ficha institucional actual.

### Galería

La sección visible se titula `Galería de fotos`.

La institución no trae una galería explícita en `defaultInstitutions`, por lo que `normalizeInstitution()` crea este fallback:

1. imagen principal de Siglo 21;
2. imagen `students`;
3. imagen `classroom`;
4. imagen `graduation`.

`renderInstitutionGallery()` duplica los cuatro elementos para lograr un loop continuo, de modo que el DOM contiene ocho `.creation-card`. Los textos alternativos son `Foto 1 de Universidad Siglo 21` hasta `Foto 8 de Universidad Siglo 21`; cada overlay repite `Universidad Siglo 21`.

La animación dura `cantidad × 2500 ms`; con cuatro originales resulta en 10 segundos. Se desplaza de `translateX(0)` a `translateX(-50%)`, se repite linealmente y se pausa al hover o cuando el sistema solicita reducción de movimiento.

No hay controles anterior/siguiente, modal de imagen ni lightbox.

### Carreras

La sección visible se titula `Carreras` y muestra cuatro tarjetas, en este orden:

| Orden | Carrera | Imagen | Badge | Duración | Modalidad | Ciudad | Tipo | Texto auxiliar |
|---:|---|---|---|---|---|---|---|---|
| 1 | Abogacía | `imageBank.classroom` | Inscripciones abiertas | 3 años | Presencial | Concepción | Privada | Propuesta académica con ficha completa disponible. |
| 2 | Contador Público | `imageBank.students` | Nueva carrera | 3 años | Presencial | Concepción | Privada | Propuesta académica con ficha completa disponible. |
| 3 | Lic. en Administración | `imageBank.design` | Próximo ingreso | 3 años | Presencial | Concepción | Privada | Propuesta académica con ficha completa disponible. |
| 4 | Higiene y Seguridad | `imageBank.lab` | Inscripciones abiertas | 3 años | Presencial | Concepción | Privada | Propuesta académica con ficha completa disponible. |

Cada tarjeta también muestra `Universidad Siglo 21 · Concepción` y los botones `Ver carrera` y `Consultar`.

Los datos de carrera provienen de arrays legacy. `normalizeCareer()` completa duración, modalidad, sede, turnos, título, validez, contenidos y FAQ mediante fallbacks. Los IDs de las carreras legacy contienen un sufijo aleatorio; esa inestabilidad pertenece a la demo y no debe trasladarse a la futura capa local.

### Contacto institucional y otros bloques solicitados

La auditoría DOM en escritorio y móvil confirmó que `#detailPage` contiene cero elementos para contacto, mapa, formulario y video. Estado canónico:

| Elemento | Estado visible actual |
|---|---|
| Dirección institucional | No visible en la ficha. Existe en datos: `San Martín 124, Concepción`. |
| WhatsApp institucional | No visible como bloque propio. Existe en datos: `3865 41 2020`; lo usa `Consultar` de las carreras. |
| Teléfono | No existe un campo separado. |
| Email | No existe. |
| Sitio web | No existe. |
| Redes sociales institucionales | No existen. |
| Horarios | No existen. |
| Mapa | No existe en el DOM de la ficha. `.institution-map` es CSS residual. |
| Video | No se renderiza. `media: "Video institucional"` y `videoUrl` pertenecen a datos/administración, no a la vista actual. |
| Formulario institucional | No existe. Los formularios de leads pertenecen a la página de carrera. |
| Modal institucional | No existe. |

No se deben inventar estos bloques durante la próxima migración.

### Footer

El footer público sí es visible. Sus textos son:

- `Guía Educativa Tucumán`.
- `Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.`
- `Explorar`.
- `Preguntas frecuentes`.
- `Cursos docentes`.
- `Lo Próximo`.
- `Quiénes somos`.
- `Contacto`.
- `Dall Asta 2469, Concepción, Tucumán`.
- `3865 751273`.
- `Descargá la app`.
- `DISPONIBLE PRÓXIMAMENTE EN Google Play`.
- `DESCARGAR PRÓXIMAMENTE EN App Store`.
- `Seguinos en redes`.
- `Facebook`, `Instagram`, `YouTube`, `TikTok`, `WhatsApp`.
- `Copyright © 2026 Guía Educativa Tucumán. Todos los derechos reservados.`
- `Volver al inicio`.

La dirección y el WhatsApp del footer son datos generales de GET, no datos de Universidad Siglo 21.

### Botón flotante

`.admin-fab` existe globalmente, pero `hidePages()` llama a `setHeaderMode(false)` y lo deja con `display: none` en la ficha institucional. No debe mostrarse ni conectarse al Centro de Control.

## 3. Contenido canónico y datos hardcodeados

### Datos institucionales de Siglo 21 en la demo

| Campo | Valor |
|---|---|
| Nombre | Universidad Siglo 21 |
| Logo textual | US21, presente pero oculto en la ficha |
| Tipo | Privada |
| Ciudades | Concepción, Monteros, Aguilares |
| Plan | Premium |
| Slogan | Estudiá con flexibilidad y proyectá tu carrera desde Tucumán. |
| Descripción | Educación innovadora, profesional y conectada con el mundo. |
| Dirección | San Martín 124, Concepción |
| WhatsApp | 3865 41 2020 |
| Imagen principal | URL Unsplash `photo-1498243691581-b145c3f54a5a` |
| Media | Video institucional, etiqueta no visible en esta ficha |

### Descripciones de carrera existentes pero no visibles en la ficha

- Abogacía: `Formación jurídica con modalidad flexible y acompañamiento tutorial.`
- Contador Público: `Herramientas contables, impositivas y financieras para empresas.`
- Lic. en Administración: `Gestión, liderazgo y estrategia para organizaciones actuales.`
- Higiene y Seguridad: `Prevención, normativa y seguridad aplicada al trabajo.`

Estas descripciones se usan al abrir una carrera, no en las tarjetas institucionales actuales.

### Fallbacks e inconsistencias a preservar temporalmente

- La galería no está declarada en la institución: se construye con cuatro imágenes fallback y luego se duplica.
- El campo `media` afirma `Video institucional`, pero la ficha no muestra video.
- Los cuatro registros legacy reciben `3 años`, `Presencial`, `Consultar`, validez `Sí`, plan de tres años, requisitos y FAQ genéricos.
- Los IDs de carrera se generan con sufijos aleatorios en Vite. Next.js debe usar IDs/slugs estables sin cambiar el contenido visible.
- El logo `US21` queda oculto por CSS aunque se cargue en el DOM.
- La ciudad visible de cada tarjeta se toma de `currentCity`, no de una sede individual de la carrera.

## 4. Comportamiento

### Galería y animación

- Marquee CSS automático, lineal e infinito.
- Duración canónica: 10 s para Siglo 21.
- Pausa por hover.
- Pausa mediante `prefers-reduced-motion: reduce`.
- Overlay visible en hover o focus-within.
- Cada tarjeta de galería tiene `tabindex="0"`.

### Navegación interna

- `Volver a instituciones` restaura `cityPage` para `currentCity`.
- `Ver carrera` ejecuta `showCareer(career.id)` y activa `careerPage`.
- `Volver a la institución` desde carrera vuelve a ejecutar `showDetail(currentInstitution.name)`.
- La validación confirmó la secuencia Universidad Siglo 21 → Abogacía → Universidad Siglo 21 → Instituciones de Concepción.
- No existen rutas reales ni cambios de URL.

### Consultas por WhatsApp

`Consultar` toma `career.whatsapp` o el WhatsApp institucional, elimina caracteres no numéricos, antepone `54` si corresponde y abre:

`https://wa.me/<número>?text=Hola, quiero consultar por la carrera <carrera> en Universidad Siglo 21`

No guarda un lead. La conversación externa no se envía automáticamente.

### Formularios y leads

La ficha institucional no contiene formularios. `guiaEducativaLeads` se utiliza únicamente después de entrar a una página de carrera y completar su formulario simulado. No debe trasladarse como funcionalidad de esta pantalla.

### Tema claro y oscuro

- `applyTheme()` alterna `body.dark-theme` y persiste `localStorage.guiaEducativaTheme`.
- El header actualiza `aria-label` y `title` entre `Activar modo oscuro` y `Activar modo claro`.
- Se validaron ambas variantes en escritorio y móvil sin errores de consola.
- En oscuro, página/footer usan `#0b1423`; paneles y tarjetas usan `#111c2e`; bordes usan `#2c3a4f`; textos principales usan tonos `#edf4ff`/`#dce6f4` y secundarios `#a8b6ca`.
- Los degradados laterales de la galería cambian de blanco a `#0b1423`.

### Responsive y menú móvil

- A 1440 px: header de 1120 × 62 px; portada de aproximadamente 1253,83 × 310 px; galería de 1152 × 336 px; cuatro columnas de carrera de aproximadamente 290 px.
- A viewport solicitado de 390 × 843, el ancho documental medido fue 375 px por el scrollbar: header 355,2 × 58 px; portada 337,7 × 310 px; galería 292,1 × 266 px; carreras en una sola columna de 292,1 px.
- El menú móvil abre y cierra correctamente.
- El footer pasa de cuatro columnas y unos 398 px de alto a un apilado de aproximadamente 900,7 px.

### Hover, focus y estados

- `.career-summary-card:hover`: elevación de 5 px, borde verde y sombra más fuerte.
- `.creation-card:hover` y `.creation-card:focus-within`: escala 0,9 y muestra overlay.
- Los botones conservan el foco nativo/global; navegación y selector tienen reglas `:focus-visible` específicas.
- El botón `Volver a instituciones` usa `.btn.light`.
- No hay loading, skeleton, toast ni modal en la ficha.

### Persistencia

| Almacenamiento | Clave | Relación con la ficha |
|---|---|---|
| localStorage | `guiaEducativaInstitutions` | Fuente primaria de la SPA si existe; puede sobrescribir los defaults. |
| localStorage | `guiaEducativaTheme` | Tema claro/oscuro. |
| localStorage | `guiaEducativaLeads` | Solo página/formulario de carrera. |
| localStorage | `guiaEducativaCities` | Administración de ciudades; no define esta ficha. |
| sessionStorage | `guiaEducativaAdminSession` | Sesión simulada del Centro de Control; no interviene en la ficha pública. |

Next.js no debe usar localStorage como fuente principal de datos institucionales. En la etapa inicial debe usar la capa local versionada.

### Alertas simuladas

No hay alertas propias de `detailPage`. El footer conserva alertas `... estará disponible próximamente` para Preguntas frecuentes, tiendas y redes; deben permanecer simuladas hasta que sus destinos se migren.

## 5. CSS

### Variables y tipografía

- Fuente general: `Poppins, Arial, Helvetica, sans-serif`.
- `--azul: #173b7a`.
- `--azul-2: #2456a6`.
- `--verde: #19a974`.
- `--amarillo: #f6c85f`.
- `--coral: #ef6f6c`.
- `--gris: #f5f7fa`.
- `--linea: #dfe7f2`.
- `--texto: #172033`.
- `--muted: #667085`.
- `--blanco: #ffffff`.
- `--sombra: 0 16px 36px rgba(15, 23, 42, 0.13)`.
- `--radio: 8px`.

### Reglas principales

- `.page`: padding `28px 6% 48px`; solo `.page.active` se muestra.
- `.detail-hero`: overflow oculto, margen inferior 28 px, radio 8 px, fondo blanco y sombra global.
- `.detail-cover`: altura mínima 310 px, contenido alineado abajo, padding 34 px, fondo cover/center.
- `.detail-cover::before`: degradado `rgba(10,29,63,.82)` a `rgba(10,29,63,.28)`.
- `.detail-cover > div`: ancho máximo 780 px.
- `.detail-cover h1`: `clamp(36px, 5vw, 60px)`, line-height 1,05.
- `.detail-cover p`: 20 px, line-height 1,45, blanco al 90 %.
- `.brand-row`: flex, gap 13 px, margen inferior 16 px.
- `.mini-logo`: 78 × 78 px, radio 8 px, pero `display: none`.
- `.panel`: padding 22 px, borde `#e8eef6`, radio 8 px, fondo blanco y sombra suave.
- `.detail-section-title`: 30 px, peso 700, line-height 1,2, centrado.
- `.creation-gallery`: máximo 1152 px, overflow oculto, padding vertical 8 px.
- Fades laterales: 90 px en escritorio, 36 px en móvil.
- `.creation-card`: 224 × 320 px, margen horizontal 16 px y radio 7 px; en móvil 176 × 250 px y margen 8 px.
- `.career-grid`: `repeat(auto-fit, minmax(260px, 1fr))`, gap 16 px, elementos centrados.
- `.career-summary-card`: máximo 360 px, radio 8 px, borde, fondo, sombra y transición de 190 ms.
- Imagen de carrera: proporción 16:9 y `object-fit: cover`.
- Badge: top/left 12 px, padding 6 × 9 px, coral `#ef6f6c`, 9 px, uppercase.
- Cuerpo: padding 17 px; en móvil 15 px.
- Metadatos: grilla de dos columnas, gap 8 px, texto 10 px.
- Acciones: dos columnas; debajo de 414 px pasan a una columna.

### Breakpoints relevantes

- `max-width: 980px`: reglas compartidas pasan `.detail-content` a una columna, aunque la ficha actual no usa ese wrapper.
- `max-width: 720px`: header móvil, página con padding horizontal 5 %, tarjetas de galería más pequeñas, paneles/formularios residuales en una columna, portada con padding 24 px y título a 36 px.
- `max-width: 414px`: acciones de carrera en una columna y título de portada a 30 px.
- Existen otros breakpoints globales (1100, 1050, 900, 820, 360), pero no todos alteran selectores propios de `detailPage`.

### Reglas compartidas y residuales

La ficha comparte header, navegación, botones, `.page`, `.panel`, footer, tema y tarjetas de carrera con otras pantallas. Existen reglas para `.detail-content`, `.detail-institution-content`, `.detail-form-panel`, `.contact-actions`, `.institution-map` y `.detail-video`; varias no tienen elemento correspondiente dentro del `detailPage` actual. No deben copiarse como excusa para crear secciones inexistentes.

## 6. Futura arquitectura

### Ruta dinámica

Archivo previsto:

`next-app/app/[ciudad]/[institucion]/page.js`

Para Next.js 16.2.12, `params` es una promesa y debe resolverse con `await`. La página será un Server Component que:

1. recibe `{ ciudad, institucion }`;
2. consulta una función local como `getInstitutionPage(ciudad, institucion)`;
3. verifica que la ciudad exista;
4. verifica que el slug institucional exista;
5. verifica que el ID de esa institución pertenezca a `cityPages[ciudad].institutionIds`;
6. llama `notFound()` ante cualquier combinación inválida;
7. pasa datos ya validados al cliente visual.

### Generación estática y 404

La documentación local permite generar los dos segmentos desde la página hija. En esta primera implementación, `generateStaticParams()` debería devolver únicamente:

`{ ciudad: "concepcion", institucion: "universidad-siglo-21" }`

La página hija debería usar `dynamicParams = false` para que las combinaciones no generadas devuelvan 404. Deben probarse al menos:

- `/concepcion/universidad-siglo-21` → 200;
- `/concepcion/institucion-inexistente` → 404;
- `/monteros/universidad-siglo-21` → 404;
- `/aguilares/universidad-siglo-21` → 404;
- `/ciudad-inexistente/universidad-siglo-21` → 404.

La ruta estática `/ciudades` conserva prioridad y tiene distinta cantidad de segmentos. `/concepcion` sigue siendo atendida por `app/[ciudad]/page.js`. Cualquier futuro path estático de dos segmentos debe declararse explícitamente y validarse contra la ruta dinámica.

### Componentes servidor y cliente

- `page.js`: Server Component para params, lookup, 404 y generación estática.
- `InstitutionPageClient.js`: Client Component para navegación interna simulada, regreso, tema/header móvil y cualquier estado interactivo imprescindible.
- La galería puede mantenerse mayormente como markup + animación CSS; no necesita estado React para su movimiento canónico.
- `PublicHeader` y `PublicFooter` ya son Client Components reutilizables y no deberían modificarse si reproducen la demo.
- La portada, galería y tarjetas pueden separarse en componentes internos solo si no cambia el DOM ni introduce abstracción innecesaria.

### CSS compartido

La ruta hija no hereda automáticamente el CSS importado por la página hermana `app/[ciudad]/page.js`. La próxima etapa debe decidir explícitamente cómo cargar las reglas ya validadas de header/footer:

- importar `../ciudad.css` desde la nueva página y agregar `institucion.css`; o
- extraer únicamente reglas públicas compartidas en una tarea autorizada posterior.

Para minimizar regresiones, la opción inicial recomendada es importar el CSS ya validado y agregar selectores institucionales específicos, comprobando colisiones globales. No se debe reorganizar todo el CSS durante la migración de esta única ficha.

### Relación con carreras

- La ficha mostrará las cuatro tarjetas canónicas.
- `Ver carrera` debe permanecer inactivo hasta migrar rutas de carrera, salvo autorización posterior expresa.
- No se deben crear placeholders.
- Los objetos de carrera deben tener IDs/slugs estables desde ahora para evitar otra migración de datos.
- `Consultar` requiere una decisión explícita de etapa: la demo abre WhatsApp directamente; no crea un lead.

### Relación futura con Supabase

La primera versión debe leer exclusivamente la capa local. Más adelante Supabase podrá reemplazar la fuente de instituciones, sedes, galerías y oferta académica, manteniendo los mismos contratos de datos y validación. No se debe agregar cliente, variables, esquema, consultas ni autenticación en la próxima etapa visual.

### Elementos que deben seguir simulados o ausentes

- rutas de carrera;
- formularios/leads;
- Centro de Control;
- footer “próximamente”;
- redes sin destino definitivo;
- video institucional no renderizado;
- contacto institucional, mapa, email, web y horarios inexistentes;
- SEO definitivo.

## 7. Datos disponibles y faltantes

### Ya disponibles en `next-app/app/data/institutions.js`

- `id: "universidad-siglo-21"`;
- `slug: "universidad-siglo-21"`;
- nombre;
- logo textual `US21`;
- tipo `Privada`;
- ciudades Concepción, Monteros y Aguilares;
- plan Premium;
- slogan;
- descripción;
- dirección;
- WhatsApp;
- imagen principal;
- etiqueta `Video institucional`;
- nombres de las cuatro carreras;
- relación de la institución con `cityPages.concepcion.institutionIds`.

### Información que falta para reproducir la ficha

- galería explícita y ordenada con las cuatro imágenes fallback;
- URL `graduation`, que no está en el `imageBank` actual de Next.js;
- objetos completos y estables para las cuatro carreras;
- imágenes individuales de cada carrera;
- duración y modalidad fallback;
- badges canónicos por orden;
- texto auxiliar canónico;
- relación explícita entre la combinación ciudad–institución y la ciudad que se muestra en las tarjetas.

### Datos institucionales versus oferta de carrera

Pertenecen a la institución: ID/slug, nombre, logo, tipo, plan, descripción, slogan, ciudades/sedes, dirección, WhatsApp, portada, galería y media.

Pertenecen a cada carrera: ID/slug estable, nombre, descripción, imagen, duración, modalidad, sede/campus, turnos, título, validez, contenido, campo laboral, perfil, plan, requisitos, FAQ, WhatsApp opcional y estado de formulario.

La ciudad contextual de la ficha pertenece a la relación ciudad–institución. No debe duplicarse como si fuera propiedad exclusiva de la institución o de cada carrera.

### Datos que no deben duplicarse

- nombre/tipo/WhatsApp institucional dentro de cada carrera;
- nombre de ciudad dentro de la institución cuando ya existe la relación `cities` y `cityPages`;
- reglas de badges si se decide mantener un orden canónico central;
- imágenes compartidas del banco;
- textos y enlaces generales del footer;
- datos del header o tema.

### Datos ausentes que no deben inventarse

Email, teléfono separado, web, redes institucionales, horarios, mapa, video visible y formulario institucional.

## 8. Archivos previstos para la próxima etapa

### Crear

- `next-app/app/[ciudad]/[institucion]/page.js`
- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`
- `next-app/app/[ciudad]/[institucion]/institucion.css`
- `docs/comparaciones/institucion-siglo21-concepcion-next/README.md`
- `docs/comparaciones/institucion-siglo21-concepcion-next/analisis.md`
- ocho capturas fuente Vite/Next.js dentro de esa carpeta;
- doce imágenes de comparación dentro de esa carpeta.

### Modificar

- `next-app/app/data/institutions.js`: completar galería, carreras estables y helper de lookup contextual.
- `next-app/app/[ciudad]/CityPageClient.js`: conectar únicamente la tarjeta/CTA/teclado de Universidad Siglo 21 con `/concepcion/universidad-siglo-21`; Santa Bárbara e IES deben seguir inactivas.

### Reutilizar sin modificar, salvo problema demostrado

- `next-app/app/components/PublicHeader.js`
- `next-app/app/components/PublicFooter.js`
- `next-app/app/[ciudad]/ciudad.css`, importándolo conscientemente para reglas compartidas si las pruebas confirman que no causa colisiones.
- `next-app/app/globals.css` para variables y Poppins.

No se prevé modificar Home, `/ciudades`, `CitySelector.js`, paquetes, lockfiles ni la demo Vite.

## 9. Método de comparación visual

### Escenarios base

Para Vite y Next.js se generarán pares equivalentes en:

- escritorio claro, 1440 × 900;
- escritorio oscuro, 1440 × 900;
- móvil claro, 390 × 843;
- móvil oscuro, 390 × 843.

Cada archivo deberá ser PNG real, con firma, dimensiones, bytes, SHA-256 y lectura completa documentados.

### Estado sincronizado

- navegación Vite: Home → Concepción → Universidad Siglo 21;
- navegación Next: `/concepcion` → Universidad Siglo 21;
- mismo tema;
- mismo viewport;
- scroll superior en cero;
- fuentes cargadas;
- mismas imágenes remotas cargadas;
- galería pausada en una posición documentada;
- sin foco, hover o menú móvil abierto salvo el escenario específico que se compare.

Como el viewport superior no incluye todas las carreras y el footer, se recomiendan capturas suplementarias con offsets idénticos para galería, carreras y footer. Esas capturas no reemplazan los cuatro pares principales.

### Derivados

Por cada escenario principal:

1. imagen lado a lado sin reescalar;
2. superposición semitransparente 50/50;
3. diferencia absoluta por píxel.

### Regiones dinámicas y diferencias legítimas

- posición horizontal del marquee de galería;
- tiempo de carga/rasterizado de imágenes Unsplash;
- rasterizado subpíxel de Poppins;
- scrollbar y altura documental;
- sombras/backdrop-filter del header;
- transición de hover/focus si el puntero queda dentro de la galería;
- menú sticky móvil durante el scroll.

No existe video visible en la ficha, por lo que no corresponde aceptar diferencias de fotograma de video.

### Mediciones obligatorias

- header, logo, botón de tema y menú móvil;
- botón `Volver a instituciones`;
- portada, overlay, tipo, nombre y slogan;
- ancho/alto de paneles;
- galería, tarjetas y velocidad/pausa de animación;
- grilla y tarjetas de carrera;
- badges, metadatos y botones;
- márgenes, paddings, tipografía, pesos y alturas de línea;
- footer;
- ocultamiento del botón flotante;
- modo oscuro y breakpoints.

## Riesgos visuales y técnicos

1. Hacer visible `US21` alteraría la portada canónica porque `.mini-logo` está oculto.
2. Agregar contacto, mapa, video o formulario basándose en CSS residual sería un rediseño.
3. El marquee duplicado debe conservar ocho nodos y el ancho/velocidad exactos; una lista React con claves o tamaños distintos puede romper el loop.
4. La galería animada genera diferencias de posición si las capturas no se sincronizan.
5. Convertir `background-image` a `<img>` cambiaría recorte, overlay y geometría.
6. Las carreras legacy tienen IDs aleatorios; deben sustituirse por IDs estables sin cambiar orden o contenido visible.
7. La ciudad visible depende del contexto `/concepcion`, no solo del registro institucional global.
8. Cargar `ciudad.css` en la ruta hija puede introducir colisiones por selectores genéricos; duplicar todas sus reglas aumentaría divergencia futura.
9. `PublicHeader` y `PublicFooter` ya están validados, pero su CSS hoy vive en la hoja de ciudad y debe cargarse explícitamente.
10. La persistencia de tema durante hidratación y navegación debe probarse nuevamente en acceso directo a la ruta profunda.
11. Conectar `Ver carrera` prematuramente crearía rutas no autorizadas.
12. Activar `Consultar` debe conservar el WhatsApp/texto canónico sin agregar leads ni formularios.
13. Rutas ciudad–institución inválidas deben devolver 404, no reutilizar silenciosamente la primera institución como hace el fallback de la SPA.
14. Las rutas estáticas y `/concepcion` deben conservar su prioridad y códigos actuales.
15. Las imágenes externas y Poppins pueden generar variaciones de captura que deben separarse de diferencias estructurales.

## Conclusión

La ficha institucional canónica de Universidad Siglo 21 está delimitada: header público, regreso, portada, galería marquee, cuatro carreras y footer. No contiene los bloques de contacto institucional que algunos estilos residuales permitirían construir. La próxima etapa puede migrarla mediante `/[ciudad]/[institucion]` usando datos locales estables y validación estricta de la combinación, sin Supabase, sin carreras navegables y sin agregar contenido.
