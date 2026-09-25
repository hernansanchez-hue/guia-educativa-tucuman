# Validación — Gestión Educativa | Instituto San Miguel | Monteros

## Contexto implementado

- Career master nueva: `gestion-educativa`.
- `institutionId`: `instituto-san-miguel-monteros`.
- `citySlug`: `monteros`.
- Offering: `instituto-san-miguel-monteros-gestion-educativa`.
- Ruta: `/monteros/instituto-san-miguel/carreras/gestion-educativa`.

## Datos canónicos Vite

La descripción es **Herramientas para coordinar proyectos institucionales.** Al ser un registro legacy, Vite asigna literalmente los defaults canónicos para perfil profesional, campo laboral, plan de estudios, requisitos y FAQ; se preservan sin completarlos ni reinterpretarlos.

La offering es presencial, dura 3 años, otorga el título Gestión Educativa, tiene turnos a consultar, validez Sí, imagen `imageBank.students`, badge Nueva carrera, formulario habilitado y orden 2. La sede se resuelve con el fallback institucional `Laprida 660, Monteros`.

No existe WhatsApp propio de la offering. Se reutiliza el fallback institucional `3863 47 6400`, normalizado a `543863476400`, con el mensaje contextual de Gestión Educativa.

## Capturas y responsive

| Archivo | Tema | Viewport | Dimensiones reales | SHA-256 |
| --- | --- | --- | --- | --- |
| `gestion-educativa-next-desktop-claro.png` | Claro | 1440 × 900 | 1440 × 900 | `00FACD38E74D98B7A34318388FB5A8A3CF04A83039D734B3CBAB595F3DABB9C4` |
| `gestion-educativa-next-mobile-claro.png` | Claro | 390 × 843 | 390 × 843 | `4C196439D0581EB2E7CE98624247AA35A189E9728B53573479EC1B2CFA3A7902` |

Las capturas se obtuvieron mediante Chrome headless CLI, sin CDP. La plantilla responsive, el DOM, las clases y el CSS de carreras no recibieron cambios. El mecanismo de tema claro/oscuro sigue siendo compartido y no se introdujo una variante específica de esta carrera.

## Validaciones

- HTTP 200: la ruta canónica de Gestión Educativa y Profesorado.
- HTTP 404: Acompañante Terapéutico, la variante `/capacitaciones/gestion-educativa` y Gestión Educativa bajo instituciones o ciudad no autorizadas.
- El formulario conserva el contrato académico: registra `career: "Gestión Educativa"` en `localStorage.guiaEducativaLeads`; no utiliza semántica `training`.
- `CareerPageClient.js` y `carrera.css` permanecen intactos.
- `npm run lint` y `npm run build` finalizaron correctamente.
