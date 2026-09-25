# Auditoría de cierre del catálogo público v1

## Estado actual

Con `PUBLIC_CATALOG_SOURCE=supabase` están conectadas `/ciudades`, las tres páginas de ciudad, diez fichas institucionales, 30 ofertas académicas, tres resúmenes training, 30 detalles académicos y tres detalles de capacitación. Home (`/`) conserva `HomeClient` local/editorial. No existen actualmente `/carreras`, `/carreras/[slug]`, `/cursos-docentes`, `/cursos-docentes/[slug]`, `/nosotros`, `/contacto` ni `/admin` dentro de `next-app/app`.

## Dependencias locales

`institutions.js`, `careers.js`, `offerings.js`, `trainingPrograms.js` y `trainingOfferings.js` siguen siendo necesarios para el modo local y para tests/comparadores. Los adaptadores de detalle importan sus helpers locales para el modo local deliberado; los scripts y tests los importan como fixtures. Las rutas migradas seleccionan Supabase según `PUBLIC_CATALOG_SOURCE`; no se detectó fallback local visible accidental en modo Supabase.

## Routing y rendering

Las rutas `[ciudad]`, `[ciudad]/[institucion]`, carreras y capacitaciones tienen `dynamicParams = false` y `generateStaticParams` con listas manuales. Esto genera 50 páginas en build y responde 404 para parámetros nuevos, aunque los adaptadores puedan leer registros remotos. `notFound()` cubre ciudad, institución, carrera y capacitación inexistentes sin render vacío.

Los readers REST públicos no declaran `cache`, `revalidate`, `force-cache` ni `no-store`. No hay estrategia explícita de revalidación. Para registros creados después del deploy, las rutas existentes podrán requerir una política de cache explícita; las rutas nuevas quedan bloqueadas hoy por los parámetros estáticos.

## Simulación de altas

| Alta futura | Resultado actual |
|---|---|
| Ciudad nueva | Bloqueada completamente: ruta y listas estáticas; requiere código + redeploy. |
| Institución nueva en ciudad actual | Bloqueada parcialmente/completamente por `generateStaticParams` y `dynamicParams=false`; requiere código + redeploy. |
| Carrera nueva en institución existente | Bloqueada por lista de parámetros académicos; requiere código + redeploy. |
| Capacitación nueva | Bloqueada por lista de parámetros training; requiere código + redeploy. |
| Institución y carrera nuevas | La capa de datos puede resolver relaciones, pero routing y páginas generales bloquean visibilidad; requiere código + redeploy. |

## Blockers y orden recomendado

El catálogo es funcional desde Supabase, pero no está preparado para altas públicas sin código. Los blockers son: rutas estáticas/manuales, Home y rutas generales aún locales/no implementadas, y ausencia de estrategia de cache/revalidación/SEO.

Orden recomendado: (1) definir rendering dinámico y cache/revalidación; (2) eliminar los bloqueos de `dynamicParams` y listas manuales conservando 404; (3) migrar Home en sus datos de catálogo; (4) abordar rutas generales y SEO/sitemap/metadata. No ejecutar estas etapas dentro de esta auditoría.
