# Piloto institucional: Universidad Siglo 21 Concepción con Supabase V1

## Alcance

La única ficha piloto es `/concepcion/universidad-siglo-21`. Lee `cities` e `institutions` del lado servidor cuando `PUBLIC_CATALOG_SOURCE=supabase`; el valor por defecto sigue siendo `local`.

## Adaptación

`next-app/lib/public-catalog/institution-page-catalog.js` entrega el mismo shape que `InstitutionPageClient` recibe hoy. Resuelve la fila remota por `city.slug` e `institution.slug`, conserva `legacy_key` como `institution.id` y no expone UUID.

Los datos institucionales vienen de Supabase. Los cuatro resúmenes de carrera siguen deliberadamente locales para preservar exactamente la sección actual sin consultar `academic_offerings`.

## Límites

Las demás fichas institucionales, carreras, capacitaciones y Home siguen locales. Supabase remoto no se modifica.

## Validación final

- Comparación local/Supabase real: 0 mismatches.
- Capturas temporales realizadas con Microsoft Edge: local y Supabase en escritorio (1440 × 900) y móvil (390 × 843).
- Desktop y móvil: textos, hero, galería, cuatro carreras, orden, links y responsive equivalentes; sin overflow horizontal.
- Diferencias significativas: 0.
- Los resúmenes de carrera continúan provenientes de datos locales.
- Tests, lint y builds local/Supabase: correctos.
- Conclusión: **PILOTO INSTITUCIONAL VALIDADO**.
