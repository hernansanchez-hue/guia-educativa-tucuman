# Modelo de datos CMS actual
13/10/2026.

admin_profiles: Authid/nombre/rol/estado/can_publish protegido/alta/último login. Email Auth proyectado solo al SUPERADMIN.
cms_documents: identidad estable/module+key únicos, draft/revision/state/publishedVersion/actor/fechas.
cms_versions y cms_audit_logs: inmutables, no UPDATE/DELETE; restore crea borrador. Perfil auditado con Before/After.
cms_redirects: source/destination/status301/302/307/308/origin slug-manual/actor/fecha; sin cadenas ni privados.
cms_media_assets: URL/tipo/alt/mime/peso/dimensiones/path/state/actor; usos incluyen todo historial.
cms_private.editorial_schemas: privada, sin grants directos; INFO RLS intencional.

106 docs:69 core (3ciudades,7marcas,10sedes,19masters,30ofertas),1Home,34extendidos (8eventos,16servicios,6capacitaciones,4singletons),2globales.
119 versiones /119 IMPORT audits /33media. Auth/perfiles0, redirects0, uploads reales0.
Diez snapshots adicionales preservan tarjetas/contextos originales en data.presentation inmutable. Versiones históricas de copy incompatibles conservadas, no restaurables.

Diseño: colores, Poppins/Geist/Arial, tamaños acotados/radio/presets; noCSS libre.
Settings: siteName/description/ogImage/favicon; contactos/redes/logo exclusivamente Footer, no duplicados ni secretos.
SEO: title/description/ogTitle/ogDescription/image/noindex/canonical. Marca/master para SEO general; sede/oferta para local; vacío=canonical automático.

Siete tablas públicas legacy sin cambios. Leads/consentimientos/menores/legal no migrados. Sin descartar assets o historia. Siete migraciones finales aditivas; timestamps locales alineados con MCP, cinco históricas públicas conservan desfase anterior: no db push/reset ciego.
