# Auditoría — Community Manager · Academia Profesional Norte · Aguilares

## Dominio y ruta futura

Community Manager es la segunda oferta visible de Academia Profesional Norte. Vite la declara en `defaultInstitutions[].careers`, la normaliza con `normalizeCareer()`, la lista mediante `renderCareers()` y abre su ficha con `showCareer()`. Su dominio canónico es **académico**: `career master` + `offering`.

- Ruta futura: `/aguilares/academia-profesional-norte/carreras/community-manager`.
- La ruta `/aguilares/academia-profesional-norte/capacitaciones/community-manager` no aplica y debe seguir inexistente.
- No corresponde crear `trainingProgram` ni `trainingOffering`.

## Career master futura

La búsqueda en `next-app/app/data/careers.js` no encuentra una equivalencia conceptual; corresponde una **nueva** carrera maestra:

- `id`: `community-manager`
- `slug`: `community-manager`
- `name`: `Community Manager`
- Descripción literal: `Planificación de contenido, redes y métricas.`

Vite la declara con el formato legado de tres elementos. Sus datos generales son los defaults literales de `normalizeCareer()`:

- Perfil profesional: `Profesional preparado para aplicar conocimientos y desarrollarse en su área.`
- Campo laboral: `Ámbitos públicos y privados relacionados con la formación profesional.`
- About: `Planificación de contenido, redes y métricas.`
- Plan: `Primer año`, `Segundo año`, `Tercer año`.
- Requisitos: `DNI`, `Título secundario`, `Formulario de inscripción`.
- FAQ:
  - `¿Cuándo comienzan las inscripciones?` — `Consultá con la institución para conocer las próximas fechas.`
  - `¿Cómo solicito más información?` — `Podés utilizar WhatsApp o el formulario de esta página.`

No existe contenido específico adicional en Vite; no debe inventarse.

## Offering futura auditada

- ID: `academia-profesional-norte-aguilares-community-manager`
- `institutionId`: `academia-profesional-norte-aguilares`
- `citySlug`: `aguilares`
- `careerId`: `community-manager`
- Modalidad: `Presencial` (default legado).
- Duración: `3 años` (default legado).
- Título: `Community Manager`.
- Sede: `Moreno 575, Aguilares`.
- Turnos: `Consultar` (default legado).
- Validez: `Sí` (default legado).
- Imagen: `imageBank.video`.
- Badge: `Nueva carrera` (segundo índice de `careerCardBadge()`).
- Visible: sí.
- Orden: 2.
- Formulario: habilitado (`true`, default legado).
- WhatsApp propio: no existe. Fallback institucional: `3865 60 7711`, normalizado por la lógica existente a `543865607711`.

No requiere mapping: `careerId` y slug previstos coinciden.

## Plantilla y límites

Puede reutilizar `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar sticky, footer y WhatsApp sin diferencia estructural documentada. Debe preservarse la anomalía visible de copy institucional “cursos/capacitaciones” mientras los datos y la ruta continúan en dominio académico.

## Tercera y última oferta (registro limitado)

3. **Ventas Digitales** — slug y `careerId` previstos: `ventas-digitales`; dominio académico; carrera maestra **nueva** (no existe equivalente actual en `careers.js`); orden 3.

No se realizó auditoría profunda ni implementación de Ventas Digitales. Community Manager y Ventas Digitales siguen pendientes.
