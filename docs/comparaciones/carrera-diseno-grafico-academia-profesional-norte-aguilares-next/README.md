# Diseño Gráfico — Academia Profesional Norte · Aguilares

## Contexto migrado

- Career master nueva: `diseno-grafico`.
- Dominio: académico (`career master` + `offering`).
- Offering: `academia-profesional-norte-aguilares-diseno-grafico`.
- Institución: `academia-profesional-norte-aguilares`.
- Ciudad: `aguilares`.
- Ruta: `/aguilares/academia-profesional-norte/carreras/diseno-grafico`.

Se preserva la anomalía canónica de Vite: la institución puede describir sus propuestas como cursos o capacitaciones, pero Diseño Gráfico pertenece a `defaultInstitutions[].careers`, es renderizada por `renderCareers()` y navega mediante `showCareer()`. Por eso no se crearon `trainingPrograms`, `trainingOfferings` ni rutas bajo `/capacitaciones/`.

## Datos auditados y aplicados

- Descripción: “Piezas visuales, identidad y herramientas de diseño.”
- Perfil: “Profesional preparado para aplicar conocimientos y desarrollarse en su área.”
- Campo laboral: “Ámbitos públicos y privados relacionados con la formación profesional.”
- Plan: Primer año, Segundo año, Tercer año.
- Requisitos: DNI, Título secundario, Formulario de inscripción.
- FAQ y defaults genéricos: conservados literalmente desde Vite.
- Modalidad: Presencial; duración: 3 años; título: Diseño Gráfico; sede: Moreno 575, Aguilares; turnos: Consultar; validez: Sí.
- Imagen: `imageBank.design`; badge: Inscripciones abiertas; orden: 1; formulario: habilitado.
- No hay WhatsApp propio: se aplica el fallback institucional `3865 60 7711`, normalizado a `543865607711`.

## Validación HTTP y funcional

- HTTP 200: la ruta de Diseño Gráfico, la ficha de Academia, las rutas generales, las cuatro carreras de Siglo 21 Aguilares y las tres de Santa Bárbara Aguilares.
- HTTP 404: Community Manager, Ventas Digitales, Diseño Gráfico bajo `/capacitaciones/`, Diseño Gráfico bajo Siglo 21, bajo Santa Bárbara, institución inexistente y carrera inexistente.
- El formulario es el contrato académico existente: campos, turnos, validación y persistencia en `localStorage.guiaEducativaLeads` con `career: Diseño Gráfico`; no usa `leadType: training` ni `trainingProgramId`.
- La tarjeta Diseño Gráfico navega; Community Manager y Ventas Digitales permanecen visibles sin ruta.

## Validación visual

Capturas generadas con Chrome headless CLI, sin CDP:

| Archivo | Viewport | Tema | Validación |
| --- | --- | --- | --- |
| `diseno-grafico-academia-aguilares-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido; hero, facts, tabs, sidebar, formulario, WhatsApp y footer conservados. |
| `diseno-grafico-academia-aguilares-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido; apilado responsive, facts, hero y navegación conservados. |

La variante oscura continúa usando el mecanismo compartido `localStorage.guiaEducativaTheme` y los selectores existentes de la plantilla. No se añadió lógica de tema, CSS ni DOM específico para Diseño Gráfico.

`CareerPageClient.js`, `carrera.css` y `TrainingPageClient.js` permanecen intactos. No se observaron diferencias estructurales que requieran corrección. Las variaciones posibles de imágenes remotas corresponden a carga/rasterizado, no a datos ni geometría.

## Validaciones técnicas

- `npm run lint`: correcto.
- `npm run build`: correcto; 49 páginas estáticas.
- `npm start`: validado temporalmente en el puerto 3213.
- Persiste la advertencia conocida de Next.js por los dos lockfiles; no se modificaron configuración ni lockfiles.
