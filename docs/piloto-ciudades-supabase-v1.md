# Piloto Ciudades con Supabase V1

## Alcance

- Ruta piloto: `/ciudades`.
- Motivo: depende únicamente de tres ciudades, no requiere relaciones de instituciones, carreras ni capacitaciones, y permite una reversión inmediata mediante la selección de fuente.
- Fuente anterior: `CitySelector` contenía una lista local fija de nombres y conservaba navegación efectiva solamente hacia Concepción.

## Capa de catálogo

- Adaptador: `next-app/lib/public-catalog/cities-catalog.js`.
- `getLocalCitiesCatalog()` entrega el shape local de `cityPages`.
- `getSupabaseCitiesCatalog()` consulta cities, ordena por `display_order` y adapta JSONB al mismo shape.
- `getCitiesCatalog()` selecciona la fuente mediante `PUBLIC_CATALOG_SOURCE`.
- Sin selector o con `local`, la fuente es local. Con `supabase`, URL y publishable key son obligatorias; no existe fallback silencioso.

## Shape y seguridad

- Shape común: `slug`, `name`, `title`, `institutionIds`, `featuredInstitutionIds` y, cuando existe, `canonicalDataNotice`.
- El orden se conserva por `display_order`. Las referencias visuales e inconsistencias canónicas permanecen intactas.
- La lectura ocurre en `app/ciudades/page.js`, un Server Component que pasa datos serializables al componente cliente existente.
- Se usan únicamente `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` del servidor. No se usa ni expone `service_role`, ni se utiliza una variable `NEXT_PUBLIC_*`.

## Validación

- Local y Supabase entregan Concepción, Monteros y Aguilares en el mismo orden, con los mismos textos, links y metadata visual.
- Se agregaron pruebas unitarias para default local, local explícito, Supabase explícito, fuente inválida, orden, adaptación y variables faltantes.
- Las capturas nuevas quedan pendientes: Chrome no estuvo disponible a través del canal aprobado de captura. No se reemplazaron baselines canónicos.
- Supabase no fue modificado. Next.js mantiene locales todas las rutas salvo el piloto `/ciudades` cuando se selecciona explícitamente `PUBLIC_CATALOG_SOURCE=supabase`.

## Rutas que siguen locales

`/`, `/concepcion`, `/monteros`, `/aguilares`, fichas institucionales, carreras y capacitaciones.

## Validación visual final

- Navegador: Microsoft Edge mediante la integración habilitada.
- Desktop local y Supabase: capturas realizadas con viewport de 1440 × 900.
- Mobile local y Supabase: capturas realizadas con viewport de 390 × 843.
- Resultado desktop: misma cantidad y orden de ciudades, textos, control de búsqueda, iconos, tarjetas, tamaños, márgenes, alineación y wrapping.
- Resultado mobile: misma cantidad y orden de ciudades, textos, tarjetas, responsive, espaciados y wrapping; sin overflow horizontal en ninguna fuente.
- Diferencias observadas: el fondo audiovisual muestra fotogramas distintos entre capturas. Es un estado dinámico de la demo, no una diferencia causada por la fuente local o Supabase.
- Diferencias significativas: 0.
- Fecha: 2026-08-20.
- Conclusión: **PILOTO /CIUDADES VALIDADO**.

## Siguiente etapa

Elegir una siguiente ruta pequeña con fallback local conservado.
