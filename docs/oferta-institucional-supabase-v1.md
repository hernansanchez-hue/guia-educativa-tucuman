# Oferta institucional Supabase v1

La ficha institucional conservaba sus datos de institución desde Supabase, pero sus tarjetas desde `institutions[].careers`. Esta etapa crea `next-app/lib/public-catalog/institution-offerings-catalog.js` y compone ambas fuentes por `PUBLIC_CATALOG_SOURCE`.

- `local`: conserva exactamente los 33 resúmenes heredados.
- `supabase`: consulta sólo `cities`, `institutions`, `career_masters`, `academic_offerings`, `training_programs` y `training_offerings`; no usa arrays locales como fallback.
- Las UUID son exclusivamente internas. La UI conserva identidades legacy.
- Las funciones públicas son `getLocalInstitutionOfferingsCatalog`, `getSupabaseInstitutionOfferingsCatalog`, `getInstitutionOfferingsCatalog`, `adaptAcademicOffering` y `adaptTrainingOffering`.

El shape visual compatible es `id`, `slug`, `name`, `description`, `image`, `badge`, `duration` y `modality`. El orden se toma de `display_order`; los enlaces existentes continúan en el componente sin cambios. `lic-en-administracion` se adapta a la identidad visual heredada `licenciatura-en-administracion`, sin crear un master duplicado.

Conteos confirmados: 30 académicos y 3 training, 33 totales. Siglo 21 aporta 4 por sede (3 sedes), Santa Bárbara 3 por sede (2 sedes), IES/Instituto del Sur/Instituto San Miguel 3 académicos cada uno, Academia Profesional Norte 3 académicos y 0 training, y Centro de Formación Tucumán 0 académicos y 3 training.

La comparación real local/Supabase de las 10 fichas produjo 0 diferencias de campos, sin faltantes ni ofertas inesperadas. Las páginas individuales de carreras y capacitaciones siguen locales; Home también permanece local. Supabase remoto fue usado únicamente mediante SELECT público, sin cambios de schema, RLS o datos.

El build actual genera 50 páginas porque las páginas de ciudad e institución son dinámicas (`ƒ`) y no se enumeran como estáticas. El manifiesto conserva las rutas públicas canónicas; no se detectó ninguna ruta perdida. La cifra histórica 51 no corresponde a una pérdida actual de ruta.

Pendiente para la próxima etapa: migrar individualmente las páginas de carrera/capacitación, sin mezclarla con estos resúmenes.

## Cierre visual y funcional

- Matriz HTTP Supabase: 10/10 fichas con HTTP 200.
- Siglo 21 Concepción: 4 tarjetas, orden y contenido idénticos.
- Santa Bárbara Aguilares: 3 tarjetas, orden y contenido idénticos.
- Centro de Formación Tucumán Monteros: 3 capacitaciones, rutas `/capacitaciones/` preservadas.
- Academia Profesional Norte Aguilares: 3 ofertas académicas; no aparecen como training.
- Se realizaron 16 capturas temporales en Edge: local/Supabase, desktop 1440×900 y mobile 390×843.
- Viewport CSS comprobado en cada captura; `scrollWidth` fue 1425 en desktop y 375 en mobile, sin overflow horizontal accidental.
- Comparación local/Supabase: 0 diferencias significativas en cantidad, orden, nombres, tarjetas, links, imágenes, modalidad, duración, badges, wrapping o responsive.
- Las diferencias físicas del exportador Edge (JPEG/rasterizado, antialiasing y subpíxel) fueron aceptadas como no estructurales. Las capturas no se versionan.
- Tests: 41 aprobados. Lint: correcto. Build local: correcto. Build Supabase: correcto. Build: 50 páginas, consistente con las rutas dinámicas documentadas.
- `git diff --check`: correcto. No se modificaron componentes visuales, CSS, Vite ni Supabase.

Conclusión: **OFERTA INSTITUCIONAL SUPABASE VALIDADA**.
