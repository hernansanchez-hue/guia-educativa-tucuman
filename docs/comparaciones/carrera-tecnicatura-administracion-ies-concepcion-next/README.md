# Validación — Tecnicatura en Administración · IES Concepción

## Contexto validado

| Campo | Valor |
| --- | --- |
| Ruta canónica | `/concepcion/ies-concepcion/carreras/tecnicatura-administracion` |
| Carrera maestra | `tecnicatura-administracion` |
| Offering | `ies-concepcion-concepcion-tecnicatura-administracion` |
| Institución | IES Concepción |
| Imagen / badge | `imageBank.students` / Nueva carrera |
| Modalidad / duración / título | Presencial / 3 años / Tecnicatura en Administración |
| WhatsApp | Sin número propio; fallback institucional `3865 50 3300` |

## Capturas Next.js

Las capturas se generaron con Chrome headless CLI local, sin CDP, contra `npm start` en producción.

| Archivo | Viewport solicitado | Dimensiones PNG verificadas | Peso |
| --- | --- | --- | --- |
| `tecnicatura-administracion-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | 394589 bytes |
| `tecnicatura-administracion-next-mobile-claro.png` | 390 × 843 | 390 × 843 | 314033 bytes |

La geometría se conserva mediante el DOM, clases y CSS compartidos que ya estaban validados para Profesorado de Educación Primaria. El título más largo no motivó ninguna corrección automática. La vista móvil conserva el responsive de la ficha reutilizada y no se incorporaron estilos nuevos.

## Funcionalidad y regresión

La ficha muestra el contexto IES Concepción, Tecnicatura en Administración, su descripción, imagen, badge, modalidad, duración y título auditados. La matriz HTTP confirmó 200 para la ruta y para las rutas previamente migradas, y 404 para Profesorado de Inglés, slugs alternativos y combinaciones institucionales inválidas.

El formulario reutiliza sin cambios campos, labels, opciones, validación, reset y `localStorage.guiaEducativaLeads` ya validados en `CareerPageClient.js`. La lógica de WhatsApp también se reutiliza sin cambios. `CareerPageClient.js` y `carrera.css` permanecen intactos.

Profesorado de Educación Primaria continúa navegable; Profesorado de Inglés sigue visible pero sin navegación contextual. Las tarjetas de IES mantienen orden, imagen, badge, DOM, clases, tamaños, hover y responsive.

## Validaciones técnicas

- `npm run lint`: correcto.
- `npm run build`: correcto; 18 páginas estáticas generadas.
- `npm start`: correcto en el puerto temporal 3134; detenido tras la validación.
- Advertencia conocida sin cambios: Next.js detecta los lockfiles de Vite y `next-app` al inferir el workspace root.
