# Auditoría — Acompañante Terapéutico | Instituto San Miguel | Monteros

## Identificación canónica Vite

La tercera y última carrera visible de Instituto San Miguel en Monteros es **Acompañante Terapéutico**. Está declarada como arreglo legacy y `normalizeCareer()` le asigna un ID inestable: `acompanante-terapeutico-<sufijo-aleatorio>`.

El slug canónico se determinó directamente desde el normalizador Vite, no por suposición: `normalizeCityText()` aplica NFD, elimina los signos diacríticos y convierte a minúsculas; por ello `ñ` pasa a `n`. Luego `slugifyCareer()` sustituye los separadores no alfanuméricos por guiones. El resultado exacto es `acompanante-terapeutico`.

| Campo | Valor confirmado |
| --- | --- |
| Nombre visible y canónico | Acompañante Terapéutico |
| ID legado | `acompanante-terapeutico-<sufijo-aleatorio>` |
| Slug canónico futuro | `acompanante-terapeutico` |
| Imagen | `imageBank.lab` — `https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80` |
| Badge derivado | Próximo ingreso |
| Orden | 3 |
| Descripción | Intervención, apoyo y seguimiento en contextos de cuidado. |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Acompañante Terapéutico |
| Sede | Laprida 660, Monteros |
| Turnos | Consultar |
| Validez | Sí |
| Formulario | Habilitado |
| WhatsApp propio | No existe |
| Fallback institucional | `3863 47 6400` → `543863476400` |

## Career master

No existe en `next-app/app/data/careers.js` una carrera conceptualmente idéntica. La siguiente etapa deberá crear una nueva career master independiente:

- `careerId`: `acompanante-terapeutico`.
- `slug`: `acompanante-terapeutico`.

## Datos generales Vite

Por ser legacy, Vite entrega literalmente:

- Perfil profesional: Profesional preparado para aplicar conocimientos y desarrollarse en su área.
- Campo laboral: Ámbitos públicos y privados relacionados con la formación profesional.
- Plan de estudios: Primer año; Segundo año; Tercer año.
- Requisitos: DNI; Título secundario; Formulario de inscripción.
- FAQ: “¿Cuándo comienzan las inscripciones?” / “Consultá con la institución para conocer las próximas fechas.” y “¿Cómo solicito más información?” / “Podés utilizar WhatsApp o el formulario de esta página.”

El formulario reutiliza nombre, teléfono, email, turno y consulta; persiste `career: "Acompañante Terapéutico"` en `localStorage.guiaEducativaLeads`. WhatsApp genera el mensaje contextual con el fallback institucional.

## Futura offering y ruta

- `institutionId`: `instituto-san-miguel-monteros`.
- `citySlug`: `monteros`.
- `careerId`: `acompanante-terapeutico`.
- Offering ID futura: `instituto-san-miguel-monteros-acompanante-terapeutico`.
- Ruta futura: `/monteros/instituto-san-miguel/carreras/acompanante-terapeutico`.
- Mapping: no requerido; el ID y slug futuro coinciden.

La offering deberá contener exclusivamente los valores contextuales auditados: presencial, 3 años, título Acompañante Terapéutico, sede Laprida 660, Monteros, turnos Consultar, validez Sí, `imageBank.lab`, badge Próximo ingreso, visible, orden 3, formulario habilitado y fallback de WhatsApp.

## Plantilla y cierre de Monteros

La estructura reutiliza sin cambios `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y WhatsApp. No requiere estructura diferente ni componentes adicionales.

Esta es la última carrera visible de Instituto San Miguel y, según la demo actual, la última oferta pendiente para cerrar Monteros. Esta auditoría no la implementa, no habilita ruta alguna y no avanza a Aguilares.
