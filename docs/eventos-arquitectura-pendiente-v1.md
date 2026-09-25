# Eventos — arquitectura pendiente v1

## Fuente Vite

La SPA contiene `#eventsPage`, abierto por `showInfoPage('events')`. La vista usa seis tarjetas HTML simuladas, filtros de texto, ciudad, categoría, modalidad y fecha, botones de categoría, agenda mensual y CTA comercial. Las funciones locales `filterEvents`, `setEventCategory` y `viewEvent` operan sobre atributos `data-*`; esta última sólo muestra un aviso de ficha futura.

## Clasificación

Eventos requiere un modelo propio antes de una migración dinámica canónica. Sus registros incluyen organizador institucional, ciudad/virtualidad, categoría, modalidad, fecha, imagen, agenda y futura ficha individual; no pertenecen al modelo de carreras académicas ni al de capacitaciones ya aprobado.

No se creó `/eventos`, no se agregaron arrays locales nuevos y no se modificó Supabase. La ruta se mantiene pendiente para evitar una fuente de datos paralela y enlaces públicos que no puedan sostenerse desde el futuro módulo institucional de eventos.

## Navegación

El header conserva la entrada canónica Eventos sin destino Next mientras la ruta está pendiente. Se completaron los enlaces de footer existentes `Lo Próximo` y `Quiénes somos` hacia `/nosotros`, que ya está migrada. Cursos Docentes continúa pendiente y no se creó ningún enlace nuevo.
