# Catálogo público local vs Supabase V1

## Alcance

- Proyecto remoto: `get-definitivo` (`zomoblpgurchkxvkkutj`).
- Commit local comparado: `21aa6b71a08fd4e9c13400b247eac9eb57d70dc6`.
- La comparación usa exclusivamente la Data API y la publishable key; no usa `service_role`, contraseña de base ni una credencial privilegiada.
- Next.js todavía usa sus fuentes locales. El módulo paralelo no es importado por rutas ni componentes actuales.

## Fuentes y normalización

- Cities proviene de `cityPages` en `next-app/app/data/institutions.js`; las otras cinco fuentes son los archivos canónicos de `app/data`.
- UUID, `created_at` y `updated_at` se ignoran. Las relaciones UUID se reconstruyen como city slug, institution legacy key, career slug o training-program slug.
- La única normalización de alias es `licenciatura-en-administracion` a `lic-en-administracion` en los tres resúmenes legacy aprobados.
- Los campos locales ausentes materializados como `NULL` por el seed se comparan como `null`; `institutions[].careers` no es una entidad propia.
- JSONB compara sus claves de objeto sin depender de su orden físico; los arrays no se reordenan: galerías, referencias destacadas, planes, requisitos, FAQ y contenidos.

## Resultado de la comparación

- Fecha: 15 de agosto de 2026.
- RLS pública utilizada: sí, mediante la publishable key y sin credenciales privilegiadas.
- Field mismatches: 0.
- Missing local records: 0.
- Missing remote records: 0.
- Unexpected remote records: 0.

| Entidad | Local | Supabase |
| --- | ---: | ---: |
| cities | 3 | 3 |
| institutions | 10 | 10 |
| career_masters | 19 | 19 |
| academic_offerings | 30 | 30 |
| training_programs | 3 | 3 |
| training_offerings | 3 | 3 |
| Total | 68 | 68 |

La comparación finalizó correctamente con los seis conteos indicados y 68/68 registros. También verificó Siglo 21 multisede, Santa Bárbara multisede, Abogacía, Diagnóstico, el alias de Administración, Academia como oferta académica y Centro de Formación Tucumán como training.

## Seguridad y reversibilidad

- `next-app/lib/public-catalog/supabase-public-catalog.js` sólo permite HTTP `GET` a las seis tablas públicas y envía solamente `apikey`.
- No envía `Authorization` con la publishable key y valida las variables sólo al realizar una consulta; por ello el build sin variables continúa funcionando.
- No se conectó ninguna ruta, no se retiraron datos locales y no se modificó Supabase remoto.
