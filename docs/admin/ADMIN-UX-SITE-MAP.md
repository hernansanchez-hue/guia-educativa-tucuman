# Mapa de edición de GET — revisión 14/10/2026

Este inventario surge de los componentes y lectores públicos actuales. No agrega rutas públicas ni bloques que no existan. El rediseño modifica el administrador; las conexiones editoriales conservan el diseño público.

## Matriz de páginas y bloques

| Página pública | Bloques reales, en orden | Fuente actual | Edición en CMS | Estado / límite |
|---|---|---|---|---|
| `/` | Identidad y video, título, buscador, mapa departamental y selector | `HomeMapClient`, `home-editorial`, catálogo publicado | Home → Identidad y video / Portada / Buscador / Mapa y selector | Editable. El mapa conserva sus 17 departamentos; sus ciudades y cifras proceden del catálogo. Sin footer ni fondo interno. |
| `/ciudades` | Header, presentación y tarjetas de ciudades, footer | `HomeClient`, catálogo de ciudades | Ciudades y Ajustes → Navegación / Footer | Datos de ciudades editables. Textos estructurales del índice siguen en el componente. |
| `/concepcion`, `/monteros`, `/aguilares`, futuras ciudades | Header; slider de carreras; Orientación; Expo; instituciones destacadas; todas las instituciones; propuesta educativa; footer | `CityPageClient`, `CityFeaturedCareers`, `CityInstitutionSections`, documento city | Ciudades → ciudad → secciones en ese mismo orden | Slider antes automático, ahora editable. Se agregaron overrides opcionales de textos, imágenes y visibilidad; se conservan los valores originales si no existen overrides. |
| `/instituciones` | Header, buscador/filtros, catálogo de instituciones, footer | `InstitutionsIndexClient`, agrupación del catálogo publicado | Instituciones | Datos y publicaciones editables. El funcionamiento del índice no se cambia. |
| `/instituciones/[slug]` | Header, presentación, datos de institución; sedes cuando corresponde; oferta; información y relacionadas; footer | Página SEO dinámica, marcas/sedes/ofertas | Instituciones para datos; Ajustes → SEO para metadata de marca | No se crea un editor duplicado ni se cambia su URL. Algunos encabezados de la plantilla siguen siendo estructurales. |
| `/[ciudad]/[institucion]` | Header, hero, Nuestra ubicación, Carreras destacadas, Todas las carreras, galería, contacto y consulta, footer | `InstitutionPageClient`, marca + sede + ofertas | Instituciones → Información / Portada / Contacto / Carreras / Multimedia / SEO | Se muestran carreras asociadas con acceso a sus editores y creación contextual. Datos comunes de marca continúan compartidos. |
| `/carreras` | Header, presentación, catálogo, footer | Página índice y catálogo publicado | Carreras | Datos editables; textos fijos de la plantilla no tienen nuevo documento independiente. |
| `/carreras/[slug]` | Header, hero SEO; datos; instituciones; comparativa; relacionadas; cierre; footer | Página SEO dinámica y catálogo de carreras/ofertas | Carreras y Ajustes → SEO | Conserva la metadata independiente y las URLs actuales. |
| `/[ciudad]/[institucion]/carreras/[carrera]` | Header, hero/ficha, descripción/perfil, salida laboral, plan/PDF, ingreso/FAQ, contacto, formulario, footer | `CareerPageClient`, carrera común + oferta de sede | Carreras → Información / Portada / Datos académicos / Contenido / Plan de estudios / Contacto / Multimedia / SEO | Se mantiene el formulario y su lógica; cambia solo la organización del editor. |
| `/[ciudad]/[institucion]/capacitaciones/[capacitacion]` | Header, presentación, datos académicos, contenidos y requisitos, contacto, footer | `TrainingPageClient`, programa + oferta | Capacitaciones → editor por secciones | Editor existente conservado y reorganizado; creación de capacitaciones nuevas no se inventa en esta fase. |
| `/eventos` | Hero; presencia territorial; próximos eventos; capacidades; alianzas; cobertura; cierre | `EventsPageClient`, contenido de página + eventos publicados | Eventos → Crear evento / Editar página de Eventos | Editor de página separado como acción secundaria. |
| `/eventos/[slug]` | Hero, fecha/lugar/estado, contenido/participantes, multimedia, acción de cierre | `EventDetailClient`, evento publicado | Eventos → Editar | Mismo renderer para vista previa y público. |
| `/servicios` | Hero; composición radial; CTA; planes; lista adicional; footer | `ServicesPageClient`, contenido de página + servicios | Servicios → Editar / Editar página de Servicios | Se mantienen posiciones y diseño radial públicos; no se añade un editor de código. |
| `/servicios/[slug]`, `/servicios/redes-sociales` | Hero de servicio, contenido/recursos, cierre, footer | `ServiceDetailClient`, `ServiceHero`, servicios publicados | Servicios → Información / Portada / Contenido / Cierre / SEO | La ruta especial existente se conserva. |
| `/nosotros` | Nuestro propósito; historia; beneficios; frase; organizaciones; equipo; cierre | `AboutPageClient`, contenido about | Nosotros → secciones de contenido / Organizaciones / Equipo / Cierre / SEO | Se conserva edición por campos y colecciones, sin JSON. |
| `/orientacion-vocacional` | **No existe como página pública en el árbol actual** | Orientación es un bloque de las homes de ciudad | Orientación Vocacional y Ciudades → Orientación vocacional | No se inventa una ruta pública. Imagen y textos compartidos se gestionan en el módulo; overrides locales desde la ciudad. |
| Todas las internas | Header compartido y footer | `PublicHeader`, `PublicFooter`, contexto editorial | Ajustes avanzados → Navegación / Footer | No se cambian sus componentes ni sus estilos públicos en esta fase. |
| `/cursos-docentes`, `/contacto` | Páginas legacy existentes y formularios propios | Archivos públicos actuales | Se conservan; fuera del menú cotidiano | No se habilitan nuevos formularios, legal ni flujos de leads. |

## Elementos antes difíciles de encontrar

- Slider principal: provenía de las primeras cinco propuestas de las instituciones; los tres campos de Hero no permitían administrar sus diapositivas.
- Las secciones de ciudad estaban mezcladas en una pestaña genérica.
- Las carreras de una sede se elegían como destacadas sin acceso claro a su editor desde la institución.
- Banners, navegación, footer, diseño y SEO competían con las tareas cotidianas en el menú.
- Multimedia desplegaba la subida y todos los metadatos en cada tarjeta.
- Usuarios exponía el formulario y los controles de cambio de rol permanentemente.
- Historial mostraba una tabla orientada al registro interno.

## Slider: extensión editorial sin migración de esquema

`city.data.slides` es un listado opcional dentro del documento de ciudad existente. Se guarda con el mismo bundle, revisión optimista, roles, versiones, auditoría y revalidación. No se introduce una tabla, endpoint de publicación ni sistema paralelo.

Mientras no existe `slides`, el renderer usa exactamente las mismas primeras cinco propuestas y el mismo orden. El editor materializa esas propuestas en memoria, con las imágenes, textos, enlaces y tarjetas institucionales actuales; al editar se conserva ese conjunto en el borrador. Abrir el editor no escribe ni publica nada.

Cada diapositiva ofrece título, subtítulo, imagen desde Biblioteca o subida, texto/destino del botón, institución y propuesta relacionada, orden, duplicación, ocultar y eliminar con confirmación. El componente público actual no muestra una etiqueta independiente de la diapositiva; por eso no se agrega un campo de etiqueta que no se renderice. La institución relacionada sigue siendo necesaria para su tarjeta lateral.

## Navegación final

- Inicio: Panel.
- Contenido: Home, Ciudades, Instituciones, Carreras, Capacitaciones, Eventos, Servicios, Orientación Vocacional, Nosotros.
- Recursos: Multimedia.
- Administración: Usuarios según rol, Historial, Ajustes avanzados.
- `/admin/ajustes`: Navegación, Footer, Diseño global, SEO, Configuración general; biblioteca avanzada de banners para SUPERADMIN.

Cursos docentes, Contacto, Formularios y Legal mantienen su infraestructura y su estado anterior fuera del menú cotidiano. Ocultarlos no habilita permisos; los controles reales siguen en servidor y RLS.

## Límites explícitos para la revisión humana

- Un borrador guardado se mantiene privado. Descartar cambios vuelve al último borrador guardado; recuperar una publicación anterior se hace desde Historial con permiso de restauración.
- Los archivos referenciados en borradores o versiones siguen protegidos. Reemplazar una imagen consiste en subir/elegir otra desde su página; no se destruye el archivo de las versiones anteriores. El nombre de archivo se presenta como dato de lectura.
- Los valores de marca/carrera compartidos pueden afectar varias sedes. El editor lo informa.
- El detalle técnico de historial queda en un desplegable de SUPERADMIN; la operación normal usa nombres y fechas.
- La aceptación con una sesión humana real continúa pendiente de que el equipo pruebe esta nueva UX. Las capturas automatizadas utilizan fixtures aisladas, nunca un bypass del administrador real.
