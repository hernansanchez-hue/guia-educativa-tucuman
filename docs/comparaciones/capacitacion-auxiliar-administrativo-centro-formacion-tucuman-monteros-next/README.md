# Auxiliar Administrativo — Centro de Formación Tucumán, Monteros

- `trainingProgram`: `auxiliar-administrativo`, definido en `trainingPrograms.js` sin ciudad ni institución.
- `trainingOffering`: `centro-de-formacion-tucuman-monteros-auxiliar-administrativo`, en `trainingOfferings.js`.
- `institutionId`: `centro-de-formacion-tucuman-monteros`; `citySlug`: `monteros`.
- Ruta: `/monteros/centro-de-formacion-tucuman/capacitaciones/auxiliar-administrativo`.
- Separación verificada: no existe en `careers.js`, `offerings.js`, `/carreras/` ni `/cursos-docentes/`.
- Presentación: `TrainingPageClient.js`, componente específico que reutiliza clases visuales de la ficha de carrera sin depender de sus datos ni modificar `CareerPageClient.js` o `carrera.css`.
- Formulario: conserva `localStorage.guiaEducativaLeads` por compatibilidad, agregando `leadType: training`, `training`, `trainingProgramId` e `institutionId`; `career` se conserva como campo legado de visualización del Centro de Control.
- WhatsApp: fallback institucional `3863 40 2100`, normalizado como `543863402100`, con mensaje contextual.

| Archivo | Viewport | Tema | Estado |
| --- | --- | --- | --- |
| `auxiliar-administrativo-next-desktop-claro.png` | 1440 × 900 | Claro | PNG válido, 381398 bytes |
| `auxiliar-administrativo-next-mobile-claro.png` | 390 × 843 | Claro | PNG válido, 199205 bytes |

La geometría responsive y el mecanismo compartido de tema claro/oscuro permanecen disponibles; las capturas solicitadas corresponden al tema claro. Lint, build y la matriz HTTP finalizaron correctamente. Secretariado y Operador de PC siguen visibles sin ruta; Instituto San Miguel y Aguilares siguen en 404.
