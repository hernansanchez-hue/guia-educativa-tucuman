# Arquitectura del catálogo público GET

Fecha de decisión: 2026-10-20.

## Fuente pública actual

La fuente oficial temporal para ciudades, instituciones, sedes, carreras y relaciones es el catálogo versionado:

- `next-app/lib/catalog/public-catalog.json`
- `next-app/lib/catalog/versioned-public-catalog.mjs`

La instantánea contiene 638 documentos editoriales aprobados y proyecta:

- 27 ciudades/localidades;
- 93 marcas institucionales;
- 125 sedes;
- 195 carreras maestras;
- 198 ofertas territoriales;
- 128 referencias de oferta universitaria general.

El archivo integra primero los datos validados de Concepción, Monteros y Aguilares y después la expansión provincial. Los campos existentes más completos, las selecciones comerciales y los planes Premium prevalecen sobre datos importados incompletos.

## Prioridad y entornos

El catálogo versionado es la fuente del sitio público tanto en desarrollo como en producción. `NETLIFY=true` no cambia ni desactiva los datos. `PUBLIC_CATALOG_SOURCE` no selecciona el catálogo utilizado por las rutas públicas actuales.

Las páginas de ciudad, institución y carrera, los directorios, el mapa, la búsqueda, los filtros, los metadatos y el sitemap derivan del mismo catálogo. Supabase no es necesario para resolver las 27 ciudades ni sus relaciones académicas.

## CMS y Supabase

El CMS, Auth, perfiles administrativos, RLS, borradores y versiones no se eliminan. Durante esta etapa no son la fuente obligatoria del catálogo académico público. Los módulos editoriales no académicos pueden continuar usando la infraestructura existente sin fusionarse con los registros del catálogo versionado.

No se ejecutaron migraciones ni escrituras remotas para esta decisión.

## Datos públicos y seguridad

La instantánea contiene únicamente información institucional apta para web. Se excluyen notas de prospección, estados comerciales internos, comentarios operativos, credenciales y rutas locales. Las instituciones incorporadas desde el padrón son normales por defecto; no adquieren Premium ni posiciones destacadas.

Las imágenes locales referenciadas están dentro de `next-app/public/`. Las referencias externas conservadas corresponden a recursos públicos ya aprobados.

## Actualización controlada

Una actualización del catálogo debe:

1. partir de la instantánea versionada vigente;
2. preservar datos validados más completos y decisiones Premium;
3. validar identidades de ciudad, sede, marca, carrera y oferta;
4. rechazar notas internas, secretos y rutas locales;
5. ejecutar las pruebas de catálogo, rutas, sitemap, búsqueda y plantillas;
6. revisar los conteos antes y después;
7. publicar el nuevo archivo mediante un commit auditable.

## Migración futura al CMS

La transición futura prevista es:

`VERSIONED PUBLIC CATALOG → IMPORT TO CMS → VALIDATE → SWITCH SOURCE`

El cambio de fuente deberá ser explícito y autorizado. Antes de activarlo se compararán conteos, relaciones, slugs, Premium, rutas, metadatos y sitemap. No se mezclará automáticamente el catálogo versionado con documentos remotos porque eso podría crear duplicados o degradar datos aprobados.
