# ADMIN/CMS — Macrofase 4: continuación autorizada

2026-10-13 · **Desarrollo de los módulos restantes implementado; aceptación con sesión real pendiente. Sin publicación Git/Netlify.**

La autorización explícita permite continuar módulos consecutivos en esta macrofase y exceptúa la pausa entre etapas. Home aprobada no se repitió. Se continuó con los módulos permitidos sin bypass de Auth ni cambios de leads, legal, localStorage de consultas, consentimientos o menores.

## Informe de los 59 puntos

| Nº | Punto | Resultado y límite de evidencia |
| --- | --- | --- |
| 1 | Estado SUPERADMIN | Bloqueado: clave privada local ausente. Email previsto hernan@guiaeducativatuc.com.ar; Auth users 0 y admin_profiles 0 al cierre. |
| 2 | Invitación | NO enviada. No se inventó password, clave ni administrador alternativo. |
| 3 | Login real | Pendiente con persona real. Login disponible; 20 rutas privadas comprobadas con redirección anónima al login. |
| 4 | Logout | Implementación segura anterior preservada; recorrido con sesión humana pendiente. |
| 5 | Recuperación | Página disponible, reset anónimo denegado; entrega de email/callback/cambio real pendientes. |
| 6 | RLS con usuario real | Pendiente. Sí aceptación SQL con identidades/sesiones temporales y rollback, sin bypass de la app. |
| 7 | Draft con usuario real | Pendiente. Dominio, RPC SQL y UI aislada prueban separación borrador/publicado. |
| 8 | Publish con usuario real | Pendiente: no se afirma HTTP autenticado → publicación → revalidación de punta a punta. |
| 9 | Home Admin | Etapa ya aprobada, no repetida. Editor singleton existente preservado; selector de recursos compartido reutilizado. |
| 10 | Home Live Preview | Renderer original y preview privado existentes preservados. Página /, video, mapa y fuentes Home no modificados en esta continuación. |
| 11 | Eventos | 7 eventos reales del contenido de demostración existente + página principal. Listado/búsqueda/ciudad/estado, editor, Hero gráfico, fechas/lugar, instituciones, galería/video opcional, CTA, SEO, archivo/duplicado. |
| 12 | Servicios | 15 servicios + página principal/planes. Orden, textos, gráficos originales, fotografía opcional, overlay/altura/alineación limitados, CTA y galería. Crear/duplicar/archivar conservando identidad estable. |
| 13 | Capacitaciones | 3 programas + 3 ofertas/sedes. Editor raíz + programa compartido, información, requisitos/FAQ, fechas, WhatsApp de contenido, PDF/material opcionales, SEO/visibilidad. Página y resúmenes institucionales leen snapshots. Sin wizard nuevo de capacitación ni cambios de leads. |
| 14 | Nosotros | Textos reales extraídos a data, mismas secciones/fotos. Equipo y organizaciones editables con filas, ordenar/arrastrar/agregar/ocultar; no personas inventadas. |
| 15 | Orientación Vocacional | Contenido actual, imagen, ciudades, CTA y visibilidad. Estado limitado a Próximamente. Sin inscripción, leads, menores ni consentimientos nuevos. |
| 16 | Banners | Índice real con filtros, miniaturas, página/tipo/estado/última edición. Enlaces al Hero del documento dueño; no documentos duplicados ni variantes genéricas nuevas. |
| 17 | Multimedia | Biblioteca funcional implementada: buscar/tipo/origen/uso, seleccionar/reutilizar, alt, drag/drop, progreso, upload y eliminación protegida. Upload/limpieza con sesión real pendientes. |
| 18 | Storage elegido | Único sistema para nuevos uploads: bucket privado cms-media existente de Supabase, RLS. Imágenes ≤5 MB; MP4/PDF/DOCX/TXT ≤50 MB en servidor local. Validar límites efectivos del hosting antes de producción. |
| 19 | Assets legacy | 33 recursos registrados sin copiar/descargar: 3 locales, 29 externos y 1 Cloudinary. Archivos originales intactos. |
| 20 | Upload | Extensión + MIME + peso + firma binaria; imágenes decodificadas con límite de píxeles, documentos descargables con nosniff/CSP. API exige origen permitido y sesión/permiso real. Progreso XHR. Validación real de transporte/Storage pendiente por Auth. |
| 21 | MediaPicker | Un selector compartido en todos los EditorField de imagen/galería/video/PDF/documento, incluso campos compartidos de los editores anteriores. Selección → preview comprobada en harness. |
| 22 | Menús | Enlaces actuales, texto/destino/orden/visibilidad y Cursos Docentes. Placeholder conectado también a los buscadores propios de ciudad e institución. Destinos internos desconocidos advertidos. Home mapa y cabecera de logos de carrera siguen diferenciadas. |
| 23 | Footer | Editor público real: logo/columnas/textos/links/redes/contacto/recursos. Navbar y branding Admin heredan el logo del footer; advertencia explícita. / continúa sin footer. |
| 24 | SEO nuevos | Title/description/OG title/OG description/image/noindex para páginas nuevas; canonical automático y vista Google aproximada. Menús/Footer/Orientación son bloques, no URLs autónomas: conservan SEO del dueño. No SEO global avanzado. |
| 25 | Redirects | Mapa por identidades estables; eventos/servicios/programas y descendientes usan redirects 308 guardados junto con publicación. No cadenas. Lector de redirects etiqueta también módulos nuevos. |
| 26 | Versiones | Mismo cms_versions inmutable. 107 snapshots. Las 3 primeras importaciones estructurales normalizadas se conservan por auditoría; el editor no ofrece restauración de snapshots incompatibles con el esquema actual. |
| 27 | Audit | Mismo cms_audit_logs: 107 IMPORT permanentes al cierre. Mutaciones editoriales y multimedia registran actor DB verificado; no actor ficticio de migración. |
| 28 | Permisos | SUPERADMIN/ADMIN/EDITOR existentes. Servidor y RLS verifican identidad/sesión/perfil activo. Publish mantiene override protegido; delete media solo SUPERADMIN. Borradores/registro media privados. |
| 29 | Contenido importado | 34 documentos nuevos, exclusivamente contenido existente. Extracción de copias corregida con parser JSX/AST y migración versionada no destructiva; se preservó la historia inicial. |
| 30 | Total documentos | 104 = 69 core + 1 Home + 34 nuevos. 104 con versión publicada; 107 versiones/audits. Tablas públicas anteriores sin cambios. |
| 31 | Fallbacks restantes | CMS + seed legacy temporal por documento ausente para módulos extendidos/core. Tombstones publicados/archivados impiden resurrección. Fallo de consulta configurada no se oculta. Home mantiene su lector estricto. Detalle abajo. |
| 32 | Fuente CMS | Snapshots publicados controlan core, Home y todos los módulos visuales nuevos cuando existe el documento. Banners es índice; biblioteca media es registro de recursos, no segunda fuente editorial. |
| 33 | Módulos legacy | Cursos Docentes y Contacto comercial aún legacy. Formularios/Legal pendientes; Diseño/SEO global/Usuarios/Historial avanzado/Configuración fuera de esta macrofase. |
| 34 | Publicación sin deploy | Implementada por DB + tags/paths; ninguna escritura Git/Netlify desde el flujo editorial. Aceptación humana integral pendiente. |
| 35 | Revalidación | cms:events/services/trainings/about/orientation/navigation/footer; rutas del dueño y descendientes; sitemap para páginas con slug. Home propio conserva cms:home + /. No revalidatePath('/', 'layout'). Tags de bloques globales pueden recachear consumidores del layout. |
| 36 | Live Preview | Mismos renderers públicos, iframe privado común para extendidos; postMessage verifica origen/emisor/id/identidad de partes y payload. Click/foco→resaltado; navegación/submit de preview interceptados para no generar leads. |
| 37 | Desktop | QA 1440px para extendidos; core también 1280/1024px. Renderers/banner gráfico conservados. |
| 38 | Tablet | 768px en módulos nuevos y públicos; sin overflow. |
| 39 | Mobile | 390px; editores abren preview modal, biblioteca/índice adaptados. Overflows detectados y corregidos únicamente en Admin. |
| 40 | Tests nuevos | 25 tests Node agregados en extended/media (23 iniciales + 2 publicación/enlaces). 131 checks SQL nuevos; UI aislada 48 vistas/7 interacciones. |
| 41 | Tests CMS total | 64/64 PASS, incluidos 39 existentes. |
| 42 | Suite total | 169 tests: 156 PASS, 13 FAIL preexistentes. Ningún fallo nuevo. |
| 43 | Fallos anteriores | 11 comparaciones institution-page-catalog (nationalValidity/shape) + 2 public-routes-catalog (fixtures de sitemap 51 vs 79 y rutas antiguas). No se cambiaron esos fixtures. |
| 44 | Fallos nuevos | 0 al cierre. Durante desarrollo: extracción regex sustituida por AST, fixtures visuales ajustados y 2 overflows Admin corregidos. |
| 45 | SQL checks | 131 nuevos + 24 core + 21 Home = 176 PASS, siempre rollback. Reimportación idempotente deja 104/107/107. Fixtures Auth/perfiles/archivos no persisten. |
| 46 | Lint | PASS, 0 errores y 9 warnings anteriores no-img-element; 5 ahora localizados en renderer Nosotros extraído y 1 en Servicios extraído. |
| 47 | Build | PASS: next build --webpack, compilación/112 páginas estáticas y rutas privadas dinámicas. |
| 48 | TypeScript | Chequeo integrado del build PASS; proyecto mayormente JavaScript, sin errores nuevos de tipos/compilación. |
| 49 | Next.js / vulnerabilidad | 16.4.0 existente del working tree preservado; versión del hosting no verificada (sin deploy). npm audit --omit=dev: 0 vulnerabilidades. Audit completo: 7 altos de tooling dev, 0 críticos; sin instalar ni degradar dependencias. |
| 50 | Migraciones nuevas | 3 en esta continuación: extended_editorial, normalización versionada de copias, media_library. Home anterior no reaplicado. |
| 51 | Migraciones aplicadas | 20261013042233, 20261013043500, 20261013050258 confirmadas remotas y nombres locales alineados. Desfase histórico de timestamps de las 5 migraciones públicas antiguas no alterado. |
| 52 | Supabase remoto | Sí: CMS/schemas/snapshots/registro media/RLS/bucket existente. Solo get-definitivo zomoblpgurchkxvkkutj; sin DNS/variables Netlify/tablas públicas legacy. |
| 53 | Git add | NO. |
| 54 | Commit | NO; HEAD e4f4da5085612e80c60ecd8843f4b3ecd817c166. |
| 55 | Push | NO. |
| 56 | Deploy | NO. |
| 57 | Porcentaje real | 13/22 módulos del roadmap con pantallas funcionales (59,1%). Desarrollo de los 10 módulos B de esta macrofase implementado, contando Home anterior. No es 100% de aceptación/producción: Auth y prueba real upload/publish siguen pendientes. |
| 58 | Pendientes | Credencial privada local, invitación/confirmación SUPERADMIN, login/logout/recovery y publicación/revalidación/upload reales; límites del hosting. Limpieza de fallbacks documentada para etapa final. No bloqueo del desarrollo ya realizado. |
| 59 | Macrofase final | Activación/aceptación humana segura; hardening transporte/upload/monitoreo y recovery; gestión Usuarios/configuración, diseño global, SEO global avanzado, historia avanzada y retiro controlado de fallbacks. Legal/leads solo tras revisión y autorización. No se inició automáticamente. |

## Fuente de verdad y retirada del fallback

- Home: snapshot home/main para copy/SEO. Lector estricto con configuración; mapa geográfico/estadísticas siguen su catálogo anterior, no GeoRef nuevo.
- Core Ciudades/Instituciones/Carreras: snapshots CMS; variantes locales iniciales se mantienen mientras no hay modificación explícita compartida. Son las mismas reglas de fase 3.
- Eventos/Servicios/Capacitaciones/Nosotros/Orientación/Menús/Footer: **CMS + fallback legacy temporal por documento faltante**. Las 34 semillas están importadas; por tanto el contenido actual proviene del CMS. El seed solo permite continuidad en hosts sin configuración o migraciones incompletas. Un tombstone no usa el seed y un error remoto configurado falla explícitamente.
- Capacitaciones: programa compartido + oferta, padres core; pequeños resúmenes iniciales conservan exactamente la variante visual legacy y se actualizan al cambiar sus datos CMS. Formularios y almacenamiento de consultas intactos.
- Orientación: contenido global con overrides de ciudad ya existentes, ambos editoriales; la inscripción sigue Próximamente.
- Header: Home mapa tiene identidad propia; navbar flotante comparte Navigation; cabecera con logos de carrera conserva su composición propia. Footer administra el logo usado por navbar/Admin y no aparece en /.
- Banners: accesos al Hero del dueño, no almacén paralelo.
- Media: URLs existentes permanecen locales/externas/Cloudinary; nuevos archivos van a Supabase privado. Los usos incluyen drafts y todas las versiones, incluso archivadas: una eliminación no rompe restauraciones. No se borraron assets.
- Retirada propuesta del fallback: comprobar cobertura completa y aceptación humana, retirar seed por módulo en una migración futura revisada. No editar archivos legacy y CMS como dos fuentes paralelas de forma permanente.

## Seguridad, limitaciones y evidencia

Los nuevos uploads usan el mismo bucket privado. DELETE solo se permite después de reservar una eliminación sin referencias bajo el mismo advisory lock de la publicación. Un trigger impide introducir el recurso en un draft mientras se elimina. Legacy sin uso solo se desregistra, nunca se borra físicamente. UPDATES de Storage no habilitados; no se sobrescribe un archivo publicado.

La UI de test vive exclusivamente en un servidor aislado 127.0.0.1:4015 con NODE_ENV=test y fixtures, no en Next ni Supabase. Los botones draft/publish del harness son simulaciones expresamente rotuladas. No equivalen a login real ni a uploads o publicación HTTP de producción. Los 176 checks SQL usan sesiones temporales en transacción y siempre rollback. El servidor local real continúa protegido.

MIME/extensión/firma se comprueban en servidor; el cuerpo se limita antes de parsear, imágenes se decodifican con límite de píxeles. PDF/DOCX/TXT se entregan como attachment con nosniff/CSP; MP4 admite Range. **El límite de 50 MB es del servidor local/bucket: antes de producción hay que validar el límite de request, memoria y tiempo del deployment actual.** No se afirma transporte de archivos grandes en Netlify validado.

Advisors Supabase: sin WARNING/ERROR de seguridad. INFO intencional: editorial_schemas es privada, con RLS sin políticas y sin permisos directos para anon/authenticated; se accede solo por validadores SECURITY DEFINER. [Explicación del linter](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy). Performance: 4 índices sin uso (3 previos + índice nuevo de actor media); no se eliminaron índices por una estadística de uso inicial. [Referencia](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index).

Durante la extracción inicial de copy se detectaron valores JSX incorrectos. Se reemplazó el extractor regex por AST, se importaron las copias correctas como versión 2 de tres singletons y se preservaron versión 1/audits. No hubo deploy del frontend durante ese intervalo. Versiones incompatibles permanecen visibles por auditoría, con restauración deshabilitada por esquema.

QA público: 21 vistas de 7 rutas ×1440/768/390 (Eventos, evento, Servicios, Redes Sociales, Nosotros, capacitación y Concepción), con igualdad de encabezados/imágenes/enlaces y sin overflow. Regresión core: 35 layouts Admin y 12 rutas/vistas reales, sin errores de JS. Home se revalidó además en 4 layouts Admin y 3 públicos: video/mapa presentes, sin footer ni líneas; no fue una nueva implementación. QA nuevo: 48 layouts Admin y 7 interacciones, sin errores de JS. Revisión de capturas de editores, Menús y Multimedia realizada.

Rutas privadas reales nuevas /admin/eventos, servicios, capacitaciones, nosotros, orientacion-vocacional, banners, multimedia, menus, footer y API/preview responden a anónimos con login y no-store/noindex. /admin/login no incluye Analytics, footer ni background público. No se tocó el consentimiento Analytics público.

## Estado final y archivos

Inventario completo: [ADMIN-MACROPHASE-4-FILES.json](ADMIN-MACROPHASE-4-FILES.json). Preservación: ningún archivo anterior desapareció; Home, documentos legales y cambios ajenos a esta continuación conservan sus hashes. El working tree sigue con los cambios anteriores y esta macrofase, sin staging. Los únicos estilos nuevos de esta continuación son privados del Admin; CSS público/fondos/animaciones originales intactos.

Localhost: http://localhost:4004/admin/login y http://localhost:4004/concepcion. Sin credencial privada la entrada a editores exige una sesión válida y no existe usuario admin alternativo.

Se detiene antes de la macrofase final. Git add: NO · commit: NO · push: NO · Netlify: NO.

<details>
<summary>Histórico: informe de la primera etapa Home, anterior a esta autorización</summary>

# ADMIN/CMS — Macrofase 4, primera etapa: Home

12/10/2026 · Estado: **parcial, no aceptada como macrofase completa; no publicada en Git/Netlify**.

## Alcance y motivo de la pausa

Se leyeron el pedido completo, AGENTS.md, el informe y el inventario de macrofase 3. La credencial privada de Auth no existe en el entorno local; la cuenta prevista todavía no existe en Auth y hay cero perfiles. No se recuperaron claves desde CLI, Management API ni herramientas remotas.

El pedido autoriza continuar la parte B de forma segura cuando falta esa credencial, pero mantiene expresamente la excepción por exigencia de AGENTS.md. Ese archivo ordena no migrar todo en una tarea y detenerse al finalizar cada etapa. Se completó únicamente la primera etapa de B, **Home**, y se detuvo antes de Eventos/Servicios y demás módulos. No se presenta una pausa por reglas del proyecto como un CMS terminado.

## Informe de los 59 puntos

| Nº | Punto | Resultado y límite de evidencia |
| --- | --- | --- |
| 1 | SUPERADMIN | NO activado. Email configurado: hernan@guiaeducativatuc.com.ar; nombre local configurado. Auth0/profiles0. |
| 2 | Invitación | NO enviada: falta SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY privada local. No contraseña inventada. |
| 3 | Login real | NO probado con persona real; /admin/login funciona y los guards anónimos redirigen. |
| 4 | Logout | Implementación previa preservada; recorrido con sesión humana pendiente. |
| 5 | Recuperación | Página disponible y reset anónimo denegado. Entrega/callback/cambio/sesión real pendientes. No se cambió configuración Auth. |
| 6 | RLS con usuario real | Pendiente. Sí 21 comprobaciones SQL nuevas y 24 anteriores con fixtures temporales, siempre rollback; no equivalen a login humano. |
| 7 | Draft con usuario real | Pendiente. Borrador Home probado en dominio, SQL y UI aislada. |
| 8 | Publish con usuario real | Pendiente; no se afirma Server Action → revalidation → HTTP autenticado probado. |
| 9 | Home Admin | /admin/home, misma EntityEditor/AdminShell; identidad singleton protegida, sin wizard/duplicado/retirada. |
| 10 | Home Live Preview | HomeMapClient público original; iframe privado /admin/vista-previa/home con CSS de Home aislado. Video y mapa originales. |
| 11 | Eventos | NO migrados en esta etapa. Página pública y Hero aprobado intactos; Admin permanece deshabilitado. |
| 12 | Servicios | NO migrados. Redes Sociales conserva su Hero gráfico; no convertido a genérico. |
| 13 | Capacitaciones | NO migradas. Contexto de padres CMS anterior preservado; contenidos/formularios legacy sin cambios. |
| 14 | Nosotros | NO migrado. Equipo5 y resto de contenido público intactos. |
| 15 | Orientación Vocacional | NO módulo propio nuevo. Campos de ciudades previos siguen; no inscripción ni datos de menores. |
| 16 | Banners | Pendiente; no fuente duplicada ni índice ficticio. |
| 17 | Multimedia | Biblioteca completa pendiente; selector/upload de imágenes previos siguen disponibles. |
| 18 | Storage | cms-media privado existente, imágenes PNG/JPG/WebP ≤5 MB, sujeto a RLS. No nuevo bucket. |
| 19 | Assets legacy | Preservados; Home sigue con logo local y video Cloudinary. No copia masiva de archivos. |
| 20 | Upload | Implementación previa reutilizada; upload real con sesión/registro/limpieza pendiente. No se probó ni se afirma biblioteca nueva. |
| 21 | MediaPicker | Selector existente reutilizado para el logo; thumbnail oscuro SOLO en Admin/Home para ver el logo blanco. Videos usan URL, todavía no upload de video. |
| 22 | Menús | NO editor nuevo. Solo se habilitó Home en sidebar; navegación pública intacta. |
| 23 | Footer | NO editor nuevo ni cambio del footer. / sigue sin footer. Logo oficial Admin preservado. |
| 24 | SEO nuevos | Home: title, description, OG title/description/image, noindex, canonical automático /, preview Google explícitamente aproximado. Valores iniciales idénticos. |
| 25 | Redirects | Arquitectura previa conservada; Home no tiene slug editable ni genera redirect para /. Nuevos módulos aún pendientes. |
| 26 | Versiones | Home usa cms_versions existente; importación1 y snapshots por publicación. Restaurar produce draft. |
| 27 | Audit | Home usa cms_audit_logs existente; IMPORT atribuido a migración, no usuario ficticio. UPDATE_DRAFT/PUBLISH comprobados en rollback. |
| 28 | Permisos | requireAdmin por acción y RPC/RLS existentes; anon no lee drafts/escribe, EDITOR guarda y no publica; ADMIN publica; diseño requiere permiso protegido previo. |
| 29 | Importación | 1 Home exacta, idempotente, no destructiva. Segunda ejecución no duplica ni sobrescribe. |
| 30 | Total CMS | 70 documentos, 70 versiones importadas, 70 auditorías IMPORT; 69 anteriores intactos. |
| 31 | Fallbacks | Home seed solo sin configuración; host configurado sin snapshot/fallo informa error. Mapa/buscador de Home todavía usa lector geográfico actual, no se migró esquema GeoRef. Otros módulos legacy pendientes. |
| 32 | Fuente CMS | Ciudades, Instituciones, Carreras de fase3; ahora contenidos y SEO Home publicados. Datos geográficos/estadísticas/search Home siguen en lector anterior. |
| 33 | Legacy | Eventos, Servicios, Capacitaciones, Nosotros, Orientación propia, Banners, Menús, Footer, Cursos docentes, Contacto y otros módulos. |
| 34 | Sin deploy | Servicio real preparado; SQL snapshot funciona. Prueba HTTP autenticada/revalidation con cuenta real pendiente. No deploy. |
| 35 | Revalidación | Publicación Home llama updateTag('cms:home') y revalidatePath('/'); no layout global, sitemap ni rutas ajenas. Rama de otros módulos conserva cms:catalog y paths existentes. |
| 36 | Live Preview | Cambios sin guardar, resaltado y click-to-edit; selección favorece elemento más cercano, scroll solo al cambiar campo, no en cada tecla. Origen/ventana/id/identidad validados. |
| 37 | Desktop | Home real 1440; Admin1440/1280. Geometría logo/título igual al antes; sin overflow. |
| 38 | Tablet | Home y Admin768; preview viewport768; sin overflow. |
| 39 | Mobile | Home y Admin390; modal de preview usa390 y no desborda. Diseño/responsive públicos no modificados. |
| 40 | Nuevos tests | 6 Node de Home; 21 SQL rollback; 4 layouts + 7 interacciones Home UI aislada + 3 Home reales + 2 guards HTTP. No bypass Auth en Next real. |
| 41 | CMS total | 39/39 Node PASS (33 anteriores +6). |
| 42 | Suite total | 144: 131 PASS, 13 FAIL. No se oculta exit1 de la suite total. |
| 43 | Fallos previos | Mismos11 fixtures institution-page-catalog nationalValidity y2 public-routes-catalog sitemap; no se retocaron esas expectativas. |
| 44 | Fallos nuevos | Cero finales en dominio/lint/build. Errores de selectores/status/espera del nuevo test visual corregidos; no fallos públicos nuevos detectados. |
| 45 | SQL checks | 21/21 nuevos +24/24 regresión. Test previo cuenta69 de sus módulos originales, no Home; mismo alcance comprobado. Fixtures sin persistencia. |
| 46 | Lint | PASS: 0 errores, 9 warnings no-img-element previos. |
| 47 | Build | PASS Next16.4.0 webpack,110 páginas estáticas y nuevos endpoints admin dinámicos. |
| 48 | TypeScript | Verificación de Next completada sin error; proyecto JS, no migrado a TS. |
| 49 | Next seguridad | Next16.4.0 conserva corrección crítica anterior. npm audit runtime:0; completo:7 altos de herramientas dev,0 críticos. No cambios de paquetes. |
| 50 | Migración nueva | 20261012184642_cms_home_editorial_v1.sql; creada por CLI y timestamp alineado con remoto. Extiende guard/bundle existentes y añade guard/índice singleton/importación Home. |
| 51 | Aplicada | Sí, únicamente get-definitivo. Advisor seguridad:0 avisos. |
| 52 | Remoto | Sí, CMS Home +funciones/guard/índice. Tablas públicas previas siguen cities3/institutions10/careers19/offerings30. Auth/perfiles reales no modificados. |
| 53 | Git add | NO. Índice vacío. |
| 54 | Commit | NO. HEAD e4f4da5085612e80c60ecd8843f4b3ecd817c166. |
| 55 | Push | NO. Rama next-production-candidate. |
| 56 | Deploy | NO; Netlify/DNS/config/variables no tocados. Local4004 sigue activo. |
| 57 | Porcentaje | Cobertura objetiva:4/22 módulos con editor (18,2%), no equivale a CMS completo. B nueva:1 de10 módulos implementado en esta etapa; aceptación humana de A pendiente. No se inventa un porcentaje global de calidad. |
| 58 | Pendientes | Credencial privada, invitación/confirmación/promoción y sesión real; HTTP/publicación/upload autenticados. Después, restantes módulos B por etapas o autorización expresa para exceptuar AGENTS.md. |
| 59 | Macrofase final | Solo tras completar B y sesión: diseño/SEO global avanzado, usuarios UI, historial avanzado, configuración, retirada controlada de fallbacks, legal/leads y hardening. NO se avanzó automáticamente. |

## Home: preservación de la página aprobada

Se auditaron las secciones REALES: identidad y video, título, buscador, mapa y panel de provincia/departamento. Se exponen textos, logo/alt, video/visibilidad, etiquetas del selector, ajustes seguros de título/logo/overlay y SEO. No se inventaron CTA, bloques comerciales ni footer; enlaces y estadísticas siguen derivados del catálogo real. El orden es estructural dentro de una misma composición interactiva, por lo que no se ofrece drag & drop para desarmarla.

El documento importa los valores exactos y ningún diseño inline inicial. home-map.css, globals.css y CSS de instituciones no se modificaron. Las capturas antes/después y métricas de logo/título coinciden en1440/768/390; el video cambia de fotograma normalmente.

## Evidencia reproducible

- node --test tests/admin*.test.mjs →39/39.
- node --test tests/*.test.mjs →131/144;13 preexistentes; exit1.
- supabase/tests/cms_home_editorial_v1.sql →21 PASS, ROLLBACK.
- supabase/tests/cms_editorial_visual_v1.sql →24 PASS, ROLLBACK.
- scripts/check-admin-home-visual.mjs →Home Admin fixture4 layouts/7 interacciones, Home pública real3 tamaños y2 guards. Ninguna sesión humana simulada en el CMS real.
- scripts/check-admin-visual.mjs →regresión35 layouts/9 interacciones y12 vistas públicas reales; acciones admin test-only.
- scripts/check-admin-http.mjs →guards y8 rutas públicas200, login sin footer/fondo/GA, recovery disponible, reset anónimo denegado.
- npm run lint / npm run build / npm audit --omit=dev / git diff --check.

## Archivos y entrega

Inventario completo: ADMIN-MACROPHASE-4-FILES.json. Cambios previos conservados, sin borrar archivos. Las imágenes de QA están en la carpeta de visualizaciones de Codex. Las vistas del Admin están expresamente identificadas como fixtures, no como una cuenta real habilitada.

No corresponde aceptar toda la macrofase como terminada. Para continuar todos los módulos automáticamente se requiere resolver la instrucción explícita de detención por etapa de AGENTS.md; para Auth, configurar la credencial privada local sin enviarla al chat.


</details>
