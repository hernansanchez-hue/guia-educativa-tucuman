# Auditoría inicial y mapa de migración de GET

Fecha de auditoría: 30 de julio de 2026.

## Alcance y criterio

Esta auditoría toma la demo existente como fuente de verdad visual y funcional. No se modificaron `index.html`, `src/main.js`, `src/styles.css`, `vite.config.js`, `netlify.toml` ni los recursos públicos. Tampoco se inició una migración a Next.js ni una conexión con Supabase.

La copia abierta contiene un proyecto Vite completo y ejecutable para el alcance actual: documento HTML, estilos, lógica JavaScript, configuración de desarrollo y build, lockfile, configuración de Netlify y directorios `src` y `public`.

## Inventario técnico

### Estructura

```text
/
├─ index.html
├─ package.json
├─ package-lock.json
├─ vite.config.js
├─ netlify.toml
├─ README.md
├─ .gitignore
├─ public/
│  └─ .gitkeep
└─ src/
   ├─ main.js
   └─ styles.css
```

`dist/` es un artefacto ignorado por Git que Vite genera al ejecutar el build.

### HTML

- `index.html` contiene en un único documento todas las pantallas públicas, el acceso administrativo, el Centro de Control y el footer.
- Usa HTML semántico en buena parte de la demo (`header`, `nav`, `main`, `section`, `article`, `form`, `footer`) y numerosos SVG inline.
- Carga `/src/styles.css` y `/src/main.js` como módulo.
- Las acciones se conectan mediante atributos inline como `onclick`, `onsubmit`, `onchange` y `oninput`.
- No hay plantillas del lado del servidor ni renderizado React.

### CSS

- Todo el estilo está concentrado en `src/styles.css`.
- Importa Poppins y Geist desde Google Fonts; además existen usos puntuales de Georgia y Arial.
- Define variables globales para la paleta, sombras y radio, entre ellas azul, verde, amarillo, coral, grises y blanco.
- Contiene estilos de todas las pantallas públicas, fichas, formularios, slider, footer, modo oscuro y Centro de Control.
- El responsive está resuelto mediante numerosos breakpoints en `1100`, `1050`, `980`, `900`, `820`, `720`, `414` y `360` px.
- Incluye tratamiento de `prefers-reduced-motion`.
- La visibilidad depende de clases como `hidden`, `active`, `visible` y `open`; estas reglas son parte esencial del comportamiento.

### JavaScript

- Toda la lógica está concentrada en `src/main.js`.
- Implementa estado global mutable, normalización de instituciones y carreras, renderizado mediante `innerHTML`, filtros, navegación, slider, formularios, administración, persistencia local e importación/exportación.
- Expone funciones en `window` para que puedan ser llamadas desde los atributos inline del HTML.
- No utiliza TypeScript, React, router, gestor de estado ni biblioteca de formularios.
- No se detectaron llamadas a Supabase.

### Dependencias

- Dependencia directa de desarrollo: `vite` declarada como `^5.4.11`.
- Versión instalada y resuelta: Vite `5.4.21`.
- Dependencias transitivas principales: esbuild `0.21.5`, Rollup `4.62.3`, PostCSS `8.5.25`, nanoid, picocolors y source-map-js.
- `npm audit` informó 0 vulnerabilidades.
- `npm ls --all` muestra dependencias opcionales no instaladas para plataformas, preprocesadores y minificadores que no se usan; no impiden el build.

### Configuración de Vite

- Host de desarrollo: `0.0.0.0`.
- Puerto de desarrollo: `5173`.
- No hay plugins ni aliases configurados.
- Scripts disponibles: `dev`, `build` y `preview`.

### Configuración de Netlify

- Comando de build: `npm run build`.
- Directorio publicado: `dist`.
- Redirect global `/*` hacia `/index.html` con estado `200`, apropiado para el fallback de una SPA.

### Recursos e imágenes

- `public/` no contiene recursos propios, salvo `.gitkeep`.
- Hero en video alojado en Cloudinary.
- Fotografías remotas alojadas principalmente en Unsplash.
- Poppins y Geist se descargan desde Google Fonts.
- Logos de instituciones sin imagen se representan con iniciales; el Centro de Control admite URLs y cargas de logo, portada, video, galería e imágenes de carreras.
- Existen enlaces externos a WhatsApp y Google Maps.
- El JavaScript contiene nombre de cloud, preset y carpeta de carga de Cloudinary del lado cliente.

## Navegación SPA actual

No hay rutas reales ni cambios de `location`, `history` o hash. Todas las pantallas viven en `index.html`. La navegación llama funciones que ocultan el inicio y quitan/agregan clases a las vistas.

Las vistas controladas son:

- `home`: portada y elección/búsqueda de ciudad.
- `cityPage`: resultados de una ciudad, destacados, filtros y tarjetas de instituciones.
- `detailPage`: ficha de institución, galería y carreras.
- `careerPage`: ficha completa de carrera.
- `coursesPage`: catálogo provincial de cursos docentes.
- `aboutPage`: historia, propósito, beneficios, misión y cierre.
- `eventsPage`: agenda, categorías, filtros, tarjetas y agenda mensual.
- `contactPage`: alta/comercialización para instituciones.
- `loginPage`: acceso al Centro de Control.
- `adminPage`: Centro de Control.

El encabezado de portada y el encabezado interior se alternan. El footer no se muestra en portada, login ni administración; aparece en las vistas públicas interiores.

### Rutas simuladas actuales

| Estado visible | Entrada actual | Parámetro en memoria |
|---|---|---|
| Inicio | `goHome()` | Sin parámetro |
| Instituciones por ciudad | `showCity(city)` | Nombre de ciudad |
| Institución | `showDetail(name)` | Nombre de institución |
| Carrera | `showCareer(careerId)` | Identificador de carrera y la institución actual |
| Cursos docentes | `showCoursesPage()` | Filtros internos |
| Eventos | `showInfoPage("events")` | Tipo de página |
| Nosotros | `showInfoPage("about")` | Tipo de página |
| Contacto comercial | `showInfoPage("contact")` | Tipo de página |
| Login | `showAdminLogin()` / `showAdmin()` | Estado de sesión |
| Centro de Control | `openAdminPanel()` | Vista administrativa actual |

Como la URL no representa el estado, actualizar la página o compartir un enlace siempre vuelve al HTML inicial.

## Páginas y secciones actuales

### Inicio

- Video hero con overlay.
- Marca GET.
- Título principal.
- Buscador de localidad.
- Selector visual de Concepción, Monteros y Aguilares.
- Acceso flotante al administrador.

### Ciudad

- Slider de instituciones destacadas con autoplay, controles, puntos y gesto táctil.
- Título de ciudad.
- Buscador y filtros por modalidad, nivel y área.
- Resultados renderizados como tarjetas.
- Estado vacío.

### Institución

- Portada, logo/iniciales, plan, tipo, descripción, dirección y contacto.
- Galería de fotos.
- Grilla de carreras.
- Acciones de consulta por WhatsApp.

### Carrera

- Hero con imagen, institución, nombre y título.
- Resumen de duración, modalidad, sede, turnos y validez.
- Navegación interna por secciones.
- Sobre la carrera, perfil del egresado y campo laboral.
- Plan de estudios, requisitos y preguntas frecuentes.
- Formulario de interés.
- WhatsApp e información rápida.

### Cursos docentes

- Hero y mensaje comercial.
- Buscador y filtros por institución, modalidad, puntaje, fecha y duración.
- Carruseles de destacados y próximos a iniciar.
- Catálogo paginado mediante “cargar más”.
- Estado vacío.
- CTA para instituciones.

### Nosotros

- Hero.
- Historia en secuencia.
- Beneficios y motivos de existencia de GET.
- Misión.
- Cierre visual.
- Animaciones de aparición con alternativa para movimiento reducido.

### Eventos

- Hero.
- Búsqueda y filtros por ciudad, categoría, modalidad y fecha.
- Categorías.
- Próximos eventos.
- Agenda mensual.
- CTA para publicar eventos.

### Contacto

- Presentación para sumar instituciones.
- Formulario de consulta comercial.
- Explicación del modelo comercial.

### Centro de Control

- Login.
- Dashboard con métricas, jerarquía ciudad/institución y consultas recientes.
- Gestión de ciudades: alta, edición, eliminación y orden.
- Gestión del slider principal.
- Gestión de instituciones.
- Editor completo de datos generales, sedes, plan, textos, contacto y medios.
- Gestión de galería.
- Gestión detallada de carreras.
- Gestión y borrado de consultas.
- Configuración preparada para logo, datos generales, footer, SEO, Analytics y usuarios.
- Exportación/importación de respaldo JSON.
- Restauración de los datos originales.
- Vista pública y cierre de sesión.

Varias acciones futuras muestran alertas de “próximamente” o “preparado” y todavía no tienen backend.

## Menús

- Encabezado interior: Inicio, Eventos, Nosotros y Cursos Docentes.
- Variante móvil con apertura/cierre del menú.
- Botón de cambio de tema.
- Botones de retroceso entre ciudad, institución y carrera.
- Tabs internos de la carrera.
- Navegación lateral y vistas internas del Centro de Control.
- Footer con exploración, contacto, futuras apps y redes.

## Formularios

| Formulario | Función actual |
|---|---|
| Búsqueda de ciudad | Filtra tarjetas de ciudad en el DOM |
| Búsqueda de instituciones | Filtra instituciones hardcodeadas o guardadas |
| Interés en carrera | Guarda un lead en `localStorage` |
| Filtros de cursos | Filtra `teacherCourses` en memoria |
| Filtros de eventos | Muestra/oculta tarjetas HTML |
| Consulta comercial | Evita el envío y muestra un `alert` |
| Login administrativo | Compara credenciales hardcodeadas |
| Editor de institución | Actualiza el estado en memoria y `localStorage` |
| Editor de carrera | Actualiza el estado en memoria y `localStorage` |
| Cargas multimedia | Envía archivos directamente a Cloudinary |
| Importar respaldo | Lee un JSON local y reemplaza datos de la demo |

No hay validación de servidor, envío de correo, base de datos ni protección real de acciones administrativas.

## Datos hardcodeados

- 7 instituciones iniciales con tipos, ciudades, planes, textos, direcciones, WhatsApp, medios y carreras.
- 3 ciudades iniciales: Concepción, Monteros y Aguilares.
- 10 cursos docentes con fechas, puntaje, duración, estado e institución.
- 6 eventos visibles en HTML y agenda mensual.
- Plantillas de noticias.
- Banco de 11 imágenes remotas.
- Textos editoriales, datos de contacto, enlaces del footer y número general de WhatsApp.
- Credenciales administrativas.
- Configuración de carga de Cloudinary.
- Valores por defecto de carreras, FAQs, requisitos y planes de estudio.

## Almacenamiento del navegador

### `localStorage`

| Clave | Contenido |
|---|---|
| `guiaEducativaInstitutions` | Instituciones, carreras y medios editados |
| `guiaEducativaLeads` | Consultas enviadas desde carreras |
| `guiaEducativaCities` | Ciudades y su orden administrativo |
| `guiaEducativaTheme` | `light` o `dark` |

Las lecturas JSON usan fallback cuando faltan datos o el contenido es inválido. No hay versionado ni migración de esquema local.

### `sessionStorage`

| Clave | Contenido |
|---|---|
| `guiaEducativaAdminSession` | Valor `active` para habilitar el panel durante la pestaña actual |

## Modo claro y oscuro

- El tema se aplica con la clase `dark-theme` sobre `body`.
- La preferencia se persiste en `localStorage`.
- El botón actualiza `aria-label` y `title`.
- Hay reglas oscuras específicas para navegación, páginas, tarjetas, formularios, carreras, cursos, eventos, footer y administración.
- La migración debe preservar tanto las reglas globales como las excepciones por pantalla; no alcanza con trasladar sólo las variables de color.

## Responsive

- Hay reglas específicas para escritorio, tablet, móvil y anchos muy pequeños.
- Cambian grillas, navegación, menú, carruseles, fichas, formularios, administración y footer.
- Algunos elementos se ocultan en móvil y otros tienen variantes exclusivas.
- El slider contempla gestos táctiles.
- La migración debe validarse al menos en los breakpoints existentes y en tamaños intermedios, incluyendo `360`, `414`, `720`, `820`, `900`, `980`, `1050` y `1100` px.

## Correspondencia propuesta con Next.js

Las rutas son una propuesta técnica futura; no se implementaron en esta etapa.

| Pantalla actual | Ruta futura sugerida |
|---|---|
| Inicio | `/` |
| Ciudad | `/ciudades/[ciudad]` |
| Institución | `/instituciones/[institucion]` |
| Carrera | `/instituciones/[institucion]/carreras/[carrera]` |
| Cursos docentes | `/cursos-docentes` |
| Ficha futura de curso | `/cursos-docentes/[curso]` |
| Eventos | `/eventos` |
| Ficha futura de evento | `/eventos/[evento]` |
| Nosotros | `/nosotros` |
| Contacto / sumar institución | `/sumar-institucion` |
| Login administrativo | `/centro-de-control/login` |
| Dashboard | `/centro-de-control` |
| Ciudades | `/centro-de-control/ciudades` |
| Slider | `/centro-de-control/slider` |
| Instituciones | `/centro-de-control/instituciones` |
| Editor de institución | `/centro-de-control/instituciones/[institucion]` |
| Consultas | `/centro-de-control/consultas` |
| Configuración | `/centro-de-control/configuracion` |

Los slugs deberán ser estables y no depender de IDs aleatorios generados en cada normalización.

## Componentes React futuros sugeridos

### Estructura compartida

- `AppHeader`, `HomeHeader`, `MobileMenu`, `ThemeToggle`.
- `SiteFooter`.
- `PageShell`, `SectionHeader`, `EmptyState`.
- `Button`, `FormField`, `SelectField`, `SearchField`.

### Inicio y navegación pública

- `HomeHero`, `CitySearch`, `CityGrid`, `CityCard`.
- `FeaturedInstitutionsSlider`, `FeaturedInstitutionSlide`.
- `InstitutionFilters`, `InstitutionGrid`, `InstitutionCard`.
- `InstitutionHero`, `InstitutionGallery`, `CareerGrid`, `CareerCard`.
- `CareerHero`, `CareerSummary`, `CareerSectionNav`, `StudyPlan`, `CareerFaq`, `CareerLeadForm`.

### Contenido

- `TeacherCoursesHero`, `CourseFilters`, `CourseCarousel`, `CourseCard`, `CourseList`.
- `AboutHero`, `AboutTimeline`, `AboutBenefits`, `AboutMission`.
- `EventsHero`, `EventFilters`, `EventCategories`, `EventGrid`, `MonthlyAgenda`.
- `CommercialContactForm`.

### Centro de Control

- `AdminShell`, `AdminSidebar`, `AdminHeader`.
- `AdminDashboard`, `MetricCard`, `AdminHierarchy`.
- `CitiesManager`, `SliderEditor`, `InstitutionsManager`.
- `InstitutionEditor`, `MediaUploader`, `GalleryEditor`, `CareerEditor`.
- `LeadsTable`, `AdminSettings`, `BackupManager`.

La separación debe hacerse pantalla por pantalla, manteniendo primero el mismo DOM y las mismas clases para reducir diferencias visuales.

## Riesgos de migración

1. **Regresión visual por fragmentación del CSS.** El archivo actual acumula reglas globales, reglas por pantalla y overrides tardíos; cambiar el orden puede alterar la cascada.
2. **Pérdida de estado al convertir navegación simulada en rutas.** Hoy la institución y carrera activas dependen de variables globales.
3. **Identificadores inestables.** Las carreras legacy pueden recibir un sufijo aleatorio al normalizarse.
4. **Hidratación y APIs del navegador.** `window`, `document`, `localStorage`, `sessionStorage`, `IntersectionObserver`, `FileReader` y `XMLHttpRequest` requieren límites claros de componentes cliente.
5. **HTML dinámico.** Gran parte del contenido se genera mediante plantillas de `innerHTML`; su conversión a JSX debe conservar estructura, clases, orden y textos.
6. **Autenticación insegura.** Usuario y contraseña están visibles en el bundle y la sesión sólo existe en `sessionStorage`.
7. **Carga pública a Cloudinary.** El preset de carga se usa desde el navegador; debe revisarse su alcance y restricciones antes de un entorno productivo.
8. **Persistencia frágil.** Editar o borrar contenido sólo afecta el navegador actual y puede perderse al limpiar datos.
9. **Dependencia de servicios externos.** Video, imágenes y fuentes requieren red; fallos externos afectan la apariencia.
10. **URLs compartibles.** La demo no tiene rutas reales; introducirlas puede cambiar la forma de volver atrás, actualizar y conservar filtros.
11. **Responsive complejo.** Existen muchos bloques responsive superpuestos y variantes móviles.
12. **Centro de Control amplio.** Mezcla edición, carga, navegación, métricas, leads y respaldos en un solo módulo global.
13. **Acciones incompletas.** Cursos y eventos no tienen fichas reales, el contacto comercial no envía datos y varias configuraciones sólo muestran alertas.
14. **Versión de runtime.** El proyecto declara Node 18 o superior y fue validado con Node `24.18.0`; conviene definir una versión LTS objetivo para CI y Netlify.
15. **Ausencia de pruebas automatizadas.** No hay tests unitarios, de integración, E2E ni de regresión visual.

## Elementos de especial cuidado visual

- Hero inicial: video, overlay, altura, marca, búsqueda y tarjetas de ciudad.
- Dos encabezados y sus reglas de aparición.
- Slider destacado: proporciones, autoplay, controles, puntos, swipe y pausas.
- Grillas y tarjetas de instituciones/carreras.
- Portadas, galerías y recortes de imágenes.
- Tabs y estructura extensa de ficha de carrera.
- Carruseles y lista tabular de cursos.
- Animaciones de Nosotros y preferencia de movimiento reducido.
- Filtros, tarjetas y agenda de Eventos.
- Modo oscuro completo, no sólo el fondo global.
- Menú móvil, elementos exclusivos/ocultos y breakpoints pequeños.
- Centro de Control: sidebar, jerarquía, editores, previews, tablas y formularios.
- Footer completo y sus cambios responsive.
- Tipografías Poppins/Geist, pesos, alturas de línea, variables de color, sombras, radios y espaciados.

## Orden propuesto de migración

Cada punto debe ser una etapa independiente, con validación visual y autorización antes de avanzar.

1. Congelar una línea base visual: capturas de todas las pantallas en claro/oscuro y anchos representativos; registrar flujos funcionales.
2. Crear el shell mínimo de Next.js y trasladar únicamente tokens, fuentes y estilos globales, sin cambiar la demo fuente.
3. Migrar encabezados, navegación móvil, tema y footer.
4. Migrar Inicio.
5. Migrar Ciudad y slider destacado.
6. Migrar Institución.
7. Migrar Carrera y formulario de interés todavía con datos de prueba.
8. Migrar Cursos Docentes.
9. Migrar Nosotros.
10. Migrar Eventos.
11. Migrar Contacto comercial.
12. Migrar login y shell visual del Centro de Control sin backend.
13. Migrar módulos administrativos de uno en uno.
14. Validar paridad visual y funcional completa, incluyendo responsive, tema y accesibilidad básica.
15. Sólo después de aprobar la paridad visual, diseñar el modelo de datos y evaluar la conexión con Supabase en una tarea separada.

## Resultado de validaciones

- `npm install`: correcto; dependencias al día, 12 paquetes auditados, 0 vulnerabilidades. El hash de `package-lock.json` no cambió.
- Node: `v24.18.0`.
- npm: `11.16.0`.
- `npm run dev`: dentro del sandbox falló con `spawn EPERM` al intentar iniciar esbuild. Con autorización fuera del sandbox, Vite permaneció ejecutándose hasta el límite temporal de la prueba. Se usó el puerto temporal `5174` porque `5173` apareció ocupado durante una comprobación; no se cambió `vite.config.js`.
- `npm run build`: dentro del sandbox presentó el mismo `spawn EPERM`; fuera del sandbox finalizó correctamente con Vite `5.4.21`, 4 módulos transformados y salida en `dist/`.
- Build generado: HTML de aproximadamente `80.98 kB`, CSS de `89.83 kB` y JavaScript de `56.69 kB` antes de gzip.
- Variables de entorno: no existen archivos `.env` en la raíz y no se detectaron referencias a `import.meta.env`, `process.env`, `VITE_`, `NEXT_PUBLIC` ni Supabase.

## Problemas encontrados sin corregir

- Credenciales administrativas hardcodeadas y visibles en el cliente.
- Autenticación basada únicamente en `sessionStorage`.
- Configuración de carga de Cloudinary expuesta al cliente.
- Datos y ediciones limitados al navegador local.
- Sin rutas reales ni soporte nativo para enlaces profundos.
- Formularios y funciones futuras parcialmente simulados mediante alertas.
- Puerto `5173` ocupado durante una comprobación del entorno.
- El sandbox impide por política el proceso auxiliar de esbuild; desarrollo y build requieren ejecución autorizada fuera de él en este entorno.
- No hay pruebas automatizadas ni captura base de regresión visual.
- No hay variables de entorno ni una versión de Node fijada en `.nvmrc` o `engines`.

## Próximo paso recomendado

Realizar una etapa separada de línea base visual y funcional: levantar la demo sin modificarla, capturar sistemáticamente cada pantalla en modo claro y oscuro y en los breakpoints críticos, y convertir los flujos actuales en una lista de aceptación. Después de revisar y aprobar esa evidencia, iniciar sólo el shell mínimo de Next.js en una etapa nueva, sin Supabase y sin migrar todavía todas las páginas.
