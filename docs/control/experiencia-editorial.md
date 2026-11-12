# Edición en el Centro de Control GET

Entrá en /administrador con tu cuenta habitual. El menú agrupa el trabajo en Inicio, Slider, Instituciones, Carreras, Biblioteca de medios, Borradores, Actividad y Usuarios (según permisos).

- **Slider y destacadas:** se abre el editor, no una lista de ciudades. Buscá la localidad en el selector superior. Se recuerda en esta sesión del navegador. Una diapositiva nueva vincula una oferta de una sede real de la ciudad. No cambia su plan. El nombre visible de una destacada solo afecta la tarjeta.
- **Alta de institución:** guardá el borrador de la institución y su primera sede, revisá su vista previa y publicá cuando esté listo. Para una marca que ya existe usá «Nueva sede». La dirección pública debe ser única. La ciudad de una sede nueva todavía se puede corregir desde su borrador antes de la primera publicación. El cambio de ciudad de una sede ya publicada no se hace como una edición de texto: es un traslado de identidad territorial y requiere revisar enlaces y vínculos comerciales. No se asignan planes por crear o destacar contenido.
- **Carreras:** si la carrera ya existe, elegila y creá su oferta para la sede. Si no existe, creá y publicá primero la carrera general. El título, duración y modalidad de la oferta no cambian los de otras sedes. Las carreras destacadas respetan el límite de cinco de un perfil pago. Una vista previa completa no concede una ficha premium al público.
- **Medios:** usá «Cambiar imagen» para buscar en el catálogo y en las subidas. También podés subir un archivo propio. Los documentos PDF se seleccionan en el campo del plan de estudios. Un borrador no publica su archivo.
- **Borrador, publicación y restauración:** guardar no afecta la web pública. Publicar requiere autorización y revisión vigente. Recuperar una versión anterior genera un borrador para revisar y publicar; no sobrescribe directamente el sitio. Para vincular una nueva sede o carrera desde otro contenido, publicá primero el registro del que depende.
- **Consultas de nuevas altas:** el alta editorial no crea usuarios, tenants, programas ni mapeos en GET Instituciones. Antes de habilitar un destino CRM nuevo, incorporar y verificar sus vínculos en el procedimiento de integración existente.

SQLite local no requiere una migración manual para estas altas. Para habilitar la misma operación en un entorno Supabase, primero ensayar y revisar `habilitar-altas.sql` sobre la instalación de `instalar-en-staging.sql`. Ninguno de los dos se ejecuta automáticamente.

## Archivos de esta etapa

Rutas relativas a la raíz del proyecto. No se modificaron las fuentes de autenticación ni el JSON del catálogo.

- `next-app/app/administrador/CityComposer.js`
- `next-app/app/administrador/control.css`
- `next-app/app/administrador/ControlIcon.js`
- `next-app/app/administrador/CreateContent.js`
- `next-app/app/administrador/editor-actions.js`
- `next-app/app/administrador/editor-ux.css`
- `next-app/app/administrador/Editor.js`
- `next-app/app/administrador/EditorialIcon.js`
- `next-app/app/administrador/InstitutionCareers.js`
- `next-app/app/administrador/layout.js`
- `next-app/app/administrador/media-options.mjs`
- `next-app/app/administrador/MediaControl.js`
- `next-app/app/administrador/navigation.mjs`
- `next-app/app/administrador/page.js`
- `next-app/app/administrador/PlacementDialog.js`
- `next-app/app/administrador/SearchPicker.js`
- `next-app/app/administrador/Tools.js`
- `next-app/app/administrador/useInteractive.js`
- `next-app/app/administrador/Workspace.js`
- `next-app/app/administrador/vista-previa/page.js`
- `next-app/app/administrador/vista-previa/Preview.js`
- `next-app/app/administrador/vista-previa/PreviewMount.js`
- `next-app/app/[ciudad]/CityFeaturedCareers.js` (resolución privada de la foto solo en vista previa)
- `next-app/app/components/approved/ApprovedCareer.js`
- `next-app/app/components/approved/ApprovedProfile.js`
- `next-app/lib/admin/city-slider.mjs`
- `next-app/lib/admin/editorial-model.mjs`
- `next-app/lib/control/creation.mjs`
- `next-app/lib/control/domain.mjs`
- `next-app/lib/control/local-store.mjs`
- `next-app/lib/control/store.js`
- `next-app/lib/control/workspace.mjs`
- `next-app/tests/control-creation.test.mjs`
- `next-app/tests/control-visual-workflows.test.mjs`
- `docs/control/experiencia-editorial.md`
- `docs/control/habilitar-altas.sql`
