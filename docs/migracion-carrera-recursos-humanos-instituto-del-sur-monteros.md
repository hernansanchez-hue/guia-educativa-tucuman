# Auditoría — Recursos Humanos · Instituto del Sur · Monteros

## Alcance

Auditoría documental exclusiva de la segunda carrera visible de Instituto del Sur
Monteros. No crea carrera maestra, offering, ruta ni navegación contextual.

## Identidad canónica Vite

La segunda entrada de la institución en `src/main.js` es:

```js
["Recursos Humanos", "Selección, capacitación y gestión de equipos.", imageBank.fair]
```

| Campo | Valor auditado |
| --- | --- |
| Nombre visible y canónico | Recursos Humanos |
| ID de tarjeta Vite | `recursos-humanos-<cinco caracteres aleatorios>` por `normalizeCareer()`; efímero |
| Slug canónico derivado | `recursos-humanos` |
| Imagen | `imageBank.fair` — `https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80` |
| Badge | Nueva carrera |
| Orden | 2 |
| Ruta futura | `/monteros/instituto-del-sur/carreras/recursos-humanos` |

No requiere mapping. El sufijo aleatorio Vite no puede convertirse en un identificador
persistente ni en una URL.

## Carrera maestra

No existe una carrera maestra `recursos-humanos` ni una entrada conceptualmente
idéntica en `next-app/app/data/careers.js`. La siguiente etapa deberá crear una única
carrera maestra nueva con `id` y `slug` `recursos-humanos`; esta auditoría no la
crea ni reutiliza una carrera por similitud de términos.

Vite normaliza literalmente estos datos generales para la entrada legada:

| Campo | Valor |
| --- | --- |
| Descripción / sobre | Selección, capacitación y gestión de equipos. |
| Perfil profesional | Profesional preparado para aplicar conocimientos y desarrollarse en su área. |
| Campo laboral | Ámbitos públicos y privados relacionados con la formación profesional. |
| Chips | Instituciones públicas y privadas; Organizaciones vinculadas al sector; Ejercicio profesional y consultoría |
| Plan | Primer año; Segundo año; Tercer año |
| Requisitos | DNI; Título secundario; Formulario de inscripción |
| FAQ 1 | ¿Cuándo comienzan las inscripciones? / Consultá con la institución para conocer las próximas fechas. |
| FAQ 2 | ¿Cómo solicito más información? / Podés utilizar WhatsApp o el formulario de esta página. |

## Futura offering independiente

| Campo | Valor auditado |
| --- | --- |
| ID previsto | `instituto-del-sur-monteros-recursos-humanos` |
| `institutionId` | `instituto-del-sur-monteros` |
| `citySlug` | `monteros` |
| `careerId` | `recursos-humanos` (a crear) |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Recursos Humanos |
| Sede heredada | Av. Mitre 420, Concepción |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.fair` / URL anterior |
| Badge | Nueva carrera |
| Visible | Sí |
| Orden | 2 |
| Formulario | Habilitado |
| WhatsApp propio | No; usa el institucional |
| Fallback institucional | `3865 44 8712` → `543865448712` |

La sede canónica heredada es inconsistente con Monteros y debe preservarse sin
corregirla ni agregarla como bloque nuevo a la interfaz.

## Plantilla y puerta de seguridad

Recursos Humanos utiliza en Vite la misma estructura contextual de carreras legadas:
hero, hechos, tabs sticky, contenidos, sidebar, formulario, WhatsApp y footer.
`CareerPageClient.js`, `carrera.css`, formulario, `localStorage.guiaEducativaLeads`,
tabs, FAQ, sidebar y footer son reutilizables sin cambios si la futura ficha respeta
los datos normalizados anteriores.

No hay diferencia estructural comprobada. La futura implementación deberá validar
contra la demo antes de alterar CSS y no autoriza avanzar a Administración de
Empresas.

## Archivos previstos

- `next-app/app/data/careers.js`
- `next-app/app/data/offerings.js`
- `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`
- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`

No se prevén cambios en Vite, CSS, componentes compartidos, dependencias o lockfiles
salvo diferencia canónica futura demostrada.
