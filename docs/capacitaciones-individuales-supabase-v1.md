# Capacitaciones individuales Supabase v1

Se migraron `/monteros/centro-de-formacion-tucuman/capacitaciones/auxiliar-administrativo`, `/secretariado` y `/operador-de-pc` mediante `training_programs`, `training_offerings`, institución y ciudad. `PUBLIC_CATALOG_SOURCE` conserva local por defecto y Supabase no usa fallback silencioso. UUIDs quedan internos.

La comparación recursiva local/Supabase fue 3/3 equivalente, con 0 diferencias estructurales; una desigualdad previa fue sólo orden de serialización JSON. HTTP Supabase: 3/3 200. Edge generó 12 capturas temporales (local/Supabase, 1440×900 y 390×843): contenido, geometría y responsive equivalentes, sin overflow horizontal ni diferencias significativas. Academia Profesional Norte no participa.

Tests dedicados, lint, build local y build Supabase fueron correctos; ambos builds generan 50 páginas. Supabase remoto, TrainingPageClient, CSS y Vite no se modificaron. Las capturas no se versionan.

**3 CAPACITACIONES INDIVIDUALES VALIDADAS.**
