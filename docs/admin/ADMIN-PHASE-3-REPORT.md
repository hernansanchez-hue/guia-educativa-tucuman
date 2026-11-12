# Informe macrofase 3 — GET CMS

12/10/2026 · Estado: implementación local lista para revisión, aceptación real bloqueada por alta inicial. **NO terminado al 100% / NO publicado.**

## Informe de los 60 puntos solicitados

| Nº | Punto | Resultado y límite de evidencia |
| --- | --- | --- |
| 1 | AGENTS.md y alcance | Se respetó preservar la demo pública, analizar antes de modificar e informar archivos. La macrofase autoriza shell + tres editores, importación y Supabase existente; no otras macrofases. Next actualizó automáticamente su bloque next-app/AGENTS.md. |
| 2 | Dependencia Next.js | 16.2.12 → 16.4.0, misma major, eslint-config-next alineado y lockfile. npm audit --omit=dev: 0; audit completo: 0 críticos, 7 altos de herramientas dev. No force upgrade. |
| 3 | SUPERADMIN | NO activado; cero perfiles. Email/nombre reales confirmados por el usuario y guardados solo en .env.local ignorado. La identidad todavía no existe en Auth. |
| 4 | Activación faltante | Agregar SUPABASE_SECRET_KEY (o legacy service_role) al entorno privado. La CLI no tiene sesión. Luego invite, confirmación email/contraseña propia, promote y login. Revisar redirects/plantillas en ADMIN-SETUP.md. No enviar secretos por chat. |
| 5 | Login | Página profesional real /admin/login, logo oficial, formulario Auth. HTTP 200/noindex sin GA/fondo/footer públicos. Sesión válida con persona real: pendiente. |
| 6 | Logout | Server Action/Auth y auditoría de fase 2 preservados. Comprobación real desde sesión humana: pendiente. |
| 7 | Recuperación | UI y acciones disponibles, /admin/recuperar 200, reset anónimo denegado. Entrega de email/reset con cuenta real: pendiente. |
| 8 | Sidebar | 22 módulos registrados; tres activos, demás deshabilitados/Próximamente, Legal revisión pendiente. Colapso y drawer probado. |
| 9 | Dashboard | Consultas reales de cantidad/estado/actividad importada; no fake counts. Fallos de consulta no se disfrazan de cero. UI de QA con fixtures explícitas separadas. |
| 10 | Responsive Admin | 35 combinaciones (siete vistas × 1440/1280/1024/768/390), sin overflow; drawer, colapso, modal mobile y 12 revisiones reales de login/páginas públicas. |
| 11 | Ciudades | Listado/búsqueda, editor por tabs, Hero/textos/destacados/orden/visibilidad/diseño/SEO, wizard con preview privado antes de guardar. Avanzado protege cambio de slug. |
| 12 | Instituciones | Marca común + sede, nombre/logo/portada/contactos/horarios/Maps, galería, elección de carreras destacadas, ciudad humana, publicación y preview comunes. |
| 13 | Carreras | Master + oferta/sede: contenidos, título/duración/modalidad, ingreso/FAQ, salida laboral, plan estructurado, PDF, imagen/video/fallback, badges y diseño/SEO. Fechas/CTA avanzados no se inventaron. |
| 14 | Importación | Idempotente y auditable desde las fuentes aprobadas; repetida dentro de rollback sin crear más registros ni sobreescribir drafts. |
| 15 | Datos migrados | 69 docs/snapshots: 3 ciudades + 7 marcas + 10 sedes + 19 masters + 30 ofertas. 69 auditorías IMPORT. Las siete tablas públicas existentes no se sobrescribieron. |
| 16 | Fallbacks | Legacy para host sin configuración/entradas no importadas y summaries aprobados no editados. Tombstones impiden resurrección. Contenido de capacitaciones/Home/otros módulos sigue legacy; contexto/rutas de capacitaciones hereda padre CMS. |
| 17 | Live Preview | Renderers públicos reales en iframe privado con estilos propios, estado sin guardar, validación postMessage y guard. No navegación comercial ni submit de leads. |
| 18 | Resaltado | Campo enfocado marca elemento con outline discreto y scroll nearest solo en preview; probado con teléfono. |
| 19 | Click-to-edit | Click en nombre/elemento relacionado selecciona tab/campo; origen/ventana/editor verificados. No todos los textos anónimos tienen mapeo granular. |
| 20 | Desktop preview | 1440 px reales, escalados al panel; altura del iframe coincide con visor, sin corte al final. |
| 21 | Tablet preview | 768 px reales; CSS responsive del renderer, no simplemente encoger una captura. |
| 22 | Mobile preview | 390 px reales; en modal pequeño se selecciona móvil automáticamente, con useSyncExternalStore compatible con SSR y sin alturas Infinity. |
| 23 | Full preview | Popup privado y modal mobile; estado live comunicado a la ventana válida. Probados en el harness. |
| 24 | Borradores | Guardar cambia draft/revisión, no snapshot. Marca discreta de campos sucios, advertencia al salir y descarte local; probados. |
| 25 | Publicación | Confirmación e impacto común, bundle atómico, revisión optimista, constraints de identidad/ruta/relaciones. Servicio real implementado; interacción UI simulada solo en tests. |
| 26 | Versionado | Snapshots inmutables por publicación; import explícito actor migration, sin atribución humana falsa. |
| 27 | Historial | Versiones/fechas/autor humano o importación, restauración a draft, no sobrescribir publicado. |
| 28 | Audit | CREATE/UPDATE_DRAFT/PUBLISH/RESTORE/ARCHIVE/UNPUBLISH, Auth y IMPORT; no passwords/tokens/payload completo de usuarios. |
| 29 | Revalidation | updateTag CMS + rutas específicas anteriores/posteriores, índices y sitemap; sin layout global ni deploy. Llamada real autenticada no probada por falta de cuenta. |
| 30 | Publicación sin deploy comprobada | NO de punta a punta HTTP con persona real. Sí snapshot público por SQL y confirmación UI simulada; falta ejecución de Server Action/revalidation con cuenta. |
| 31 | Teléfono Siglo 21 | Sí en Node, preview/highlight/click-to-edit y SQL draft→snapshot dentro de rollback. NO en sesión Auth real/HTTP publicado persistente. |
| 32 | Abogacía | Sí descripción compartida/preview y SQL draft→publicado en rollback. No confirmación HTTP real persistente. |
| 33 | Concepción/descartar | Sí inmutabilidad/local reset y SQL conservar publicado/restablecer draft. UI descarte probado; no sesión humana todavía. |
| 34 | SEO básico | Title/description/OG/noindex, canonical automático, Google Preview. Metadata dinámica de entidades y sitemap conectados a publicado; SEO global futuro. |
| 35 | Diseño básico | Imagen, color/presets, título limitado 32–80, alineación/global y visibilidad. Sin CSS/JS/HTML libre; overlay/fondo por entidad avanzado no implementado. |
| 36 | Media picker | Assets/logo oficial/imágenes reales y upload privado JPG/PNG/WebP ≤5 MB. RLS de medios y referencia publicada probados; upload real con cuenta pendiente. |
| 37 | RLS | SELECT por perfil activo y escrituras por RPC autorizado. Cada parte, incluso sin cambios, verifica permiso. Anon solo publicado/media publicada. |
| 38 | Seguridad | 24 controles SQL nuevos PASS/ROLLBACK; advisor seguridad cero avisos. Roles/session checks de fase 2 preservados; 40 controles históricos. Reejecución extensa fase 2 falló por requestState del conector, no se computa como ejecución exitosa actual. |
| 39 | Tests nuevos | 13 Node de modelo editorial, 24 SQL, HTTP guards, harness browser aislado y scripts reproducibles. Sin fixtures/runtime bypass en Next real. |
| 40 | Tests CMS | 33/33 Node PASS; 24/24 SQL actuales PASS. Fixtures Auth/perfiles/contenido de prueba no persistentes. |
| 41 | Suite completa | 138 tests: 125 PASS y 13 FAIL preexistentes. Suite NO totalmente verde. |
| 42 | Fallos preexistentes | 11 comparaciones institution-page-catalog nationalValidity (undefined vs Sí), 2 sitemap V1 (51 vs 79 y exclusión de rutas ampliadas). No se alteraron fixtures ajenos. |
| 43 | Fallos nuevos | Cero finales en CMS/lint/build. Se corrigieron errores encontrados de componente anidado, link, overflow accesible y efecto de estado; conector tuvo timeout/requestState. |
| 44 | Lint | PASS, 0 errores; 9 warnings preexistentes no-img-element (cursos docentes/nosotros/servicios). |
| 45 | Build | PASS; generación de 110 páginas y rutas admin dinámicas, Next 16.4.0 webpack. |
| 46 | TypeScript | Paso de verificación de Next completado sin error. Proyecto implementado en JS; no equivale a migrarlo a TypeScript. |
| 47 | Archivos creados | Lista completa en ADMIN-PHASE-3-FILES.json; UI, dominio/servicios, preview/media, harness/tests, cinco migraciones e informe. |
| 48 | Archivos modificados | Inventario exacto separado de archivos previos; lectores/renderers con props opcionales, catálogo/sitemap, auth layout, dependencias/config y docs. .env.local ignorado solo identidad/origen; sin secret. |
| 49 | Migraciones nuevas | Cinco; nombres/timestamps enumerados en ADMIN-DATA-MODEL.md e inventario. Generadas con CLI y sincronizadas al historial remoto. |
| 50 | Migraciones aplicadas | Las cinco aplicadas a get-definitivo. No reset, reseed destructivo, db push ciego, sitio/proyecto nuevo ni cambio de DNS. |
| 51 | Supabase remoto afectado | SÍ, deliberadamente: extensiones CMS/redirects, bucket/policies e importación69. Catálogo público previo conserva 3/10/19/30 y capacitaciones/cursos intactos. Perfiles0. |
| 52 | Visual público involuntario | No detectado: regresión de summaries/ciudades y navegadores reales pasan. Campos opcionales no cambian valores iniciales; no rediseño de público. |
| 53 | Cambios previos | Huella de 165 archivos antes de macrofase; modificaciones solo en scope declarado. Legal, servicios/banners/aurora, institution.css, globals.css, contratos y pruebas previos se preservan. |
| 54 | Git add | NO; índice sin archivos. |
| 55 | Commit | NO; HEAD e4f4da5 conserva el commit previo. |
| 56 | Push | NO; rama next-production-candidate sin publicación. |
| 57 | Deploy | NO; no se tocó Netlify/config/DNS. Dev localhost:4004 queda disponible; servidor visual aislado se detiene. |
| 58 | Porcentaje real | Estimación macrofase ~85%, no aceptada 100% por bloqueo de cuenta/recorrido real. Shell95, Auth85, Ciudades90, Instituciones90, Carreras85, Preview95, Media60. Cobertura objetiva3/22=13,6%; no confundir con CMS completo. |
| 59 | Pendientes | Activar cuenta, probar Auth/mail/upload y recorrido real publicar→HTTP/revalidation; refinamientos avanzados/GeoRef. Otros19 módulos, Home/Servicios/Eventos/Capacitaciones/Cursos, biblioteca completa, diseño/SEO global, usuarios UI, Legal y Leads. |
| 60 | Próxima macrofase | Primero cerrar aceptación real de ESTA fase tras configurar credencial privada y confirmar cuenta. Solo después recomendar Home/Servicios/Eventos + biblioteca media. No avanzar automáticamente. |

## Evidencia reproducible

- `node --test tests/admin*.test.mjs` → 33 PASS.
- `node --test tests/*.test.mjs` → 138, 125 PASS, 13 fallos previos.
- `supabase/tests/cms_editorial_visual_v1.sql` → 24 PASS, BEGIN/ROLLBACK.
- `node scripts/check-admin-http.mjs` → nueve superficies privadas denegadas a anónimo; login/recovery y ocho públicas disponibles.
- `scripts/admin-visual-harness.mjs` + `scripts/check-admin-visual.mjs` → 35 layouts, nueve interacciones UI y doce vistas de rutas reales. Acciones admin simuladas exclusivamente en test.
- `npm run lint`, `npm run build`, `npm audit --omit=dev`, advisors Supabase y `git diff --check`.

## Dependencias

La actualización corrige los avisos que afectaban Next instalado; referencias: [Windows RCE](https://github.com/advisories/GHSA-p293-qw3h-jr36), [next/og](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j). Persisten siete avisos altos en herramientas dev (brace-expansion/braces/js-yaml y cadena de ESLint), no en dependencias runtime según audit omit-dev. No se ejecutó npm audit fix --force.

## Archivos y capturas

El inventario JSON enumera cada archivo creado/modificado de esta macrofase y distingue los cambios previos preservados. Capturas reales de QA en la carpeta de visualizaciones de Codex; los screenshots del panel están rotulados como fixtures, no una cuenta real habilitada.
