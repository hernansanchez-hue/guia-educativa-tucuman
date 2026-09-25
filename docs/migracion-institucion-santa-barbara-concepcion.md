# Auditoría aislada: Instituto Santa Bárbara en Concepción

## Alcance

Esta auditoría documenta exclusivamente la ficha institucional que la demo Vite muestra para **Instituto Santa Bárbara** después de entrar a **Concepción**. La futura ruta prevista es:

`/concepcion/instituto-santa-barbara`

La arquitectura seguirá siendo `app/[ciudad]/[institucion]`. En esta etapa no se habilitó la ruta, no se conectó la tarjeta en Next.js y no se modificaron la demo Vite, `next-app`, paquetes ni lockfiles. La demo Vite es la fuente de verdad visual y textual; los datos o estilos existentes que no se renderizan en `#detailPage` no autorizan a crear secciones nuevas.

## 1. Ubicación actual

### Vista dentro de la SPA

- Estructura HTML: `index.html`, dentro de `section#detailPage.page`.
- Estado visible: `showDetail(name)` ejecuta `hidePages()` y agrega `active` a `#detailPage`.
- La navegación es simulada: la URL de Vite permanece en `/`.
- La ficha se abre desde la tarjeta `Instituto Santa Bárbara` de `#institutionCards` después de ejecutar `showCity("Concepción")`.
- También puede abrirse desde su slide destacado: `renderFeatured()` asigna `showDetail(inst.name)` al botón `Ver institución`.
- La validación manual confirmó la secuencia Home → Concepción → Instituto Santa Bárbara y el regreso a `Instituciones de Concepción`.

### ID y selectores principales

| Región | Selector canónico |
|---|---|
| Vista institucional | `#detailPage.page.active` |
| Regreso | `#detailPage > .btn.light` |
| Portada | `.detail-hero` |
| Fondo de portada | `#detailCover.detail-cover` |
| Fila de identidad | `.brand-row` |
| Logo | `#detailLogo.mini-logo` |
| Tipo y ciudad | `#detailType.eyebrow` |
| Nombre | `#instName` |
| Slogan | `#instSlogan` |
| Panel de galería | `.panel` + `#institutionGallery.creation-gallery` |
| Marquee | `.creation-marquee` + `.creation-marquee-group` |
| Ítem de galería | `.creation-card` |
| Panel de carreras | `.panel` + `#careerGrid.career-grid` |
| Tarjeta de carrera | `.career-summary-card` |
| Header público | `#siteHeader.site-header.visible` |
| Footer público | `#siteFooter.site-footer` |
| Botón flotante global | `.admin-fab.hidden` |

### Funciones y estado global involucrados

- `currentCity`: conserva `"Concepción"` durante la navegación a la ficha.
- `currentInstitution`: se reemplaza por el registro encontrado por nombre.
- `institutions`: se carga desde `localStorage.guiaEducativaInstitutions` o desde una copia normalizada de `defaultInstitutions`.
- `showCity(city)`: establece la ciudad, renderiza destacados y tarjetas.
- `renderCards()`: crea la tarjeta navegable con click, CTA, Enter y Espacio.
- `renderFeatured()`: crea el slider premium y su botón `Ver institución`.
- `showDetail(name)`: activa la ficha y carga portada, identidad, galería y carreras.
- `renderInstitutionGallery(inst)`: crea y duplica los ítems del marquee.
- `renderCareers(inst)`: crea las tres tarjetas de carrera.
- `backToCity()`: vuelve a ejecutar `showCity(currentCity)`.
- `showCareer(careerId)` y `consultCareer(career)`: acciones de las tarjetas académicas.
- `setHeaderMode(false)`: muestra el header público y oculta `.admin-fab`.

## 2. Estructura visual

### Orden canónico de secciones

1. Header público.
2. Botón `Volver a instituciones`.
3. Portada institucional.
4. Panel `Galería de fotos`.
5. Panel `Carreras`.
6. Footer público.

No hay breadcrumb, descripción larga, bloque de contacto, mapa, video visible, formulario ni modal entre esas secciones.

### Header público

Se reutiliza el header general de las páginas internas. Contiene:

- `GE Guía Educativa Tucumán`, con regreso a Home;
- `Inicio`;
- `Eventos`;
- `Nosotros`;
- `Cursos Docentes`;
- control de tema;
- apertura y cierre del menú móvil.

### Regreso

El botón visible dice exactamente `Volver a instituciones`. Ejecuta `backToCity()` y restaura la pantalla de Concepción sin cambiar la URL.

### Portada e identidad

- Imagen de fondo: `https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80`.
- Tipo contextual: `Terciario Privado | Concepción`.
- Nombre: `Instituto Santa Bárbara`.
- Slogan: `Formación técnica para integrarte rápido al mundo laboral.`
- Logo textual en el DOM: `ISB`.
- Estado visual del logo: oculto porque `.mini-logo` tiene `display: none`.
- Descripción disponible pero no visible en esta ficha: `Formación terciaria con valores, prácticas y salida laboral.`

La portada usa `background-image`, recorte `cover`, posición centrada y un overlay azul de izquierda a derecha. No debe convertirse a una estructura que altere el recorte o haga visible el logo.

### Galería o marquee

El título visible es `Galería de fotos`. Santa Bárbara no posee un arreglo `gallery` explícito en `defaultInstitutions`; `normalizeInstitution()` crea el siguiente fallback, en este orden:

1. imagen principal `imageBank.santa` (`photo-1562774053-701939374585`);
2. `imageBank.students` (`photo-1517486808906-6ca8b3f04846`);
3. `imageBank.classroom` (`photo-1509062522246-3755977927d7`);
4. `imageBank.graduation` (`photo-1523580846011-d3a5bc25702b`).

`renderInstitutionGallery()` duplica esos cuatro elementos. El DOM validado contiene ocho `.creation-card` y ocho imágenes, en el orden 1–4, 1–4. Los textos alternativos son `Foto 1 de Instituto Santa Bárbara` hasta `Foto 8 de Instituto Santa Bárbara`; el overlay de cada tarjeta repite `Instituto Santa Bárbara`.

La animación canónica dura 10 segundos, es lineal e infinita y se desplaza de `translateX(0)` a `translateX(-50%)`. Se pausa por hover sobre la galería o mediante `prefers-reduced-motion: reduce`.

### Carreras

El título visible es `Carreras`. Se muestran exactamente tres tarjetas y en este orden:

| Orden | Carrera | Descripción existente, no visible en la tarjeta | Imagen | Badge | Duración | Modalidad | Ciudad | Tipo | Texto auxiliar |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | Instrumentación Quirúrgica | Capacitación para asistir procedimientos en ámbitos de salud. | `imageBank.lab` | Inscripciones abiertas | 3 años | Presencial | Concepción | Terciario Privado | Propuesta académica con ficha completa disponible. |
| 2 | Laboratorio de Análisis Clínicos | Técnicas de laboratorio, muestras y protocolos de calidad. | `imageBank.classroom` | Nueva carrera | 3 años | Presencial | Concepción | Terciario Privado | Propuesta académica con ficha completa disponible. |
| 3 | Diagnóstico por Imágenes | Formación en tecnología aplicada a estudios médicos. | `imageBank.students` | Próximo ingreso | 3 años | Presencial | Concepción | Terciario Privado | Propuesta académica con ficha completa disponible. |

Cada tarjeta también muestra `Instituto Santa Bárbara · Concepción` y los botones `Ver carrera` y `Consultar`. Los badges surgen del ciclo por índice de `careerCardBadge()`; no están declarados en los arrays legacy.

### Footer

El footer visible es el footer general de GET, no contenido institucional de Santa Bárbara. Sus textos visibles incluyen:

- `Guía Educativa Tucumán`;
- `Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.`;
- `Explorar`, `Preguntas frecuentes`, `Cursos docentes`, `Lo Próximo`, `Quiénes somos`;
- `Contacto`, `Dall Asta 2469, Concepción, Tucumán`, `3865 751273`;
- `Descargá la app`;
- `DISPONIBLE PRÓXIMAMENTE EN Google Play`;
- `DESCARGAR PRÓXIMAMENTE EN App Store`;
- `Seguinos en redes`, `Facebook`, `Instagram`, `YouTube`, `TikTok`, `WhatsApp`;
- `Copyright © 2026 Guía Educativa Tucumán. Todos los derechos reservados.`;
- `Volver al inicio`.

La dirección y el WhatsApp del footer no pertenecen al registro institucional.

### Botón flotante, formularios y modales

`.admin-fab` sigue presente en el DOM global, pero queda oculto en la ficha. Dentro de `#detailPage` se verificaron cero formularios, cero iframes, cero videos y cero enlaces. No existe modal institucional.

## 3. Contenido canónico

### Datos institucionales hardcodeados en Vite

| Campo | Valor canónico |
|---|---|
| Nombre | Instituto Santa Bárbara |
| Logo textual | ISB, presente pero oculto |
| Tipo | Terciario Privado |
| Ciudades declaradas | Concepción, Aguilares |
| Plan | Premium |
| Slogan | Formación técnica para integrarte rápido al mundo laboral. |
| Descripción | Formación terciaria con valores, prácticas y salida laboral. |
| Dirección | Belgrano 810, Aguilares |
| WhatsApp | 3865 55 1188 |
| Imagen principal | Unsplash `photo-1562774053-701939374585` |
| Media | Video institucional |

### Campos vacíos y fallbacks

- `logoImage`, `logoPublicId`, `imagePublicId`, `featuredPublicId`, `videoUrl` y `videoPublicId` quedan vacíos mediante normalización.
- `featuredImage` cae en la imagen principal.
- `gallery` cae en las cuatro imágenes indicadas y luego se duplica para el marquee.
- Las carreras legacy reciben `duration: "3 años"`, `modality: "Presencial"`, `shifts: "Consultar"`, título igual al nombre y `nationalValidity: "Sí"`.
- La sede normalizada de cada carrera cae en `Belgrano 810, Aguilares`, aunque la tarjeta institucional visible muestra la ciudad contextual `Concepción`.
- Los IDs de las carreras legacy incluyen un sufijo aleatorio generado en cada normalización.
- Los textos genéricos de campo laboral, perfil, plan de tres años, requisitos y FAQ existen para la futura vista de carrera, no para la ficha institucional.

### Inconsistencias canónicas que no deben corregirse en esta migración

1. La ficha contextual es de Concepción, pero la dirección hardcodeada es `Belgrano 810, Aguilares`.
2. El registro declara dos ciudades, pero la portada y las tarjetas usan `currentCity`, por lo que aquí muestran Concepción.
3. `media` dice `Video institucional`, pero la ficha no contiene un video.
4. La descripción institucional aparece en la tarjeta de ciudad, pero no en la ficha.
5. `ISB` está cargado en el DOM y permanece oculto.
6. Los badges y metadatos académicos se generan por fallback, no por campos explícitos del origen.
7. Los IDs aleatorios de carrera no deben copiarse a Next.js; se requieren IDs estables sin cambiar el contenido visible.

## 4. Elementos presentes y ausentes

| Elemento | Estado canónico en la ficha |
|---|---|
| Dirección institucional | No visible. Disponible en datos: `Belgrano 810, Aguilares`. |
| WhatsApp institucional | No visible como bloque. Disponible en datos y usado por `Consultar`. |
| Teléfono | No existe como campo separado. |
| Email | Ausente. |
| Web | Ausente. |
| Mapa | Ausente. `.institution-map` es CSS residual. |
| Instagram | Ausente como dato institucional. El del footer es general. |
| Facebook | Ausente como dato institucional. El del footer es general. |
| TikTok | Ausente como dato institucional. El del footer es general. |
| Horarios | Ausentes. |
| Video | Ausente en el DOM, pese a `media: "Video institucional"`. |
| Formulario | Ausente en la ficha institucional. |
| Contacto institucional | Ausente como sección. |
| Galería | Presente como marquee de ocho nodos. |
| Carreras | Presentes: tres tarjetas. |

No se debe asumir que Santa Bárbara necesita secciones visibles de Siglo 21 ni completar campos mediante información externa.

## 5. Comportamiento

### Navegación y regreso

- La tarjeta de Concepción usa `role="link"`, `tabindex="0"` y `aria-label="Ver institución Instituto Santa Bárbara"`.
- Abre la ficha con click sobre la tarjeta, click sobre el CTA, Enter o Espacio.
- El slide destacado también invoca `showDetail(inst.name)`.
- `Volver a instituciones` conserva `currentCity` y vuelve a `Instituciones de Concepción`.
- Vite no cambia la URL; Next.js deberá usar `/concepcion/instituto-santa-barbara` y regresar a `/concepcion`.

### Galería, hover, focus y animaciones

- El marquee se ejecuta automáticamente durante 10 s por ciclo.
- Hover sobre la galería pausa la animación.
- `.creation-card:hover` y `.creation-card:focus-within` escalan a 0,9 y muestran el overlay.
- Cada ítem tiene `tabindex="0"`.
- `prefers-reduced-motion: reduce` pausa la animación.
- `.career-summary-card:hover` se eleva 5 px, cambia el borde a verde translúcido y aumenta la sombra.

### Botones académicos

- `Ver carrera` llama a `showCareer(career.id)` y abre la vista SPA de carrera. Esa vista no forma parte de esta migración y debe permanecer inactiva en Next.js hasta una autorización posterior.
- `Consultar` usa el WhatsApp institucional, elimina caracteres no numéricos, antepone `54` y abre una URL `wa.me` con el texto `Hola, quiero consultar por la carrera <nombre> en Instituto Santa Bárbara`.
- `Consultar` no guarda un lead ni muestra formulario.

### Tema claro y oscuro

- `applyTheme()` alterna `body.dark-theme`.
- El valor se persiste en `localStorage.guiaEducativaTheme` como `light` o `dark`.
- El control cambia entre `Activar modo oscuro` y `Activar modo claro`.
- La validación manual confirmó claro y oscuro sin errores de consola.
- En oscuro se midieron fondo de body `rgb(8, 17, 31)`, página `rgb(11, 20, 35)` y panel `rgb(17, 28, 46)`.
- Los fades laterales de la galería cambian de blanco a `#0b1423`.

### Responsive

- Escritorio validado a 1440 × 900.
- Móvil validado a 390 × 843.
- En móvil: header 355,2 × 58 px; portada 337,7 × 310 px; título Poppins 36 px/37,8 px, peso 700; tarjeta de galería 176 × 250 px; grilla académica de una columna de 292,1 px.
- Las tres tarjetas académicas se apilan; por debajo de 414 px sus botones pasan de dos columnas a una.
- El footer pasa a disposición apilada y el menú público usa su variante móvil.

### Persistencia, sesión y alertas

| Mecanismo | Uso real |
|---|---|
| `localStorage.guiaEducativaInstitutions` | Puede reemplazar los defaults de la demo y, por lo tanto, el contenido de esta ficha. |
| `localStorage.guiaEducativaTheme` | Conserva el tema. |
| `localStorage.guiaEducativaLeads` | Solo interviene en formularios de carrera, no en `#detailPage`. |
| `localStorage.guiaEducativaCities` | Administración de ciudades; no controla la ficha pública. |
| `sessionStorage.guiaEducativaAdminSession` | Sesión simulada del Centro de Control; no interviene en la ficha. |

No hay alertas propias de la ficha. Los botones simulados del footer conservan alertas de disponibilidad futura.

## 6. CSS

### Variables y tipografía

- Fuentes externas: Poppins y Geist; la ficha computa `Poppins, Arial, Helvetica, sans-serif`.
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

### Reglas geométricas principales

- `.page`: contenedor de la vista; solo `.active` se muestra.
- `.detail-hero`: overflow oculto, margen inferior 28 px, radio 8 px y sombra global.
- `.detail-cover`: altura mínima 310 px, padding 34 px, contenido al pie, fondo cover/center.
- `.detail-cover > div`: máximo 780 px.
- `.detail-cover h1`: `clamp(36px, 5vw, 60px)`, line-height 1,05.
- `.detail-cover p`: 20 px, line-height 1,45.
- `.brand-row`: flex, gap 13 px, margen inferior 16 px.
- `.mini-logo`: 78 × 78 px y radio 8 px, pero `display: none`.
- `.panel`: padding 22 px, borde `#e8eef6`, radio 8 px, fondo blanco y sombra suave.
- `.detail-section-title`: 30 px, peso 700, line-height 1,2 y centrado.
- `.creation-gallery`: máximo 1152 px, overflow oculto, padding vertical 8 px.
- Fades laterales: 90 px en escritorio y 36 px en móvil.
- `.creation-card`: 224 × 320 px, margen horizontal 16 px y radio 7 px; móvil 176 × 250 px y margen 8 px.
- `.career-grid`: `repeat(auto-fit, minmax(260px, 1fr))`, gap 16 px y centrado.
- `.career-summary-card`: máximo 360 px, radio 8 px, borde y sombra.
- Imagen académica: proporción 16:9 con `object-fit: cover`.
- Badge: coral, 9 px, uppercase, ubicado a 12 px del borde superior e izquierdo.
- Metadatos: dos columnas, gap 8 px, fuente 10 px.
- Acciones: dos columnas; una columna debajo de 414 px.

### Breakpoints relevantes

- `max-width: 1100px`: ajustes compartidos del header.
- `max-width: 980px`: estructuras compartidas pasan a menos columnas; `.detail-content` queda en una columna aunque la ficha no usa ese wrapper.
- `max-width: 900px`: footer compartido pasa a dos columnas.
- `max-width: 720px`: header y menú móvil, padding horizontal de página al 5 %, galería compacta, portada con padding 24 px y carreras en una columna.
- `max-width: 414px`: acciones académicas en una columna.
- `max-width: 360px`: título de portada a 30 px.

### Colisiones posibles con `ciudad.css` e `institucion.css`

- La ruta institucional importa primero `../ciudad.css` para el shell público y luego `institucion.css`.
- `institucion.css` usa selectores globales y genéricos como `.panel`, `.mini-logo`, `.btn.light`, `.brand-row` y `.career-grid`; pueden afectar otros elementos si se montan en el mismo árbol o cambia el orden de importación.
- `ciudad.css` aporta variables, `.page`, header, footer, tema y responsive compartido. `institucion.css` completa los selectores de portada, galería y carreras.
- Las reglas oscuras se reparten entre ambas hojas: `ciudad.css` aplica fondos/textos globales e `institucion.css` completa tarjeta académica y fades.
- No se recomienda extraer o reorganizar CSS en la próxima etapa. Debe reutilizarse el orden ya validado y cambiar CSS solo ante una diferencia visual demostrable.
- Existen selectores residuales en Vite para mapa, contacto, video y formularios; no justifican crear esos nodos.

## 7. Datos disponibles

### Ya disponibles en `next-app/app/data/institutions.js`

- `id` y `slug`: `instituto-santa-barbara`.
- Nombre, logo textual `ISB`, tipo y plan.
- Ciudades `Concepción` y `Aguilares`.
- Slogan y descripción.
- Dirección `Belgrano 810, Aguilares`.
- WhatsApp `3865 55 1188`.
- Imagen principal `imageBank.santa`.
- Etiqueta `Video institucional`.
- Los nombres de las tres carreras, actualmente como strings.
- La relación con `cityPages.concepcion.institutionIds` y con el slider destacado.
- El banco de imágenes ya contiene `santa`, `students`, `classroom`, `lab` y `graduation`.

### Datos faltantes para reproducir la ficha

- `gallery` explícita con las cuatro imágenes canónicas en orden.
- Objetos de carrera con IDs y slugs estables.
- Descripciones de las tres carreras.
- Imagen individual de cada carrera.
- Badge por orden.
- Duración `3 años`.
- Modalidad `Presencial`.
- Relación habilitada en `institutionPages` para Concepción/Santa Bárbara.
- Entrada adicional en `generateStaticParams()`.
- Activación controlada de la tarjeta y su CTA en `CityPageClient.js`.

### Separación recomendada de responsabilidades

- **Institución:** identidad, nombre, logo, tipo, plan, descripción, slogan, portada, galería y medios de contacto disponibles.
- **Carrera maestra:** ID/slug estable, nombre y contenido académico reutilizable que no depende de una sede.
- **Oferta institucional:** relación institución–carrera–ciudad, imagen contextual, badge/estado, duración, modalidad, sede, turnos, título, WhatsApp y disponibilidad.
- **Contexto de ruta:** ciudad e institución autorizadas para una combinación concreta.

No deben duplicarse nombre/tipo/WhatsApp institucional dentro de cada carrera, las URLs del banco de imágenes, los textos del header/footer ni la ciudad contextual en varios niveles. En esta etapa local puede conservarse el contrato simple ya validado, pero la futura capa de datos debe respetar esas responsabilidades.

### Información ausente que no debe inventarse

Email, teléfono separado, web, redes institucionales, horarios, mapa, video visible, formulario institucional y cualquier contenido externo no presente en la demo.

## 8. Futura implementación

### Reutilización de la ruta y la plantilla

- `app/[ciudad]/[institucion]/page.js` ya valida params, consulta la capa local y llama `notFound()`.
- `InstitutionPageClient.js` ya representa el DOM canónico compartido: header, regreso, portada, logo oculto, marquee, carreras, botón flotante oculto y footer.
- `institucion.css` ya contiene la geometría validada para esa plantilla.
- `PublicHeader` y `PublicFooter` deben reutilizarse sin cambios.
- La capa local `institutions.js` debe entregar a la plantilla una galería y carreras estructuradas.

La ficha de Santa Bárbara utiliza la misma estructura visual que la ficha validada de Siglo 21; cambia únicamente el contenido, las imágenes y la cantidad de carreras. Con los datos canónicos completos, la misma plantilla puede representarla fielmente. No se detectó una necesidad actual de duplicar la página ni de introducir una variante visual. Si una comparación posterior demuestra una diferencia estructural, debe resolverse mediante una variante de datos explícita y mínima, no mediante un rediseño general.

### Comportamiento que debe permanecer limitado

- Habilitar solo `/concepcion/instituto-santa-barbara`.
- Mantener 404 para combinaciones ciudad–institución no autorizadas.
- Conectar solo la tarjeta/CTA/teclado de Santa Bárbara en `/concepcion`.
- Mantener `Ver carrera` y `Consultar` sin nueva funcionalidad mientras no exista autorización para migrar carreras o contacto.
- No crear formularios, SEO definitivo, Supabase, autenticación ni páginas duplicadas.

## 9. Archivos previstos para la próxima etapa

### Modificar

1. `next-app/app/data/institutions.js`: completar galería y carreras de Santa Bárbara y habilitar la combinación contextual.
2. `next-app/app/[ciudad]/[institucion]/page.js`: agregar Santa Bárbara a `generateStaticParams()`.
3. `next-app/app/[ciudad]/CityPageClient.js`: permitir que únicamente la tarjeta de Santa Bárbara navegue a su ruta, conservando IES e Instituto del Sur inactivos.

### Reutilizar sin modificar, salvo diferencia comprobada

- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`.
- `next-app/app/[ciudad]/[institucion]/institucion.css`.
- `next-app/app/components/PublicHeader.js`.
- `next-app/app/components/PublicFooter.js`.
- `next-app/app/[ciudad]/ciudad.css`.

### Crear para la validación visual

- `docs/comparaciones/institucion-santa-barbara-concepcion-next/README.md`.
- `docs/comparaciones/institucion-santa-barbara-concepcion-next/analisis.md`.
- Ocho capturas fuente Vite/Next.js y doce derivados de comparación dentro de `docs/comparaciones/institucion-santa-barbara-concepcion-next/`.

No se debe crear una segunda página de institución, modificar Home, cambiar paquetes/lockfiles ni tocar la demo Vite.

## 10. Comparación visual

### Escenarios

Generar pares equivalentes Vite/Next.js en:

- escritorio claro: 1440 × 900;
- escritorio oscuro: 1440 × 900;
- móvil claro: 390 × 843;
- móvil oscuro: 390 × 843.

### Preparación de cada par

1. Vite: Home → Concepción → Instituto Santa Bárbara.
2. Next.js: `/concepcion` → Instituto Santa Bárbara.
3. Igualar viewport, tema, scroll, menú cerrado y ausencia de hover/foco.
4. Esperar Poppins y todas las imágenes remotas.
5. Registrar firma PNG, dimensiones, bytes, lectura completa y SHA-256.
6. Crear para cada escenario una imagen lado a lado, una superposición al 50 % y una diferencia absoluta por píxel, sin reescalar originales.
7. Añadir capturas suplementarias con offsets idénticos si la captura superior no cubre carreras y footer.

### Zonas dinámicas aceptables

- Posición horizontal del marquee si no puede congelarse en el mismo instante.
- Tiempo de carga y recorte subpíxel de imágenes Unsplash.
- Rasterizado subpíxel de Poppins.
- Scrollbar, sombras y `backdrop-filter` del header.
- Transiciones de hover/focus si el puntero queda dentro de una zona interactiva.

No hay video visible, por lo que no corresponde aceptar diferencias de fotograma.

### Diferencias no aceptables

- Logo `ISB` visible.
- Cambios en textos, acentos, orden o cantidad de carreras.
- Dirección, WhatsApp, descripción, video, mapa o formulario agregados a la ficha.
- Galería con menos/más de ocho nodos, imágenes distintas o animación diferente.
- Portada convertida a una geometría o recorte diferente.
- Cambios en header, regreso, paneles, footer, tema o responsive.
- Tarjetas con badges, metadatos, botones, imágenes, columnas o separaciones diferentes.
- Navegación habilitada para IES, Instituto del Sur, carreras u otras combinaciones no autorizadas.

## Riesgos visuales y técnicos

1. La ficha depende del contexto Concepción aunque la dirección hardcodeada apunte a Aguilares.
2. Hacer visible `ISB` modificaría la portada canónica.
3. Inventar contacto, mapa o video por la existencia de datos/CSS residual sería un rediseño.
4. Las carreras como strings no satisfacen la plantilla actual; deben estructurarse sin cambiar sus textos ni orden.
5. El marquee exige cuatro originales duplicados y 10 s exactos; una longitud distinta cambia velocidad y loop.
6. El estado animado produce diferencias de píxeles que deben separarse de cambios estructurales.
7. Los IDs aleatorios de Vite deben reemplazarse por IDs estables sin trasladar inestabilidad.
8. La ruta debe validar la combinación ciudad–institución; no debe habilitar automáticamente Santa Bárbara en Aguilares.
9. `dynamicParams = false` y `generateStaticParams()` deben mantenerse sincronizados.
10. Los selectores globales de `ciudad.css` e `institucion.css` pueden colisionar si se cambia el orden de carga.
11. El tema depende de `body.dark-theme` y `localStorage.guiaEducativaTheme`; debe comprobarse en acceso directo e hidratación.
12. `Ver carrera` y `Consultar` no tienen implementación definitiva en Next.js y no deben activarse accidentalmente.
13. Las imágenes y fuentes externas pueden causar variaciones de carga que no deben confundirse con diferencias de layout.
14. Las respuestas 404 de la ruta dinámica actualmente pueden registrar `Internal: NoFallbackError` en stderr de producción aunque devuelvan 404; debe revisarse por separado sin ocultarlo mediante configuración cosmética.

## Conclusión

La versión canónica de Instituto Santa Bárbara en Concepción está delimitada por el mismo shell institucional ya validado: header, regreso, portada, galería marquee, tres carreras y footer. La plantilla dinámica existente puede reutilizarse fielmente completando únicamente los datos locales, el parámetro estático y la navegación autorizada. La próxima etapa debe implementar esa única combinación, producir la comparación visual y mantener ausentes todas las secciones que la demo no muestra.
