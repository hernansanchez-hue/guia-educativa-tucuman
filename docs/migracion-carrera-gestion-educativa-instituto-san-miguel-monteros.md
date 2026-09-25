# Auditoría — Gestión Educativa | Instituto San Miguel | Monteros

## Identificación canónica Vite

La segunda carrera visible real de Instituto San Miguel en la vista de Monteros es **Gestión Educativa**. La demo la declara como segundo arreglo legacy dentro de `careers`; por lo tanto, su ID de ejecución es inestable: `gestion-educativa-<sufijo-aleatorio>` generado por `normalizeCareer()`.

| Campo | Valor confirmado |
| --- | --- |
| Nombre visible y canónico | Gestión Educativa |
| Slug futuro | `gestion-educativa` |
| ID legado | `gestion-educativa-<sufijo-aleatorio>` |
| Orden | 2 |
| Imagen | `imageBank.students` — `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80` |
| Badge derivado | Nueva carrera |
| Descripción | Herramientas para coordinar proyectos institucionales. |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Gestión Educativa |
| Sede | Laprida 660, Monteros |
| Turnos | Consultar |
| Validez | Sí |
| Formulario | Habilitado |
| WhatsApp propio | No existe |
| Fallback institucional | `3863 47 6400` → `543863476400` |

## Datos académicos generales

Como la fuente es una carrera legacy, Vite asigna literalmente los valores genéricos siguientes:

- Perfil profesional: Profesional preparado para aplicar conocimientos y desarrollarse en su área.
- Campo laboral: Ámbitos públicos y privados relacionados con la formación profesional.
- Plan de estudios: Primer año; Segundo año; Tercer año.
- Requisitos: DNI; Título secundario; Formulario de inscripción.
- FAQ: “¿Cuándo comienzan las inscripciones?” / “Consultá con la institución para conocer las próximas fechas.” y “¿Cómo solicito más información?” / “Podés utilizar WhatsApp o el formulario de esta página.”

El formulario es el contrato académico existente de Vite: nombre, teléfono, email, turno y consulta. El lead se guarda en `localStorage.guiaEducativaLeads` con la carrera actual y el botón de WhatsApp usa el texto “Hola, quiero información sobre Gestión Educativa”.

## Career master futura

No existe una carrera conceptualmente idéntica en `next-app/app/data/careers.js`; la búsqueda no devuelve `gestion-educativa` ni Gestión Educativa. La próxima etapa deberá crear una career master nueva e independiente:

- `careerId`: `gestion-educativa`.
- `slug`: `gestion-educativa`.

No corresponde reutilizar una entidad por coincidencia parcial de palabras.

## Offering futura y ruta

- `institutionId`: `instituto-san-miguel-monteros`.
- `citySlug`: `monteros`.
- `careerId`: `gestion-educativa`.
- Offering ID futura: `instituto-san-miguel-monteros-gestion-educativa`.
- Ruta futura: `/monteros/instituto-san-miguel/carreras/gestion-educativa`.
- Mapping: no requerido, porque el ID futuro y el slug coinciden.

La offering deberá contener sólo los datos contextuales auditados: presencial, 3 años, título Gestión Educativa, Laprida 660, Monteros, turnos a consultar, validez Sí, `imageBank.students`, badge Nueva carrera, visible, orden 2, formulario habilitado y fallback institucional de WhatsApp.

## Plantilla y límites

La página puede reutilizar sin cambios `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y lógica de WhatsApp. No se detecta una estructura distinta ni un componente cliente adicional.

Esta auditoría no implementa Gestión Educativa, no habilita rutas, no conecta su tarjeta y no avanza a Acompañante Terapéutico ni a Aguilares.
