# Importación propuesta GET público → GET Instituciones

Estado: **solo preparación y dry-run**. No se ejecutó ninguna escritura remota. Proyecto de destino: `txqxbndfiestxjjojlgh`.

## Alcance y claves

- Cada una de las 125 sedes crea **una institución CRM propia**, aunque comparta marca. Las 198 ofertas crean 198 programas CRM propios del tenant de su sede. Esto no crea usuarios, memberships, suscripciones ni Premium.
- `publicVenueId` y `publicOfferingId` son las claves externas inmutables. `crmLookupSlug = get-public-${publicVenueId}` y `crmLookupCode = get-public-${publicOfferingId}` son claves de búsqueda deterministas, **no UUIDs**. No se vincula por parecido de nombre.
- Los nombres, dirección y ciudad provienen del catálogo público. `department`, `originalPublicSlug`, `modalityFromPublic` y `durationFromPublic` son metadatos de la propuesta: **no son columnas** de `institutions` ni de `programs`. No convertirlos en columnas sin otra autorización.
- Todos los registros institucionales nuevos llevan `get_enabled=false`. Las instituciones y programas QA se excluyen. Los UUID reales quedan `null` hasta que la base los genere.
- Tres pares comparten sede y carrera maestra, pero son **ofertas distintas** (una modalidad `A distancia` y otra sin modalidad informada en cada par). Crear programas separados por `crmLookupCode` y conservar ambos vínculos; no inventar la modalidad faltante. El CRM actual no tiene columna de modalidad en `programs`, por lo que este atributo continúa en el catálogo público y en la propuesta, no en el programa CRM.

## Esquema verificado

En remoto existen `public.institutions` y `public.programs`. `institutions` tiene `name`, `slug`, `status`, `city`, `province`, `address`, `get_enabled` y otros campos opcionales o con defaults. `programs` tiene `institution_id`, `code`, `name`, `status` y defaults técnicos. Los nombres están limitados a 2–160 caracteres; slug/code usan minúsculas, números y guiones. `programs` exige unicidad `(institution_id, code)` y clave compuesta `(institution_id, id)`.

Las tablas `private.public_catalog_institution_links` y `private.public_catalog_offering_links` **no existen todavía en remoto**. Se definen en la migración local `GET INSTITUCIONAL/supabase/migrations/20261029001649_public_inquiry_ingestion.sql`. La segunda obliga por FK compuesta a que el programa pertenezca al mismo tenant del vínculo institucional. No se hizo `supabase db push`.

## Antes de ejecutar en una etapa autorizada

1. Aprobar expresamente el dry-run y coordinar la aplicación de la migración del receptor desde el proyecto GET Instituciones. No editar migraciones históricas ni aplicar desde este repositorio público.
2. Reconsultar en modo lectura las cuatro tablas y regenerar el snapshot. El snapshot incluido es del 28/10/2026: dos instituciones QA y cuatro programas QA, sin registros reales. Si aparece cualquier registro real o una colisión de slug/code/ID externo, detenerse y reconciliarlo por evidencia verificable.
3. Volver a ejecutar `node next-app/scripts/prepare-crm-import.mjs`. Exigir 125 sedes, 198 ofertas, cero inconsistencias, cero colisiones y revisión explícita de los tres pares de modalidad.

## Importación idempotente propuesta (NO ejecutada)

Ejecutar solamente desde un proceso administrativo autorizado en GET Instituciones, dentro de una transacción controlada y con bitácora de lote; nunca desde el cliente público ni con la clave de servicio en `NEXT_PUBLIC_*`.

1. Por cada `proposed-institutions.json`, buscar primero `slug = crmLookupSlug`. Si no existe, insertar `name`, `slug`, `city`, `province`, `address`, `status='active'`, `get_enabled=false` con `ON CONFLICT (slug) DO NOTHING`; luego recuperar el UUID por slug. Si existe, verificar nombre e identidad externa esperados, y **no actualizarlo automáticamente**. Rechazar cualquier coincidencia con QA o `get_enabled=true` inesperado.
2. Por cada `proposed-programs.json`, resolver el UUID de la institución por `institutionLookupSlug`; buscar `(institution_id, crmLookupCode)`. Si no existe, insertar `institution_id`, `code`, `name`, `status='active'` con `ON CONFLICT (institution_id, code) DO NOTHING`; recuperar UUID. Si existe, verificar nombre y pertenencia; no modificar datos históricos automáticamente. Aunque dos programas tengan el mismo nombre, códigos de oferta diferentes los mantienen separados.
3. Una vez aplicada la migración local del receptor, por cada `proposed-institution-links.json`, insertar `source_code`, `public_institution_id`, UUID resuelto y `active=true` con `ON CONFLICT (source_code, public_institution_id) DO NOTHING`; consultar después y **rechazar** cualquier mapeo existente a otro UUID.
4. Por cada `proposed-offering-links.json`, resolver UUID institucional y de programa por las claves anteriores. Verificar primero `programs.institution_id = institutions.id`; insertar los cinco campos reales y `active=true` con `ON CONFLICT (source_code, public_offering_id) DO NOTHING`; consultar y rechazar divergencias. La FK compuesta es un segundo control de tenant.
5. Validar con consultas de solo lectura: exactamente 125 vínculos institucionales y 198 de oferta para los IDs del lote; 125 UUID institucionales distintos; 198 programas con tenant correcto; cero claves faltantes o duplicadas; `get_enabled=false` para las 125 sedes; QA intacta. Conservar una bitácora de `public ID → UUID` y del estado anterior de cada fila, sin datos personales.

## Reversión controlada

Si falla antes del commit de la transacción, hacer `ROLLBACK`. Si el lote ya fue confirmado, **no borrar ni desactivar en masa**: las FK y los posibles leads históricos hacen riesgosa la eliminación. Detener la integración pública, obtener la bitácora, comprobar si hubo referencias reales y acordar una reversión específica con el equipo CRM. No tocar QA, usuarios ni leads históricos.

## Cómo reproducir el dry-run

Desde `C:\Codex\GET-production`: `node next-app/scripts/prepare-crm-import.mjs`. Lee `venues.json`, `offerings.json`, el catálogo versionado actual y `crm-readonly-snapshot.json`; escribe solo los seis archivos de propuesta/reporte en esta carpeta. No se conecta a Supabase. La verificación del esquema remoto fue una consulta separada de solo lectura.
