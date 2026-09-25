# Auditoría — Instituto Santa Bárbara | Aguilares

## Identidad

| Campo | Valor |
| --- | --- |
| Nombre | Instituto Santa Bárbara |
| Ciudad / slug | Aguilares / `aguilares` |
| Slug público | `instituto-santa-barbara` |
| ID futuro | `instituto-santa-barbara-aguilares` |
| Tipo | Terciario Privado |
| Orden | 2 |
| Ruta futura | `/aguilares/instituto-santa-barbara` |

No reutilizar `instituto-santa-barbara-concepcion`; mismo slug público, sedes y offerings independientes.

## Datos Vite y comparación con Concepción

Vite define la misma entrada compartida para Concepción y Aguilares: logo `ISB`, portada `imageBank.santa`, medio “Video institucional”, galería/marquee compartida, slogan “Formación técnica para integrarte rápido al mundo laboral.”, descripción “Formación terciaria con valores, prácticas y salida laboral.”, WhatsApp `3865 55 1188` y dirección `Belgrano 810, Aguilares`.

La dirección Aguilares aparece incluso en la sede Concepción: anomalía canónica heredada que debe preservarse. No se identificaron web ni horarios independientes en Vite. La plantilla puede reutilizar `InstitutionPageClient.js`, la ruta dinámica y el CSS institucional sin cambios estructurales.

## Ofertas visibles

| Orden | Nombre | Slug previsto | Imagen | Badge | Dominio |
| --- | --- | --- | --- | --- | --- |
| 1 | Instrumentación Quirúrgica | `instrumentacion-quirurgica` | `imageBank.lab` | Inscripciones abiertas | Carrera académica |
| 2 | Laboratorio de Análisis Clínicos | `laboratorio-de-analisis-clinicos` | `imageBank.classroom` | Nueva carrera | Carrera académica |
| 3 | Diagnóstico por Imágenes | `diagnostico-por-imagenes` | `imageBank.students` | Próximo ingreso | Carrera académica |

Vite crea IDs legacy no estables con sufijo aleatorio; deben sustituirse por IDs estables en futuras offerings. La primera oferta futura es Instrumentación Quirúrgica, cuyo career master equivalente ya existe. No se audita en profundidad ni se implementa aquí.
