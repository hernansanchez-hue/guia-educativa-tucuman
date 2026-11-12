# Auditoría inicial para el CMS

Fecha: 12/10/2026. Alcance: repositorio `C:\Codex\GET-production`, Next.js y catálogo Supabase existente. No se repitió ni alteró el trabajo legal. El inventario detallado por archivo/importaciones/exportaciones/recursos está en `ADMIN-SOURCE-INVENTORY.json`, generado por `next-app/scripts/audit-admin.mjs`.

El script revisa 84 archivos JS/CSS de app, catálogo y SEO; incluye dependencias transitivas por página, 18 patrones, 103 paths del catálogo local y 14 archivos en public. Es un escaneo de referencias literales y datos locales, no un parser completo: valores calculados y contenido construido en ejecución requieren revisión manual. Se revisaron además route files, adaptadores, componentes principales, SQL y documentos históricos para contrastar esos resultados.

## Rutas y responsables

| Rutas | Fuentes y responsabilidad actual |
| --- | --- |
| / | page.js llama home-map-catalog; HomeMapClient tiene video, textos, buscador y mapa; departamento/ciudad se define en home-map-catalog |
| /ciudades | cities-catalog + HomeClient; listado y navegación |
| /[ciudad] | city-page-catalog; CityPageClient, CityFeaturedCareers y CityInstitutionSections; slider, orientación, Expo, instituciones y CTA |
| /[ciudad]/[institucion] | institution-page-catalog + institution-offerings-catalog; InstitutionPageClient; hero, ubicación, tarjetas, listado, galería y contacto |
| /[ciudad]/[institucion]/carreras/[carrera] | career-page-catalog; CareerPageClient; logos, hero, tabs, plan, ingreso, formulario/WhatsApp |
| /[ciudad]/[institucion]/capacitaciones/[capacitacion] | training-page-catalog; TrainingPageClient; ficha de programa y consulta |
| /carreras y /carreras/[slug] | careers-catalog; agrupación de ofertas y página SEO; copy de índices/ficha en page.js |
| /instituciones y /instituciones/[slug] | institutions-catalog; agrupación por slug de sedes; InstitutionsIndexClient y ficha SEO |
| /cursos-docentes | teacher-courses-catalog; CoursesClient; listado provincial y filtros; no hay detalle individual |
| /eventos y /eventos/[slug] | data/events.js + páginas; siete registros demostrativos, no inscripción |
| /servicios y /servicios/[slug] | data/services.js, servicePlans y ServiceHero; composición radial, planes y banners |
| /servicios/redes-sociales | Ruta explícita prevalece sobre [slug]; contenido especializado en su page.js |
| /nosotros | page.js concentra propósito, historia, organizaciones y cinco perfiles placeholder |
| /contacto | page.js y ContactForm; formulario comercial con alerta, sin envío confirmado |

Solo existe `app/layout.js` como layout de aplicación. No hay `/admin`, clientes Auth, handlers CMS, proxy/middleware Auth ni rutas API CMS. not-found, robots y sitemap son convenciones aparte del listado de páginas.

## Datos y duplicaciones

| Archivo | Responsabilidad / cantidad |
| --- | --- |
| app/data/institutions.js | 3 cityPages + 10 sedes; contactos, hero, galería y resúmenes careers anidados |
| app/data/careers.js | 19 masters: descripción, perfil, campo, plan, requisitos y FAQ |
| app/data/offerings.js | 30 ofertas contextuales: modalidad, duración, título, turnos, validez, imagen, badge |
| app/data/trainingPrograms.js | 3 programas con contenidos/requisitos/FAQ |
| app/data/trainingOfferings.js | 3 ofertas de capacitación por sede |
| app/data/teacherCourses.js | 10 ofertas docentes provinciales |
| app/data/events.js | 7 eventos demostrativos y filtros |
| app/data/services.js | 15 servicios y 3 planes comerciales temporales |
| app/nosotros/page.js | 6 organizaciones y 5 miembros placeholder en arrays locales |

Los summaries `institutions[].careers` duplican parte de masters/ofertas. `city-page-catalog` sigue requiriéndolos en modo Supabase. Logos institucionales y textos/medios aparecen en componentes además del catálogo. La agrupación SEO de instituciones usa slug; una sede es la fila actual, no una marca global independiente. Mantener scope, IDs y URLs al normalizar.

## Supabase y seguridad actuales

Se confirmó por conector el proyecto documentado `get-definitivo`, activo. Solo se ejecutaron SELECT de estructura, cantidades y políticas. Las siete tablas existentes tienen RLS y acceso SELECT; no existen perfiles/roles/documentos/versiones CMS en public. No se inspeccionaron contraseñas, tokens o datos de usuarios Auth.

Los readers existentes usan REST con `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` e ISR de 60 segundos, seleccionados mediante `PUBLIC_CATALOG_SOURCE`. En este proceso local faltan URL/key y fuente default local; no se cambió configuración. La tabla remota contiene catálogo, pero la app local no se conectó al CMS en esta etapa.

## Medios, marca y diseño

Logo solicitado: `/assets/get-city-footer-logo.png` de `PublicFooter.js`. Está presente y será reutilizado. Video Home vía Cloudinary; imágenes Unsplash; video de ejemplo media.w3.org; assets PNG y GeoJSON locales. No se encontró infraestructura de uploads. Biblioteca futura distinguirá origen local, externo y storage.

Tipografía Poppins, Geist importada y tokens navy `--azul`, dorado `--amarillo`/`--verde`, gris `--gris`, borde `--linea` en globals.css. Header oficial en PublicHeader/PublicFloatingHeader/PublicHeaderFrame; footer compartido; fondos en PublicSiteBackground/SeoAuroraBackground. Evitar editar esos componentes al crear el dominio CMS.

## SEO y puntos a resolver al migrar

- Rutas de catálogo conservan metadata servidor, canonical y Open Graph; ISR de 60 segundos.
- Params estáticos de rutas contextuales están enumerados; actualmente `dynamicParams` no está deshabilitado. No atribuir el bloqueo histórico `dynamicParams=false` al código actual.
- Altas de ciudades requieren hoy mapeo GeoRef; altas de sedes en ciudad remota pueden fallar por summaries locales. El primer piloto debe eliminar su dependencia local con regresión visual.
- Servicios/eventos no declaran metadata propia; heredan layout. El sitemap actual omite estas rutas. Documentado para su fase; no corregido como cambio secundario.
- GA4 se carga globalmente y robots permite todo. Antes de exponer admin habrá que excluirlo de Analytics, fondo y rastreo.
- Las consultas personales siguen en localStorage y el trabajo legal en draft. No crear un backend de leads dentro del CMS como efecto secundario.

## Working tree previo

Modificados antes de esta fase: `app/[ciudad]/[institucion]/institucion.css`, `app/components/PublicSiteBackground.js`, `app/globals.css`, `app/servicios/[slug]/page.js`, `app/servicios/page.js`, `app/servicios/servicios.css` (bajo next-app).

Nuevos previos: `docs/legal/`, `app/components/SeoAuroraBackground.js`, `app/components/ServiceHero.js`, `app/servicios/redes-sociales/`, `lib/legal-config.js` (rutas app/lib bajo next-app). Todos se preservan. Se tomó una huella SHA-256 de 116 archivos existentes para verificar que esta fase no los cambie.
