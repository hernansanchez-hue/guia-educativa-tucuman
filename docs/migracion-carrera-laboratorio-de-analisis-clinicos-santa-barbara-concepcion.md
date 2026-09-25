# Auditoría — Laboratorio de Análisis Clínicos · Instituto Santa Bárbara · Concepción

## Fuente canónica e identidad

La fuente de verdad es la segunda entrada de `careers` de Instituto Santa Bárbara en `src/main.js` líneas 35–55. Es efectivamente la segunda tarjeta, después de Instrumentación Quirúrgica y antes de Diagnóstico por Imágenes.

| Campo | Valor canónico |
| --- | --- |
| Nombre visible y completo | Laboratorio de Análisis Clínicos |
| ID actual de tarjeta | `laboratorio-de-analisis-clinicos` |
| Slug canónico | `laboratorio-de-analisis-clinicos` |
| Imagen | `imageBank.classroom` → `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80` |
| Badge | Nueva carrera |
| Orden de tarjeta | 2.º (índice 1) |
| Descripción | Técnicas de laboratorio, muestras y protocolos de calidad. |

El ID y slug están ya definidos, de forma consistente, para la segunda tarjeta en `next-app/app/data/institutions.js` líneas 125–133. No existe aún carrera maestra ni offering contextual equivalente.

## Datos de carrera maestra heredados de Vite

Vite convierte las entradas heredadas mediante `normalizeCareer()` en `src/main.js` líneas 179–213. Como esta carrera usa el formato heredado de tres valores, sus datos resultantes son:

| Campo | Valor |
| --- | --- |
| Descripción y sobre la carrera | Técnicas de laboratorio, muestras y protocolos de calidad. |
| Perfil profesional | Profesional preparado para aplicar conocimientos y desarrollarse en su área. |
| Campo laboral | Ámbitos públicos y privados relacionados con la formación profesional. |
| Plan de estudios | Primer año; Segundo año; Tercer año |
| Requisitos | DNI; Título secundario; Formulario de inscripción |
| FAQ 1 | ¿Cuándo comienzan las inscripciones? — Consultá con la institución para conocer las próximas fechas. |
| FAQ 2 | ¿Cómo solicito más información? — Podés utilizar WhatsApp o el formulario de esta página. |

La futura carrera maestra debe contener solo esos datos generales, sin ciudad, institución, sede, orden ni WhatsApp.

## Offering canónica

La institución fuente es Instituto Santa Bárbara (`institutionId: instituto-santa-barbara`), publicada para Concepción en el flujo que se está migrando. Los valores heredados por `normalizeCareer()` son:

| Campo | Valor |
| --- | --- |
| ID de offering propuesto | `instituto-santa-barbara-concepcion-laboratorio-de-analisis-clinicos` |
| `citySlug` | `concepcion` |
| `institutionId` | `instituto-santa-barbara` |
| `careerId` | `laboratorio-de-analisis-clinicos` |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Laboratorio de Análisis Clínicos |
| Sede | Belgrano 810, Aguilares |
| Turnos | Consultar |
| Validez | Sí |
| Imagen | `imageBank.classroom` |
| Badge | Nueva carrera |
| Visible | Sí |
| Orden | 2 |
| WhatsApp propio de offering | No |
| Fallback institucional | 3865 55 1188 |

El fallback se normaliza por la lógica ya existente a `543865551188`; el mensaje contextual usa el nombre literal de la carrera.

## Formulario, navegación y estructura

La ficha Vite se genera con `showCareer()` en `src/main.js` líneas 694–732. La ficha Next reutiliza exactamente `CareerPageClient.js`, que mantiene campos, labels, validación, reset y escritura de `localStorage.guiaEducativaLeads`. La nueva offering solo proveerá el contexto.

La segunda tarjeta se renderiza en `InstitutionPageClient.js`; se conectará solo a `/concepcion/instituto-santa-barbara/carreras/laboratorio-de-analisis-clinicos`. Instrumentación debe mantener su navegación, mientras que Diagnóstico por Imágenes continuará sin ruta contextual.

## Puerta de seguridad

Laboratorio de Análisis Clínicos usa el mismo formato heredado, la misma ficha contextual, los mismos datos normalizados, formulario, tabs, FAQ, sidebar, footer y lógica de WhatsApp que Instrumentación Quirúrgica. No requiere cambios en:

- `CareerPageClient.js`;
- `carrera.css`;
- formulario compartido;
- tabs, FAQ, sidebar, footer o lógica WhatsApp.

La puerta de seguridad queda aprobada para continuar con la capa de datos, la ruta contextual acotada y el enlace de la segunda tarjeta.
