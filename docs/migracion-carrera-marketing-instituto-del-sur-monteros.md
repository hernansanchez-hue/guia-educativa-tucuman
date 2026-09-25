# Auditoría — Marketing · Instituto del Sur · Monteros

## Alcance

Auditoría documental exclusiva de la primera carrera visible de Instituto del Sur
Monteros. No crea carrera maestra, offering, ruta ni navegación contextual.

## Identidad canónica Vite

La primera entrada de la institución en `src/main.js` es:

```js
["Marketing", "Planificación comercial, comunicación y campañas digitales.", imageBank.design]
```

| Campo | Valor auditado |
| --- | --- |
| Nombre visible y completo | Marketing |
| ID de tarjeta Vite | `marketing-<cinco caracteres aleatorios>` por `normalizeCareer()`; efímero, no reutilizable como ID definitivo |
| Slug canónico derivado | `marketing` |
| Imagen | `imageBank.design` — `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80` |
| Badge | Inscripciones abiertas |
| Orden | 1 |
| Ruta futura prevista | `/monteros/instituto-del-sur/carreras/marketing` |

No requiere mapping: el nombre se normaliza directamente a `marketing`. El sufijo
aleatorio de la tarjeta Vite nunca debe filtrarse a URL, career master u offering.

## Carrera maestra

No existe una carrera maestra `marketing` ni otra entrada conceptualmente idéntica
en `next-app/app/data/careers.js`. La siguiente etapa deberá crear una única carrera
maestra nueva con `id` y `slug` `marketing`; esta auditoría no la crea.

Los datos generales literalmente normalizados por Vite para una carrera legada son:

| Campo | Valor |
| --- | --- |
| Descripción / sobre | Planificación comercial, comunicación y campañas digitales. |
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
| ID previsto | `instituto-del-sur-monteros-marketing` |
| `institutionId` | `instituto-del-sur-monteros` |
| `citySlug` | `monteros` |
| `careerId` | `marketing` (a crear en la siguiente etapa) |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Marketing |
| Sede heredada | Av. Mitre 420, Concepción |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.design` / URL anterior |
| Badge | Inscripciones abiertas |
| Visible | Sí |
| Orden | 1 |
| Formulario | Habilitado |
| WhatsApp propio | No; la carrera legada toma el institucional |
| Fallback institucional | `3865 44 8712` → `543865448712` |

La dirección canónica es inconsistente con la ciudad pero debe preservarse como dato
heredado, sin inventar ni corregir información visible.

## Plantilla, funcionamiento y puerta de seguridad

La ficha Vite de una carrera legada usa la plantilla contextual común: hero, seis
hechos, tabs sticky, descripción, perfil, campo laboral, plan, requisitos, FAQ,
sidebar, formulario, WhatsApp y footer. `CareerPageClient.js`, `carrera.css`,
formulario, `localStorage.guiaEducativaLeads`, tabs, FAQ, sidebar y footer son
reutilizables sin cambios si la nueva carrera maestra conserva esta estructura.

No hay evidencia de estructura diferencial. Aun así, la siguiente etapa debe validar
la ficha contra la demo antes de corregir CSS. No autoriza avanzar a Recursos Humanos
ni crear rutas genéricas.

## Archivos previstos para la próxima etapa

- `next-app/app/data/careers.js` (nueva carrera maestra Marketing).
- `next-app/app/data/offerings.js` (offering exclusiva Monteros).
- `next-app/app/[ciudad]/[institucion]/carreras/[carrera]/page.js`.
- `next-app/app/[ciudad]/[institucion]/InstitutionPageClient.js`.

No se prevén cambios en Vite, CSS, paquetes, lockfiles o componentes compartidos,
salvo que una validación posterior demuestre una diferencia canónica real.
