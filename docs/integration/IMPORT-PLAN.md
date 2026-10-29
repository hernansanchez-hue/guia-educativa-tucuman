# Plan de importación CRM — pendiente de aprobación

La captura de Supabase del 28/10/2026 muestra únicamente dos instituciones QA y cuatro programas QA. No se vinculan a datos públicos. Los archivos `venues.json` y `offerings.json` se regeneran con `node next-app/scripts/generate-crm-catalog-inventory.mjs`; el script lee el catálogo versionado y `crm-readonly-snapshot.json`, sin escribir en Supabase.

1. Revisar manualmente los 11 grupos multisede y decidir por cada marca si corresponde un tenant común o varias cuentas comerciales. Resolver los pares de oferta misma sede/carrera con modalidad distinta o no informada. No usar similitud de nombres como prueba.
2. Obtener identificadores CRM reales de instituciones y programas mediante consulta de solo lectura; aprobar la tabla de equivalencias por IDs públicos estables. Excluir siempre QA.
3. Preparar un lote con clave externa estable por tenant/programa y ejecutar **dry-run**: inserciones previstas, existentes y conflictos. Exigir `get_enabled=false` en toda institución nueva; sin usuarios, invitaciones ni Premium automático.
4. En una etapa autorizada del proyecto CRM, hacer upsert transaccional/idempotente por clave externa, nunca por nombre. Para programas, comprobar `program.institution_id = institution.id`; no duplicar ni sobrescribir históricos. Conservar una bitácora del lote y de los UUIDs retornados.
5. Regenerar el mapeo privado que consume GET público; ejecutar `check-crm-mapping.mjs` y contrastar 125 sedes/198 ofertas, dejando las no habilitadas explícitamente sin recepción. Probar QA negativa, tenant cruzado y doble envío antes de cualquier despliegue.

El validador público actual rechaza que dos sedes compartan un UUID institucional. Si se aprueba un tenant multisede, ese validador deberá adaptarse en una etapa coordinada antes de activar la integración; no se alteró aquí.
