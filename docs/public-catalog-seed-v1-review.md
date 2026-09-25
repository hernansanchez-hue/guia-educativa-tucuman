# Revisión del seed canónico público v1

Fecha: 2026-08-15.

## Alcance

Esta etapa prepara localmente una migración de datos canónicos para las seis tablas públicas aprobadas. El SQL no fue ejecutado local ni remotamente. No se modificaron el esquema, RLS, Next.js, Vite ni los módulos de datos fuente.

Archivo preparado:

- `supabase/migrations/20260815163744_public_catalog_seed_v1.sql`

## Fuentes y conteos confirmados

Las ciudades provienen de `cityPages`, exportado por `next-app/app/data/institutions.js`; no existe `cities.js`. El resto del inventario proviene de `institutions.js`, `careers.js`, `offerings.js`, `trainingPrograms.js` y `trainingOfferings.js`.

| Dominio | Cantidad real |
| --- | ---: |
| Ciudades | 3 |
| Instituciones/sedes | 10 |
| Career masters | 19 |
| Academic offerings | 30 |
| Training programs | 3 |
| Training offerings | 3 |

Los conteos coinciden con las expectativas conceptuales. Se validó que todos los institution IDs, career IDs, training program IDs y `citySlug` de las offerings resuelven contra sus fuentes actuales.

## Orden de importación y UUID

El orden exacto es:

1. `cities`.
2. `institutions`.
3. `career_masters`.
4. `academic_offerings`.
5. `training_programs`.
6. `training_offerings`.
7. Assertions finales.

Las PK UUID no se hardcodean: se omite `id` en todos los inserts y se utiliza el default `gen_random_uuid()` del esquema. Los IDs string actuales se conservan como `legacy_key` para trazabilidad.

Las instituciones resuelven `city_id` uniendo `cityPages.citySlug` con `cities.slug`. Las academic offerings unen `institutionId` con `institutions.legacy_key` y `careerId` con `career_masters.slug`. Las training offerings usan `institutions.legacy_key` y `training_programs.slug`. Una relación ausente produce menos filas y hace fallar las assertions; no se usa `ON CONFLICT DO NOTHING`.

## Ciudades e instituciones

Las ciudades son Concepción, Monteros y Aguilares, en ese orden. `cities.visual_metadata` conserva literalmente:

- `institutionIds` ordenados;
- `featuredInstitutionIds` ordenados;
- `canonicalDataNotice` cuando existe.

Esto preserva referencias cruzadas canónicas: Instituto del Sur de Monteros en Concepción y Aguilares, e Instituto Santa Bárbara Concepción en Monteros. No se intenta representarlas como una FK falsa.

Cada sede institucional conserva su `legacy_key`, ciudad, slug, nombre, tipo, logo, plan, slogan, descripción, dirección, WhatsApp, portada, media, galería, etiquetas de ciudades y orden. `website` y `opening_hours` no existen en los objetos actuales y quedan `NULL` por default. `is_active` queda `true`; `is_featured` representa sólo destacados pertenecientes a la propia ciudad, mientras las referencias cruzadas viven en metadata.

La advertencia canónica de Instituto Santa Bárbara Concepción se conserva en `institutions.visual_metadata`. Las direcciones y contactos se copian literalmente, aunque parezcan repetidos entre sedes.

## Career masters y offerings académicas

Se insertan 19 masters conceptualmente únicos. Los campos generales —descripción, perfil, campo laboral, plan, requisitos y FAQ— proceden exclusivamente de `careers.js`. Los arrays ordenados y FAQ se conservan como JSONB sin reordenarlos.

`careers.js` no define `status` ni `is_active`; el seed materializa explícitamente los defaults aprobados `published` y `true`. Las 30 offerings actuales tienen `visible: true`; el seed conserva ese valor y establece `publication_status = 'published'`, compatible con RLS. `whatsapp` contextual no existe actualmente y queda `NULL`, preservando el futuro fallback institucional. Los 27 `campus` ausentes quedan `NULL` sin inventar sedes.

El único alias real es:

- `licenciatura-en-administracion` en tres resúmenes de `institutions[].careers` → master canónica `lic-en-administracion`.

No se crea una segunda master ni se altera la URL canónica. Como `institutions[].careers` es duplicación derivada, sus objetos no se insertan; las tarjetas se reconstruirán desde `career_masters` + `academic_offerings`.

Universidad Siglo 21 conserva tres sedes con un mismo slug permitido por ciudad. Abogacía queda como una master y tres offerings. Santa Bárbara conserva dos sedes independientes. Diagnóstico por Imágenes queda como una master y dos offerings contextuales.

Academia Profesional Norte permanece académica: Diseño Gráfico, Community Manager y Ventas Digitales se insertan en `career_masters` + `academic_offerings`; no generan training programs ni training offerings.

## Training

Los tres programas y tres offerings pertenecen al dominio de capacitación de Centro de Formación Tucumán — Monteros. Los masters conservan `status = 'published'` y quedan activos; las offerings conservan `visible = true` y `publicationStatus = 'published'`. Contenidos, requisitos y FAQ se mantienen como JSONB ordenado.

Academia Profesional Norte tiene cero training offerings y ninguna de sus carreras se mezcla con este dominio.

## JSONB y campos derivados

Se usan JSONB para metadata de ciudad/institución, galerías, etiquetas de ciudades, plan, requisitos, FAQ, contenidos y metadata contextual. `citySlug` de offerings se utiliza para validar relaciones antes de generar el SQL, pero no se persiste porque se deriva de la institución. `institutions[].careers` tampoco se persiste por ser una duplicación resumida.

No se detectó un campo canónico sin destino conceptual. Requieren transformación explícita, pero no pérdida de datos: el alias de Administración, las referencias cruzadas de destacados y los resúmenes institucionales derivados.

## Assertions finales

El bloque `DO` exige exactamente 3 ciudades, 10 instituciones, 19 career masters, 30 academic offerings, 3 training programs y 3 training offerings. También comprueba:

- ausencia de una master duplicada `licenciatura-en-administracion`;
- tres offerings de Abogacía;
- dos offerings de Diagnóstico por Imágenes;
- cero training offerings de Academia Profesional Norte.

Las PK, FK y constraints UNIQUE del esquema cubren UUID, relaciones y duplicados restantes. La migración es intencionalmente de una sola ejecución y no oculta inconsistencias mediante `ON CONFLICT`.

## Reconstrucción funcional

La combinación del seed con el esquema aprobado permite reconstruir el estado actual de Concepción, Monteros y Aguilares: Siglo 21 multisede, Santa Bárbara multisede, Abogacía, Diagnóstico por Imágenes, capacitaciones de Centro de Formación Tucumán y las tres carreras académicas de Academia Profesional Norte.

Supabase remoto permanece fuera de alcance de esta migración hasta una autorización posterior. Next.js continúa consumiendo los módulos locales actuales.
