# Arquitectura Supabase pública v1

## Alcance y principios

Este documento diseña exclusivamente la fuente de datos de la web pública GET. No crea SQL, proyecto Supabase, conexión, variables de entorno, autenticación, usuarios, roles, leads reales, calendario, contenidos, estadísticas, IA, auditoría interna ni RLS definitiva. Esas materias quedan para etapas posteriores.

Principios:

- La URL pública usa slugs; los UUID nunca se exponen.
- Una ciudad existe una vez.
- Cada sede institucional es un registro independiente.
- Una carrera conceptual no pertenece a una sede: la relación contextual vive en `academic_offerings`.
- Un programa de capacitación conceptual se relaciona con una sede mediante `training_offerings`.
- Diseño Gráfico, Community Manager y Ventas Digitales de Academia Profesional Norte permanecen en el dominio académico.
- Los datos visuales canónicos —copy, imágenes, galería, badges, orden y estados— deben preservarse durante la importación.

## Inventario del modelo local

### Ciudades

`next-app/app/data/cities.js` no existe. Las ciudades están en `cityPages` dentro de `institutions.js`.

Campos actuales: `slug:string`, `name:string`, `title:string`, `institutionIds:string[]`, `featuredInstitutionIds:string[]`, `canonicalDataNotice?:string`. `slug`, `name`, `title` e `institutionIds` son aparentemente obligatorios; destacados y aviso son contextuales/visuales. El slug es el identificador actual. Los arrays expresan relaciones y orden, pero mezclan ciudad, navegación y presentación.

### Instituciones

Fuente: `institutions.js`. Campos: `id:string`, `citySlug:string`, `slug:string`, `name:string`, `logo:string`, `type:string`, `cities:string[]`, `plan:string`, `slogan:string`, `description:string`, `address:string`, `whatsapp:string`, `image:string`, `media:string`, `gallery:string[]`, `careers:object[]`, `canonicalDataNotice?:string`. Cada elemento de `careers` repite `id`, `slug`, `name`, `description`, `image`, `badge`, `duration` y `modality`.

`id`, `citySlug`, `slug` y `name` son claves aparentes; los datos de contacto y visuales pueden ser nulos si una futura sede no los posee. `logo`, `plan`, `image`, `media`, `gallery`, badge/orden implícito y textos son necesarios para fidelidad visual. `careers` es una duplicación temporal: combina resumen visual contextual con datos que ya existen en `career_masters` y `academic_offerings`. `cities[]` también duplica la relación de sede con ciudad y hoy funciona como copy/contador visual, no como identidad.

Inconsistencias reales preservadas: sedes de Monteros/Aguilares pueden conservar dirección de Concepción; `featuredInstitutionIds` puede referenciar instituciones de otra ciudad; Santa Bárbara y `cityPages` incluyen avisos canónicos. Deben importarse como datos explícitos o metadata visual, no corregirse silenciosamente.

### Career masters

Fuente: `careers.js`. Campos: `id:string`, `slug:string`, `name:string`, `description:string`, `graduateProfile:string`, `workField:string`, `studyPlan:string[]`, `requirements:string[]`, `faq:{question:string,answer:string}[]`. Identificador y slug coinciden hoy. Son datos generales y no deben incorporar ciudad, institución, sede, WhatsApp, imagen, badge ni orden.

`studyPlan`, `requirements` y `faq` son estructuras anidadas. En v1 se recomienda JSONB para conservar literalmente contenido y orden; pueden normalizarse en una evolución editorial si aparece necesidad de consulta granular.

### Academic offerings

Fuente: `offerings.js`. Campos: `id:string`, `institutionId:string`, `careerId:string`, `citySlug:string`, `modality:string`, `duration:string`, `degree:string`, `campus?:string`, `shifts:string`, `nationalValidity:string`, `image:string`, `badge:string`, `formEnabled:boolean`, `visible:boolean`, `order:number` y, conceptualmente, `whatsapp?:string` aunque las filas actuales usan fallback institucional.

`institutionId` + `careerId` es la relación esencial. `citySlug` es redundante y derivable desde la institución; debe validarse durante importación y no almacenarse en el modelo definitivo. Modalidad, duración, título, sede, turnos, validez, imagen, badge, formulario, WhatsApp propio, visibilidad y orden son contextuales.

### Training programs

Fuente: `trainingPrograms.js`. Campos: `id:string`, `slug:string`, `name:string`, `description:string`, `profile:string`, `workField:string`, `contents:string[]`, `requirements:string[]`, `faq:{question,answer}[]`, `status:string`. Son datos generales; `status` puede mapearse a estado editorial/activo. Los arrays y FAQ deben preservarse como JSONB en v1.

### Training offerings

Fuente: `trainingOfferings.js`. Campos: `id:string`, `institutionId:string`, `citySlug:string`, `trainingProgramId:string`, `modality:string`, `duration:string`, `certification:string`, `campus:string`, `shifts:string`, `nationalValidity:string`, `image:string`, `badge:string`, `formEnabled:boolean`, `visible:boolean`, `order:number`, `publicationStatus:string`, más `whatsapp?:string` contextual futuro. `citySlug` vuelve a ser derivable desde la institución.

### Otros datos relacionados

No existen otros módulos en `next-app/app/data`. `imageBank` está embebido en `institutions.js`; son constantes visuales, no entidad de dominio. En una etapa posterior las URLs pueden quedar directamente en las tablas o migrar a una capa de medios, sin alterar su valor visible.

## Cómo consumen datos las rutas

- `/[ciudad]`: `getCityPage(slug)` busca `cityPages[slug]`, arma mapas de instituciones y resuelve `institutionIds`/`featuredInstitutionIds`.
- `/[ciudad]/[institucion]`: `getInstitutionPage(citySlug,institutionSlug)` busca por `citySlug + slug` y además exige que el ID esté incluido en `cityPages.institutionIds`.
- `/[ciudad]/[institucion]/carreras/[carrera]`: resuelve ciudad/sede, obtiene master por slug y luego `getOffering()` por `institution.id + career.id + citySlug + visible`.
- `/[ciudad]/[institucion]/capacitaciones/[capacitacion]`: resuelve ciudad/sede, master de capacitación por slug y offering por institución/programa/ciudad, visible y `publicationStatus=published`.

Son temporales y deben volverse consultas dinámicas:

- Todos los `generateStaticParams()` explícitos de ciudades, instituciones, carreras y capacitaciones.
- `dynamicParams = false` cuando impide publicar nuevas filas sin despliegue.
- La allowlist de instituciones en `CityPageClient.openInstitution()`.
- Las múltiples listas `*CareerPath` y `trainingPath` de `InstitutionPageClient`.
- `cityPages.institutionIds` como autorización de una sede ya relacionada por FK.

En Supabase, los parámetros pueden generarse desde filas activas al construir, o resolverse dinámicamente con caché/revalidación. La validación contextual debe seguir siendo estricta: encontrar la ciudad, encontrar la sede mediante `(city_id, slug)`, encontrar el master por slug y exigir un offering activo que vincule ambos UUID.

## Esquema PostgreSQL propuesto

Todas las tablas usan `id uuid primary key default gen_random_uuid()`, `created_at timestamptz not null default now()` y `updated_at timestamptz not null default now()`. Los slugs se mantienen como identificadores públicos. La actualización automática de `updated_at` se definirá recién en SQL.

### `cities`

Propósito: catálogo único de ciudades.

| Columna | Tipo | Nulabilidad / regla |
| --- | --- | --- |
| `id` | `uuid` | PK, no nulo |
| `slug` | `text` | no nulo, unique |
| `name` | `text` | no nulo |
| `title` | `text` | no nulo |
| `display_order` | `integer` | no nulo, default 0 |
| `is_active` | `boolean` | no nulo, default true |
| `visual_metadata` | `jsonb` | no nulo, default `{}`; avisos/fallback canónico |

Índices: unique B-tree en `slug`; índice parcial por `display_order` para activas si el volumen lo justifica.

### `institutions`

Propósito: una fila por sede real/contextual.

| Columna | Tipo | Regla |
| --- | --- | --- |
| `id` | `uuid` | PK |
| `legacy_key` | `text` | unique, nullable tras importación; conserva ID local |
| `city_id` | `uuid` | FK `cities`, no nulo |
| `slug` | `text` | no nulo |
| `name`, `type` | `text` | no nulos |
| `logo_text`, `plan`, `slogan`, `description` | `text` | nullable según disponibilidad |
| `address`, `whatsapp`, `website`, `opening_hours` | `text` | nullable |
| `hero_image_url`, `media_label` | `text` | nullable |
| `gallery` | `jsonb` | no nulo, default `[]` |
| `cities_label` | `jsonb` | nullable; conserva `cities[]` sólo si el UI lo requiere |
| `display_order` | `integer` | no nulo |
| `is_featured`, `is_active` | `boolean` | no nulos, default false/true |
| `visual_metadata` | `jsonb` | default `{}`; anomalías canónicas |

Constraint clave: `unique(city_id, slug)`, no unique global de slug. Índices: `city_id`, `(city_id, is_active, display_order)`, `(city_id, is_featured)`, y unique de `legacy_key` durante transición.

### `career_masters`

Propósito: carrera conceptual única.

Columnas: `id uuid PK`, `legacy_key text unique nullable`, `slug text not null unique`, `name text not null`, `description text not null`, `graduate_profile text`, `work_field text`, `study_plan jsonb not null default []`, `requirements jsonb not null default []`, `faq jsonb not null default []`, `status text not null default 'published'`, `is_active boolean not null default true`, timestamps. Check futuro para estados permitidos. Índices: unique `slug`; `(is_active,status)`.

No contiene `institution_id` ni `city_id`.

### `academic_offerings`

Propósito: una sede ofrece una carrera conceptual.

Columnas: `id uuid PK`, `legacy_key text unique nullable`, `institution_id uuid not null FK institutions`, `career_master_id uuid not null FK career_masters`, `modality text`, `duration text`, `degree text`, `campus text`, `shifts text`, `national_validity text`, `image_url text`, `badge text`, `display_order integer not null`, `form_enabled boolean not null default true`, `whatsapp text nullable`, `is_visible boolean not null default true`, `publication_status text not null default 'published'`, `metadata jsonb not null default {}`, timestamps.

Constraint: `unique(institution_id, career_master_id)`. Índices: `career_master_id`; `(institution_id,is_visible,display_order)`; `(publication_status,is_visible)`. No almacena `city_id` ni `city_slug`, porque se derivan por FK.

### `training_programs`

Propósito: capacitación conceptual independiente.

Columnas: `id uuid PK`, `legacy_key text unique nullable`, `slug text not null unique`, `name text not null`, `description text not null`, `profile text`, `work_field text`, `contents jsonb not null default []`, `requirements jsonb not null default []`, `faq jsonb not null default []`, `status text not null default 'published'`, `is_active boolean not null default true`, timestamps. Índices: unique `slug`; `(is_active,status)`.

### `training_offerings`

Propósito: relación contextual capacitación + sede.

Columnas: `id uuid PK`, `legacy_key text unique nullable`, `institution_id uuid not null FK institutions`, `training_program_id uuid not null FK training_programs`, `modality text`, `duration text`, `certification text`, `campus text`, `shifts text`, `national_validity text`, `image_url text`, `badge text`, `display_order integer not null`, `form_enabled boolean not null default true`, `whatsapp text nullable`, `is_visible boolean not null default true`, `publication_status text not null default 'published'`, `metadata jsonb not null default {}`, timestamps.

Constraint: `unique(institution_id, training_program_id)`. Índices: `training_program_id`; `(institution_id,is_visible,display_order)`; `(publication_status,is_visible)`. No se mezcla con `academic_offerings`.

## Mapeo del modelo actual al modelo Supabase

### `cities.js` / `cityPages` → `cities`

No hay `cities.js`: se extraen `slug`, `name`, `title` y orden de las claves de `cityPages`. `canonicalDataNotice` va a `visual_metadata`. `institutionIds` se reemplaza por FK `institutions.city_id`; `featuredInstitutionIds` necesita transformación: `is_featured` cuando sea una sede de la ciudad y `visual_metadata` para referencias cruzadas canónicas que deban seguir visibles.

### `institutions.js` → `institutions`

Pasan 1:1: ID como `legacy_key`, slug, nombre, tipo, logo, plan, slogan, descripción, dirección, WhatsApp, imagen, media y galería. `citySlug` se transforma en `city_id`. `cities[]` no define identidad; se conserva como etiqueta JSONB sólo si la interfaz lo consume. `careers[]` no se persiste anidado: sus campos generales se validan contra masters y sus campos visuales/contextuales contra offerings. `canonicalDataNotice` va a `visual_metadata`.

### `careers.js` → `career_masters`

ID local a `legacy_key`; slug/nombre/descripción/perfil/campo pasan 1:1. `studyPlan`, `requirements` y `faq` pasan a JSONB conservando orden y textos. Deben deduplicarse por slug conceptual antes de insertar. No se añade sede ni ciudad.

### `offerings.js` → `academic_offerings`

ID a `legacy_key`; `institutionId` y `careerId` se resuelven a UUID por legacy key/slug. Modalidad, duración, degree, campus, turnos, validez, imagen, badge, formulario, visible y orden pasan contextualmente. `citySlug` se usa sólo para validar que coincide con `institutions.city_id`, luego se descarta. Si falta `campus`, se conserva nulo y la UI usa dirección institucional; no rellenar inventando datos. WhatsApp nulo mantiene fallback institucional.

### `trainingPrograms.js` → `training_programs`

ID a `legacy_key`; slug, nombre, descripción, perfil, campo y status pasan 1:1; contents/requisitos/FAQ a JSONB ordenado.

### `trainingOfferings.js` → `training_offerings`

ID a `legacy_key`; institución y programa se resuelven a UUID. Campos contextuales pasan 1:1. `citySlug` sólo valida la sede y no se almacena. `publicationStatus` pasa a `publication_status`.

## Duplicaciones e inconsistencias a resolver durante importación

- El resumen `institutions[].careers` duplica master y offering; no debe producir masters duplicados.
- `licenciatura-en-administracion` en tarjetas y `lic-en-administracion` en masters/rutas requiere una tabla de equivalencias de importación explícita, no un cambio editorial.
- `citySlug` de offerings duplica la ciudad de la institución.
- Dirección y datos institucionales repetidos entre sedes pueden ser canónicos aunque parezcan erróneos; se conservan por sede y se revisan después.
- `featuredInstitutionIds` contiene referencias cruzadas de ciudad; preservar el resultado visual mediante metadata o una futura relación ordenada, no mediante FK inválida.
- Centro de Formación mantiene resúmenes dentro de `careers[]` aunque sus fichas usan el dominio training; durante importación deben vincularse exclusivamente con training programs/offerings.
- Los IDs locales compuestos no son PK definitivas; se guardan temporalmente como `legacy_key` para trazabilidad.

## Validación con casos reales

1. **Siglo 21 multisede:** cada sede tiene UUID institucional propio y el mismo slug bajo ciudades distintas gracias a `unique(city_id,slug)`.
2. **Abogacía multisede:** un único `career_master` se relaciona con varias instituciones mediante offerings independientes.
3. **Santa Bárbara multisede:** Concepción y Aguilares son instituciones distintas; comparten slug y pueden conservar datos contextuales diferentes.
4. **Diagnóstico por Imágenes:** un master único; offerings separados por Santa Bárbara Concepción y Aguilares.
5. **Capacitaciones Monteros:** Centro de Formación se relaciona con Auxiliar, Secretariado y Operador de PC sólo mediante `training_offerings`.
6. **Academia/Diseño Gráfico:** Academia es institución tipo Academia; Diseño Gráfico, Community Manager y Ventas Digitales son masters/ofertas académicas, nunca training.

Los seis casos encajan sin duplicar entidades conceptuales ni exponer UUID en URL.

## Secuencia futura recomendada

La próxima etapa debería crear SQL versionado para estas seis tablas, constraints, índices, timestamps y políticas públicas de sólo lectura cuidadosamente diseñadas. Antes de ejecutar SQL deberá verificarse la documentación vigente de Supabase, definir RLS y el acceso al Data API. No se ejecuta nada de ello en este bloque.
