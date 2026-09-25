# Auditoría — Diseño Gráfico · Academia Profesional Norte · Aguilares

## Alcance y dominio canónico

La primera oferta visible de Academia Profesional Norte es **Diseño Gráfico**. En la demo Vite se declara como el primer elemento del arreglo `defaultInstitutions[].careers` de la institución, se convierte mediante `normalizeCareer()`, se muestra con `renderCareers()` y su botón abre la ficha por `showCareer()`. Por ello su dominio canónico es **académico**, aun cuando el copy institucional diga “Cursos prácticos” y el slogan mencione “Capacitaciones”.

No corresponde usar `trainingProgram`, `trainingOffering` ni `/capacitaciones/` para esta oferta. La futura arquitectura es:

```
career master + offering + institution
/aguilares/academia-profesional-norte/carreras/diseno-grafico
```

La ruta `/aguilares/academia-profesional-norte/capacitaciones/diseno-grafico` no corresponde y debe permanecer inexistente.

## Carrera maestra futura

La búsqueda en `next-app/app/data/careers.js` no devuelve una carrera maestra equivalente; corresponde una **nueva** carrera maestra, sin datos de ciudad, sede, institución ni WhatsApp.

- `id`: `diseno-grafico`
- `slug`: `diseno-grafico`
- `name`: `Diseño Gráfico`
- Descripción literal de Vite: `Piezas visuales, identidad y herramientas de diseño.`

Como Vite la declara con el formato legado de tres elementos, sus datos generales son defaults de `normalizeCareer()` y deberán conservarse literalmente:

- Perfil profesional: `Profesional preparado para aplicar conocimientos y desarrollarse en su área.`
- Campo laboral: `Ámbitos públicos y privados relacionados con la formación profesional.`
- Descripción ampliada / about: `Piezas visuales, identidad y herramientas de diseño.`
- Plan de estudios: `Primer año`, `Segundo año`, `Tercer año`.
- Requisitos: `DNI`, `Título secundario`, `Formulario de inscripción`.
- FAQ:
  - `¿Cuándo comienzan las inscripciones?` — `Consultá con la institución para conocer las próximas fechas.`
  - `¿Cómo solicito más información?` — `Podés utilizar WhatsApp o el formulario de esta página.`

No existe contenido específico adicional en Vite para esta carrera y no debe inventarse.

## Offering futura auditada

- ID: `academia-profesional-norte-aguilares-diseno-grafico`
- `institutionId`: `academia-profesional-norte-aguilares`
- `citySlug`: `aguilares`
- `careerId`: `diseno-grafico`
- Modalidad: `Presencial` (default legado).
- Duración: `3 años` (default legado).
- Título: `Diseño Gráfico` (el nombre de la oferta).
- Sede: `Moreno 575, Aguilares` (dirección institucional).
- Turnos: `Consultar` (default legado).
- Validez: `Sí` (default legado).
- Imagen: `imageBank.design`.
- Badge: `Inscripciones abiertas` (primer índice de `careerCardBadge()`).
- Visible: sí.
- Orden: 1.
- Formulario: habilitado (`true`, default legado).
- WhatsApp propio: no existe. Fallback institucional: `3865 60 7711` (normalizado por la lógica actual como `543865607711`).

No requiere mapping especial: `careerId` y slug previstos coinciden.

## Plantilla y riesgos

La futura ficha puede reutilizar íntegramente `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar sticky, footer y fallback de WhatsApp. No se observan diferencias estructurales en Vite que justifiquen una modificación de esos componentes compartidos.

Riesgos a preservar al implementar: el copy institucional puede seguir hablando de cursos/capacitaciones, pero la URL, la relación de datos y la navegación son académicas; no transformar esa anomalía textual en “carreras” por criterio editorial. Tampoco habilitar las tres rutas antes de crear explícitamente la carrera maestra, offering y parámetro estático correspondiente.

## Segunda oferta visible (registro limitado)

1. Diseño Gráfico — orden 1.
2. **Community Manager** — slug y `careerId` previstos: `community-manager`; dominio académico; carrera maestra **nueva** (no existe equivalente actual en `careers.js`); orden 2.

No se realizó auditoría profunda ni implementación de Community Manager. La tercera oferta, Ventas Digitales, también permanece fuera del alcance.
