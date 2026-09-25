# Páginas de ciudad con Supabase V1

## Alcance

Las rutas `/concepcion`, `/monteros` y `/aguilares` se preparan para leer únicamente `cities` e `institutions` mediante `PUBLIC_CATALOG_SOURCE`. El valor por defecto es `local`; `supabase` requiere `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` únicamente en el servidor.

## Adaptador y shape

`next-app/lib/public-catalog/city-page-catalog.js` ofrece `getLocalCityPageCatalog(citySlug)`, `getSupabaseCityPageCatalog(citySlug)` y `getCityPageCatalog(citySlug)`. Ambos orígenes entregan el mismo shape de `CityPageClient`: ciudad, `institutionIds`, `featuredInstitutionIds`, `institutions` y `featuredInstitutions`.

La referencia visible sigue siendo `legacy_key`, convertido en `institution.id`; los UUID de Supabase no se entregan a la UI. Las referencias canónicas y cruzadas de destacados se resuelven desde `visual_metadata` por `legacy_key`.

## Carreras

`CityPageClient` usa `institutions[].careers` para filtrar y contar. Como `academic_offerings` aún no entra en este alcance, esos resúmenes conservan temporalmente la fuente local; no se consulta ni se renderiza ninguna offering remota.

## Validación

- Concepción: 3 instituciones; orden, destacados, textos, links y shape equivalentes entre local y Supabase.
- Monteros: 4 instituciones; orden, destacados, textos, links y shape equivalentes entre local y Supabase.
- Aguilares: 3 instituciones; orden, destacados, textos, links y shape equivalentes entre local y Supabase.
- La comparación estructural de los tres catálogos reales no encontró fields mismatches, missing ni unexpected. La diferencia de serialización observada inicialmente fue sólo el orden interno de propiedades JSON.
- Se realizaron doce capturas temporales con Microsoft Edge: local y Supabase para cada ciudad, en escritorio (1440 × 900) y móvil (390 × 843). Los textos, tarjetas, orden y responsive coincidieron; no hubo overflow horizontal. Las capturas no se versionan.
- Diferencias significativas: 0.
- Supabase remoto no fue modificado.

## Rutas que siguen locales

Home, fichas institucionales, carreras, capacitaciones y todos los demás caminos siguen usando datos locales. Supabase no se modifica en esta etapa.
