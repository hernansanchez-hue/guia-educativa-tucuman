# Community Manager — Academia Profesional Norte · Aguilares

- Career master nueva: `community-manager`; dominio académico.
- Offering: `academia-profesional-norte-aguilares-community-manager`.
- Institución/ciudad: `academia-profesional-norte-aguilares` / `aguilares`.
- Ruta: `/aguilares/academia-profesional-norte/carreras/community-manager`.

Datos literales de Vite: `Planificación de contenido, redes y métricas.`; modalidad presencial, duración 3 años, título Community Manager, sede Moreno 575, Aguilares, turnos Consultar, validez Sí, imagen `imageBank.video`, badge Nueva carrera, orden 2 y formulario habilitado. No hay WhatsApp propio: fallback institucional `3865 60 7711` (`543865607711`).

La propuesta pertenece a `defaultInstitutions[].careers`, `renderCareers()` y `showCareer()`: se preserva el dominio académico aunque el copy institucional use cursos/capacitaciones. No se usaron trainingPrograms, trainingOfferings ni `/capacitaciones/`.

## Validación

- HTTP 200: ruta Community Manager, Diseño Gráfico, ficha Academia y regresión esencial Aguilares.
- HTTP 404: Ventas Digitales, las tres rutas Academia bajo `/capacitaciones/`, Community Manager bajo Siglo 21/Santa Bárbara e institución inexistente.
- Formulario: contrato académico `localStorage.guiaEducativaLeads`, referencia Community Manager; sin semántica training.
- `CareerPageClient.js`, `carrera.css`, `TrainingPageClient.js`, CityPageClient, Vite y lockfiles intactos.
- `npm run lint` y `npm run build`: correctos; 50 páginas estáticas. Persiste la advertencia conocida por múltiples lockfiles sin modificación de configuración.

| Archivo | Viewport | Tema |
| --- | --- | --- |
| `community-manager-academia-aguilares-next-desktop-claro.png` | 1440 × 900 | Claro |
| `community-manager-academia-aguilares-next-mobile-claro.png` | 390 × 843 | Claro |

Capturas generadas con Chrome headless CLI sin CDP. El tema oscuro reutiliza `localStorage.guiaEducativaTheme` y CSS compartido; no se agregó lógica visual específica. Responsive y estructura de ficha conservados.
