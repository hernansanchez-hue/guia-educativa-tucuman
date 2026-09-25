# Arquitectura de sedes independientes

## Auditoría del modelo anterior

`institutions.js` utilizaba `institution.id` simultáneamente como identificador interno, referencia desde `cityPages`, clave de la resolución institucional, discriminador de navegación y, por igualdad accidental, slug público. Las offerings también apuntaban a esos IDs. `CityPageClient.js` e `InstitutionPageClient.js` contenían comparaciones directas contra los mismos valores.

Los lugares donde se asumía `id = slug` eran los tres registros validados de Concepción, las listas `institutionIds` y `featuredInstitutionIds`, la tabla `institutionPages`, el control de navegación de las cards, las condiciones de las cards de carrera y las diez referencias `offering.institutionId`. Las URLs visibles ya se construían con `institution.slug` y no requieren cambios.

## Modelo adoptado

Cada sede validada posee `id` interno único, `citySlug` propietario y `slug` público repetible entre ciudades. La convención local estable es `<slug-publico>-<citySlug>`.

Los IDs de Concepción son `universidad-siglo-21-concepcion`, `instituto-santa-barbara-concepcion` e `ies-concepcion-concepcion`. Sus slugs públicos continúan siendo `universidad-siglo-21`, `instituto-santa-barbara` e `ies-concepcion`.

`getInstitutionPage(citySlug, institutionSlug)` resuelve directamente por `institution.citySlug + institution.slug`. La ruta contextual de carrera reutiliza esa sede y obtiene la offering mediante `citySlug + institution.id + careerId`. Los diez IDs públicos de offering se conservan; solo cambia su referencia interna `institutionId`.

## Compatibilidad y alcance

Las rutas públicas no cambian. `generateStaticParams()` conserva las rutas validadas y `/monteros/universidad-siglo-21` permanece fuera de alcance y en 404. La card temporal de Siglo 21 en `/monteros` conserva la referencia visual existente hasta incorporar el registro independiente de Monteros; entonces podrá reemplazarse por otro ID con el mismo slug sin colisión.

No se modifican `CareerPageClient.js`, carreras maestras, contenidos, CSS, DOM ni responsive. La regresión obligatoria cubre Home, Ciudades, Concepción, Monteros, las tres instituciones y las diez carreras de Concepción, además de combinaciones inválidas.

## Futuro Supabase

El modelo se traduce a una sede con ID/UUID, `city_id` y slug público. Una marca puede tener varias sedes con el mismo slug en ciudades distintas; las offerings referencian el ID interno de sede y el `careerId`. Las enumeraciones locales deberán reemplazarse posteriormente por registros publicados desde Centro de Control/Supabase.

## Regresión ejecutada

`npm run lint` y `npm run build` finalizaron correctamente; el build conserva 20 páginas estáticas. En producción temporal respondieron 200 Home, `/ciudades`, `/concepcion`, `/monteros`, las tres instituciones y las diez carreras contextuales de Concepción. Permanecieron 404 `/aguilares`, todas las fichas institucionales de Monteros, instituciones y carreras inexistentes, y carreras válidas bajo contextos incorrectos.

La regresión visual se comprobó estructuralmente contra las evidencias existentes de `/concepcion`, Siglo 21, Santa Bárbara, IES, carreras de las tres instituciones y `/monteros`. El diff de clientes solo cambia comparaciones de identidad internas: el DOM visible, textos, URLs, clases, badges, claro/oscuro y responsive no cambian. No fue necesario regenerar capturas.
