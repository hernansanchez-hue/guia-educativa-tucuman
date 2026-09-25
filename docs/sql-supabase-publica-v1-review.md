# Revisión SQL Supabase pública v1

Fecha de revisión: 2026-08-15.

## Alcance

Se prepararon migraciones SQL locales y versionadas para el catálogo público GET. No se ejecutó SQL, no se inició Supabase local, no se accedió a un proyecto remoto, no se insertaron datos y Next.js continúa sin conexión a Supabase.

## Fuentes oficiales consultadas

- Supabase, [Declarative database schemas](https://supabase.com/docs/guides/local-development/declarative-database-schemas): las migraciones SQL se versionan en `supabase/migrations`; se revisó también su orden incremental.
- Supabase, [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security): RLS debe habilitarse para tablas del esquema expuesto `public`; RLS y los permisos de tabla son controles distintos.
- Supabase, [Securing your API](https://supabase.com/docs/guides/api/securing-your-api): se consideró el comportamiento del Data API y la necesidad de `GRANT` explícito para roles de lectura cuando corresponda.
- Supabase, [uuid-ossp](https://supabase.com/docs/guides/database/extensions/uuid-ossp): confirma el uso disponible de `gen_random_uuid()` para UUIDv4.
- PostgreSQL, [Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [Privileges](https://www.postgresql.org/docs/current/ddl-priv.html) y [CREATE TRIGGER](https://www.postgresql.org/docs/current/sql-createtrigger.html): PK/FK, constraints, permisos y triggers.
- Supabase, [Changelog](https://supabase.com/changelog?types=breaking-change), consultado el 2026-08-15: no se identificó un cambio aplicable a estas dos migraciones locales de catálogo/RLS.

## Archivos y orden previsto

1. `supabase/migrations/20260815103000_public_catalog_schema_v1.sql`
2. `supabase/migrations/20260815103001_public_catalog_rls_v1.sql`

El primero crea exclusivamente estructura. El segundo presupone esas tablas, revoca privilegios de escritura para los roles públicos, concede sólo `SELECT`, habilita RLS y crea sólo políticas `SELECT`.

## Esquema

Las seis tablas son `public.cities`, `public.institutions`, `public.career_masters`, `public.academic_offerings`, `public.training_programs` y `public.training_offerings`. Todas tienen `id uuid primary key default gen_random_uuid()`, `created_at` y `updated_at` con `timestamptz not null default now()`.

La función única `public.set_updated_at()` se reutiliza en los seis triggers `before update`. No es `SECURITY DEFINER`; se revocó su ejecución directa para `PUBLIC`, `anon` y `authenticated`. La actualización de timestamp queda centralizada sin duplicar lógica por tabla.

### Relaciones, unicidad y borrado

| Relación | FK | Regla | ON DELETE |
| --- | --- | --- | --- |
| Ciudad → institución | `institutions.city_id` | Una sede pertenece a una ciudad | `RESTRICT` |
| Institución → offering académica | `academic_offerings.institution_id` | La sede no se elimina mientras conserve ofertas | `RESTRICT` |
| Career master → offering académica | `academic_offerings.career_master_id` | El concepto no se elimina mientras sea ofrecido | `RESTRICT` |
| Institución → offering de capacitación | `training_offerings.institution_id` | La sede no se elimina mientras conserve ofertas | `RESTRICT` |
| Programa → offering de capacitación | `training_offerings.training_program_id` | El programa no se elimina mientras sea ofrecido | `RESTRICT` |

Se eligió `RESTRICT` para evitar cascadas y borrados masivos accidentales. La remoción futura requerirá retirar o reasignar explícitamente las dependencias.

Constraints de unicidad:

- `cities.slug` es único.
- `institutions` usa `unique(city_id, slug)`: `universidad-siglo-21` puede existir en varias ciudades, pero no dos veces en la misma.
- `career_masters.slug` es único y no contiene ciudad ni institución.
- `academic_offerings` usa `unique(institution_id, career_master_id)`.
- `training_programs.slug` es único.
- `training_offerings` usa `unique(institution_id, training_program_id)`.
- Los `legacy_key` son únicos y nullable para trazabilidad durante una importación futura.

Los checks seguros incluidos impiden `slug`, `name`, `title`, `type` y descripciones requeridas vacías, además de `display_order >= 0`. No se restringieron los valores editoriales de `status` o `publication_status` para no invalidar sin evidencia los datos canónicos de la demo.

### Índices

Se añadieron los índices necesarios para la navegación contextual y listados visibles:

- `institutions(city_id, display_order) where is_active`.
- `academic_offerings(career_master_id)`.
- `academic_offerings(institution_id, display_order) where is_visible and publication_status = 'published'`.
- `training_offerings(training_program_id)`.
- `training_offerings(institution_id, display_order) where is_visible and publication_status = 'published'`.

No se crean índices separados para PK, `cities(slug)`, `institutions(city_id, slug)`, `career_masters(slug)`, `training_programs(slug)`, ni las dos unicidades de offerings: PostgreSQL ya crea sus índices B-tree al declarar PK/`UNIQUE`. Tampoco se agregó un índice simple de `institutions(city_id)`, pues el índice compuesto activo lo cubre para el flujo público previsto.

### JSONB y fidelidad visual

Se mantienen como JSONB `cities.visual_metadata`; `institutions.gallery`, `cities_label` y `visual_metadata`; `career_masters.study_plan`, `requirements` y `faq`; `training_programs.contents`, `requirements` y `faq`; y `metadata` de ambos dominios de offering. Así se preservan sin pérdida portada, logo, galería, badges, imágenes, orden, textos, plan, requisitos, FAQ y anomalías visuales canónicas durante la futura importación.

No se almacenan `city_slug` ni `city_id` redundantes dentro de offerings: su contexto deriva de la institución. Los UUID no se destinan a URLs públicas.

## RLS y permisos públicos

RLS se habilita en las seis tablas. Para `anon` y `authenticated` se hace primero `REVOKE ALL` y después se otorga exclusivamente `GRANT SELECT`; no se otorgan `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REFERENCES` ni `TRIGGER`.

Las políticas `SELECT`, aplicables a ambos roles, son:

| Tabla | Regla de lectura pública |
| --- | --- |
| `cities` | `is_active` |
| `institutions` | la institución y su ciudad están activas |
| `career_masters` | `is_active` y `status = 'published'` |
| `academic_offerings` | visible y publicada; su institución, ciudad y career master también son públicos |
| `training_programs` | `is_active` y `status = 'published'` |
| `training_offerings` | visible y publicada; su institución, ciudad y programa también son públicos |

Las verificaciones de offering usan `EXISTS` de forma deliberada. Evitan publicar una oferta que permanezca marcada visible si se desactiva su sede, ciudad o master/programa. No se usa `USING (true)`. No hay políticas de escritura, roles personalizados, perfiles, integración con `auth.users` ni diseño de administración.

## Conservación del modelo aprobado

- `academic_offerings` y `training_offerings` permanecen separados.
- Academia Profesional Norte sigue siendo una institución académica: Diseño Gráfico, Community Manager y Ventas Digitales se importarán a `career_masters` + `academic_offerings`, nunca al dominio training.
- Aún no se cargan datos, incluidas las tres ciudades aprobadas.
- La clave pública institucional continúa siendo `(city_id, slug)`; la carrera maestra continúa siendo conceptual y única por `slug`.
- Next.js no se conecta todavía y no se modificó ningún archivo de la aplicación pública o de la demo Vite.

## Revisión estática

Se revisaron manualmente el orden de creación (tablas padre antes de FKs, RLS después del schema), columnas referenciadas por FKs/policies, nombres de constraints, ausencia de índices duplicados por PK/`UNIQUE`, y la correspondencia entre cada tabla RLS, `GRANT`, `REVOKE` y policy. No se ejecutó contra PostgreSQL local o remoto, tal como exige la etapa; por eso esta revisión no sustituye una futura aplicación controlada y prueba de migraciones.
