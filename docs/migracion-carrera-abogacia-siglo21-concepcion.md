# Auditoría inicial — Abogacía · Universidad Siglo 21 · Concepción

## Alcance

Esta auditoría describe exclusivamente la ficha contextual existente en la SPA Vite para **Abogacía** dentro de **Universidad Siglo 21** y la ciudad activa **Concepción**. No implementa la ruta futura ni modifica la demo, datos o estilos.

Ruta futura aprobada: `/concepcion/universidad-siglo-21/carreras/abogacia`.

## 1. Ubicación actual en la SPA

- Vista: `<section id="careerPage" class="page" aria-live="polite">` de `index.html`. Está oculta por defecto; `.page.active` la hace visible.
- Selectores raíz y contenidos: `#careerPage`, `.career-page-shell`, `.career-detail-layout`, `.career-detail-main`, `.career-contact-sidebar`, `#careerPageInstitution`, `#careerPageName`, `#careerPageTitle`, `#careerFacts`, `#careerPageImage`, `#careerHeroDescription`, `#careerAbout`, `#careerProfile`, `#careerField`, `#careerFieldChips`, `#careerStudyPlan`, `#careerRequirements`, `#careerFaq` y `#careerLeadForm`.
- Acceso desde Siglo 21: `showDetail("Universidad Siglo 21")` prepara `currentInstitution`; `renderCareers(inst)` crea la tarjeta y asigna `career-view-button.onclick = () => showCareer(career.id)`.
- `showCareer(careerId)` busca la carrera en `currentInstitution.careers`, asigna `currentCareer`, llama a `hidePages()`, activa `#careerPage`, muestra el footer y llena los nodos estáticos.
- Estado global relevante: `currentCity` (inicialmente `"Concepción"`), `currentInstitution` (inicialmente la primera institución), `currentCareer` (inicialmente `null`), `institutions` y `leads`.
- No hay URL ni parámetro de ruta para esta vista SPA: usa el `career.id` en memoria. La vuelta ejecuta `backToInstitution()`, que llama `showDetail(currentInstitution.name)`.

## 2. Estructura visual completa observada

- Header público global `#siteHeader`, visible al salir de Home; contiene logo, navegación, tema y menú móvil global. No hay un header específico de carrera.
- Botón de regreso: `Volver a la institución`.
- Hero en dos columnas: copia, imagen de carrera y descripción inferior. Incluye institución + ciudad, nombre, título otorgado, hechos y portada. No incluye portada institucional separada.
- Hechos generados: Duración, Sede, Título, Validez, Turnos y Modalidad.
- Navegación horizontal y sticky de secciones: Sobre la carrera, Plan de estudios, Campo laboral, Requisitos e ingreso y Más información.
- Sobre la carrera, Perfil del egresado y tres mensajes fijos de atributos.
- Campo laboral con icono SVG y chips generados.
- Plan de estudios, requisitos y FAQ; el FAQ no es un acordeón interactivo, sino ítems estáticos.
- Aside sticky: formulario de interés, enlace de WhatsApp e información rápida.
- Incluye una imagen principal de carrera e iconos SVG. No tiene galería propia, modal, acordeón, botón flotante específico ni FAQ colapsable.
- El footer global se vuelve visible. El botón flotante de administración pertenece a la aplicación general y permanece oculto fuera de Home.

## 3. Textos canónicos de Abogacía

Los siguientes son textos realmente renderizados con el dato legado de Abogacía y sus valores por defecto de `normalizeCareer`; deben conservarse literalmente al migrar.

- Institución y ciudad: `Universidad Siglo 21 · Concepción`.
- Carrera: `Abogacía`.
- Título que otorga / Título / información rápida: `Abogacía`.
- Descripción y Sobre la carrera: `Formación jurídica con modalidad flexible y acompañamiento tutorial.`
- Duración: `3 años`.
- Sede: `San Martín 124, Concepción`.
- Validez: `Sí`.
- Turnos: `Consultar`.
- Modalidad: `Presencial`.
- Perfil del egresado: `Profesional preparado para aplicar conocimientos y desarrollarse en su área.`
- Campo laboral: `Ámbitos públicos y privados relacionados con la formación profesional.`
- Chips derivados cuando el campo laboral no se puede segmentar: `Instituciones públicas y privadas`, `Organizaciones vinculadas al sector`, `Ejercicio profesional y consultoría`.
- Plan: `Primer año`, `Segundo año`, `Tercer año` (cada ítem se presenta además como `1° Año`, `2° Año` y `3° Año`).
- Requisitos: `DNI`, `Título secundario`, `Formulario de inscripción`.
- FAQ: `¿Cuándo comienzan las inscripciones?` / `Consultá con la institución para conocer las próximas fechas.`; `¿Cómo solicito más información?` / `Podés utilizar WhatsApp o el formulario de esta página.`
- Navegación de secciones: `Sobre la carrera`, `Plan de estudios`, `Campo laboral`, `Requisitos e ingreso`, `Más información`.
- Mensajes fijos: `Formación práctica en entornos reales`, `Docentes especializados`, `Herramientas profesionales actuales`.
- Formulario: `¿Te interesa esta carrera?`, `Dejanos tus datos y la institución se contactará.`, `Nombre y Apellido`, `Teléfono / WhatsApp`, `Email`, `¿En qué turno te interesa?`, `Mañana`, `Tarde`, `Noche`, `Escribí tu consulta (opcional)`, `Hablar por WhatsApp`, `o completá el formulario`, `Enviar consulta`, `Consulta enviada correctamente.`
- Información rápida: `Información rápida`, `Institución`, `Sede`, `Título que otorga`, `Validez`, `Ver más carreras de esta institución`.

## 4. Comportamiento

- `Ver carrera` abre la vista contextual; `Consultar` abre `https://wa.me/` con el número de la oferta si existe y, si no, el de la institución. Si no existe ninguno, muestra la carrera.
- El regreso, el botón inferior y el logo global vuelven a la institución o al inicio según corresponda; el regreso contextual no usa historial del navegador.
- Las pestañas llaman `scrollCareerSection(id)` y desplazan suavemente al bloque indicado.
- El formulario intercepta el envío: `saveCareerLead()` agrega el lead a memoria y a `localStorage`, muestra la confirmación y resetea campos. No hay backend ni alerta para este envío.
- Tema: `applyTheme()` añade o quita `body.dark-theme` y persiste `localStorage.guiaEducativaTheme`. La ficha usa las reglas compartidas de tema oscuro.
- Hover: tarjetas resumen y pestañas tienen transiciones; los controles globales conservan sus estados hover/focus. La ficha no define animaciones propias, salvo el desplazamiento suave de secciones.
- No usa `sessionStorage` en esta vista. Las claves de `sessionStorage` existentes corresponden al Centro de Control, no a Abogacía.

## 5. Datos actuales

### Datos ya presentes en `next-app/app/data/institutions.js`

Dentro de `institutions[id="universidad-siglo-21"].careers` ya existen: `id: "abogacia"`, `slug: "abogacia"`, nombre, descripción, URL de imagen, badge `Inscripciones abiertas`, duración `3 años` y modalidad `Presencial`.

### Datos que permanecen solamente en la demo Vite

La normalización de datos heredados completa en tiempo de ejecución: sede, turnos, título, validez nacional, `about`, perfil, campo laboral, plan, requisitos, FAQ, WhatsApp efectivo y `formEnabled`. También contiene la plantilla HTML completa de la ficha, sus funciones y todas sus reglas CSS.

### A. Carrera maestra propuesta

Para Abogacía: identificador y slug estables, nombre, descripción, `about`, perfil del egresado, campo laboral, plan de estudios, requisitos y FAQ. Estos datos no deberían repetirse por sede salvo que exista una variación canónica explícita.

### B. Oferta institucional propuesta

Para Universidad Siglo 21 + Concepción + Abogacía: institución, ciudad, carrera, imagen usada, badge, modalidad, duración, sede, turnos, título, validez, WhatsApp específico si existiera, `formEnabled`, orden y visibilidad. En la demo, casi todos llegan por valores heredados o por fallback institucional; no hay un WhatsApp específico de oferta.

### C. Datos de institución reutilizables

De Universidad Siglo 21: `id`, `slug`, nombre, logo, tipo, ciudades, plan, slogan, descripción, dirección, WhatsApp institucional, imagen, media y galería. No deben duplicarse dentro de una carrera.

## 6. IDs y slugs

- La demo genera el ID de la carrera legada con `slugifyCareer(name) + "-" + Math.random().toString(36).slice(2, 7)`: para Abogacía es un valor no estable con prefijo `abogacia-`.
- La selección actual se hace por ese ID en memoria; la institución se busca por nombre y la ciudad es estado global.
- Next ya posee `id` y `slug` estables `abogacia`, y la institución tiene `universidad-siglo-21`.
- En la futura migración deben usarse IDs estables para relaciones y slugs para URL, sin mostrar esos identificadores ni alterar textos.

## 7. Formulario

- Campos: nombre (required), teléfono/WhatsApp (required, `inputmode="tel"`), email (required, `type="email"`), turno (select no requerido), consulta (textarea opcional).
- Labels visuales: el formulario depende de placeholders; el select ofrece `¿En qué turno te interesa?`, `Mañana`, `Tarde`, `Noche`.
- Validación actual: validación nativa HTML de los tres campos required y del email; no hay validación adicional.
- Contexto guardado: fecha ISO, institución, carrera, nombre, teléfono, email, turno y consulta. `institution` y `career` vienen de `currentInstitution` y `currentCareer`, no son campos editables.
- Permanece simulado y debe seguir sin generar leads reales en la próxima etapa.

## 8. WhatsApp

- `showCareer` asigna el enlace con el texto `Hola, quiero información sobre Abogacía` y obtiene primero `career.whatsapp`; si no existe, usa `currentInstitution.whatsapp`.
- En Abogacía legada no hay WhatsApp propio: se usa Universidad Siglo 21 (`3865 41 2020`) con prefijo argentino `54` construido en cliente.
- Regla futura aprobada: usar WhatsApp específico de la oferta cuando exista; en caso contrario, el WhatsApp de la institución. No se implementa en esta auditoría.

## 9. CSS y preservación visual

- Fuente global: Poppins; también se importa Geist aunque la ficha usa la familia global.
- Variables compartidas: `--azul`, `--verde`, `--linea`, `--blanco`, `--muted`, `--sombra`, `--radio` y los fondos globales.
- Contenedor: `.career-page-shell` `max-width: 1180px`; el layout usa columnas `1.55fr / 0.65fr`, gap `22px`.
- Hero: `.career-page-hero` dos columnas, borde `var(--linea)`, radio `8px`, fondo `var(--blanco)` y sombra. Imagen `object-fit: cover`, mínimo `315px`.
- Hechos: tres columnas en escritorio; dos en móvil. Las pestañas son sticky (`top: 82px` escritorio, `72px` móvil) y permiten scroll horizontal propio.
- Secciones y sidebar: borde, radio `8px`, fondo blanco y sombras compartidas; sidebar sticky a `top: 92px`.
- Plan: tres columnas; sobre la carrera: dos columnas. A `900px` hero/layout pasan a una columna y sidebar deja de ser sticky; a `720px` hechos, plan y contenido pasan a una columna.
- Tema oscuro: `body.dark-theme` cambia borde y fondo de hero/secciones a `#2c3a4f` y `#111c2e`; header y footer usan reglas globales.
- Riesgos: conservar el orden DOM hero/copy/imagen/descripción, los `id` objetivo de las pestañas, los grids y `min-width: 0`; no reemplazar la navegación horizontal de tabs por un wrap, ni alterar los breakpoints o el sticky.

## 10. Evolución local de datos antes de Supabase

Sin crear archivos aún, la separación recomendada es:

- `app/data/careers.js`: carreras maestras, identificadas por `careerId` estable; contiene contenido académico común.
- `app/data/offerings.js`: ofertas con `offeringId`, `careerId`, `institutionId`, `citySlug`, modalidad, duración, sede, título, turnos, validez, imagen, badge, WhatsApp opcional, orden, visibilidad y estado de formulario.
- `institutions.js`: solo datos institucionales, con referencias a ofertas o sin repetir contenido académico.

La futura página resolvería ciudad + institución + carrera, localizaría una oferta activa que coincida con los tres IDs y combinaría `career + offering + institution`. La relación debe impedir que una carrera válida aparezca en una institución o ciudad que no la ofrece.

## 11. Futura ruta y validación

La ruta prevista `app/[ciudad]/[institucion]/carreras/[carrera]/page.js` debe validar ciudad, institución, carrera y la pertenencia efectiva de la oferta. Cualquier ciudad, institución, carrera o combinación no ofrecida debe responder 404. Todavía no existe ni se programa en esta etapa.

## 12. Componentes futuros posibles

- `CareerPageClient` para tema, navegación de regreso, tabs y formulario simulado.
- `CareerHero`, `CareerFacts`, `CareerSectionTabs`, `CareerDetails`, `StudyPlan`, `CareerLeadForm`, `CareerQuickInfo`.
- Pueden ser componentes servidor salvo los que requieran navegación cliente, scroll, persistencia de tema o envío simulado. No se crean todavía.

## 13. Comparación visual futura

Comparar Vite y Next en 1440 × 900 y 390 × 843, en claro y oscuro. Capturar la ruta contextual abierta desde Siglo 21 para preservar el estado equivalente. Verificar hero, hechos, tabs sticky y desplazables, orden de secciones, sidebar/formulario, footer, sombra, puntos de corte y ausencia de overflow horizontal. No hay zonas de vídeo ni marquee en la ficha; las diferencias legítimas previsibles son rasterizado de fuentes, carga asíncrona de imágenes externas y antialiasing de SVG.

## 14. Archivos previstos para una futura migración

- Crear `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`.
- Crear, solo si el diseño de implementación lo requiere, `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/CareerPageClient.js` y componentes de carrera bajo una carpeta acotada.
- Modificar `next-app/app/data/institutions.js` o, previa autorización, crear `next-app/app/data/careers.js` y `next-app/app/data/offerings.js`.
- Modificar o crear CSS de alcance explícito que replique las reglas canónicas de carrera sin reorganizar `src/styles.css` de Vite.
- Crear documentación y comparaciones bajo `docs/comparaciones/carrera-abogacia-siglo21-concepcion-next/`.

No se deben modificar `index.html`, `src/main.js`, `src/styles.css`, paquetes, lockfiles ni rutas de otras ciudades durante esa futura etapa sin autorización.
