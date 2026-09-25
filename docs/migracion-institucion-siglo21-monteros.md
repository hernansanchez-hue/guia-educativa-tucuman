# Auditoría — Universidad Siglo 21 · Monteros

## Identidad canónica Vite

La primera institución visible de Monteros es Universidad Siglo 21, Privada, con marca `US21`, imagen `imageBank.siglo`, portada institucional y sus cuatro carreras resumidas: Abogacía, Contador Público, Lic. en Administración e Higiene y Seguridad. La demo usa la ciudad actual como contexto; la ruta pública esperada es `/monteros/universidad-siglo-21`. Comparte marca, nombre y recursos visuales generales con Concepción, pero es una sede independiente.

## Datos canónicos de Monteros

La demo Vite usa la misma entrada canónica de Universidad Siglo 21 para sus tres ciudades. Para Monteros muestra literalmente: tipo Privada, logo `US21`, portada `imageBank.siglo`, media «Video institucional», slogan «Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.», descripción «Educación innovadora, profesional y conectada con el mundo.», dirección «San Martín 124, Concepción» y WhatsApp `3865 41 2020`. No hay web ni horarios definidos. La galería es `imageBank.siglo`, `imageBank.students`, `imageBank.classroom`, `imageBank.graduation`.

Las tarjetas resumidas y sus badges, en orden, son Abogacía / Inscripciones abiertas; Contador Público / Nueva carrera; Lic. en Administración / Próximo ingreso; Higiene y Seguridad / Inscripciones abiertas. Los datos de dirección que la demo comparte son una inconsistencia canónica visual y se preservan, sin agregar elementos visibles nuevos.

## Bloqueo arquitectónico anterior

La arquitectura local actual no puede representarla como sede independiente sin mezclar datos:

* `institutions.js` contiene un único registro con ID y slug `universidad-siglo-21` y ciudades múltiples.
* `cityPages.monteros` referencia ese mismo ID que Concepción.
* `getInstitutionPage()` obtiene la institución solo por `institutionId` después de resolver la clave ciudad/slug; no existe un registro de sede distinto.
* `InstitutionPageClient.js` habilita las cuatro rutas contextuales de Siglo 21 usando ese ID, con URLs fijas de Concepción.
* `offerings.js` y las rutas de carreras están asociadas a `institutionId: universidad-siglo-21` y `citySlug: concepcion`; reutilizar el registro produciría datos de Concepción o rutas erróneas en Monteros.

Por ello no se modifica `institutions.js`, rutas, `InstitutionPageClient.js`, carreras u offerings. Las tres fichas restantes de Monteros permanecen 404 y la tarjeta de Siglo 21 sigue solo como tarjeta de ciudad.

## Propuesta mínima futura

Mantener el slug público `universidad-siglo-21` dentro de cada ciudad, pero usar IDs internos de sede distintos —por ejemplo `universidad-siglo-21-concepcion` y `universidad-siglo-21-monteros`— y resolver las rutas por `citySlug + publicSlug`. Las offerings deben depender del ID de sede, no de la marca. Esto protege las diez carreras de Concepción y mapea directamente a futuros registros/campus de Supabase con `city_id`, `slug` y offerings independientes.

La arquitectura de sedes independientes quedó integrada en `sedes-independientes-validada-v1`. Monteros se incorpora como `id: universidad-siglo-21-monteros`, `citySlug: monteros`, `slug: universidad-siglo-21`, mientras Concepción conserva `id: universidad-siglo-21-concepcion`. La resolución pública usa ciudad + slug; las carreras contextuales Monteros y sus offerings siguen fuera de alcance.

La plantilla institucional, CSS, header, volver, portada, marquee, cards, badges, footer, temas y responsive se reutilizan sin cambios.
