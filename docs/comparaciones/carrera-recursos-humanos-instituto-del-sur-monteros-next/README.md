# Recursos Humanos — Instituto del Sur, Monteros

## Alcance de la migración

- Career master nuevo: `recursos-humanos`.
- Offering: `instituto-del-sur-monteros-recursos-humanos`.
- Institución: `instituto-del-sur-monteros`.
- Ciudad: `monteros`.
- Ruta contextual: `/monteros/instituto-del-sur/carreras/recursos-humanos`.
- La ficha reutiliza la plantilla compartida, incluidos formulario, pestañas, FAQ, sidebar, footer y acción de WhatsApp. El formulario mantiene `localStorage.guiaEducativaLeads`.
- El offering no declara WhatsApp propio; usa el fallback institucional `3865 44 8712` (normalizado por la lógica compartida como `543865448712`).

## Capturas técnicas

| Archivo | Viewport CSS | Tema | Validación |
| --- | --- | --- | --- |
| `recursos-humanos-instituto-del-sur-next-desktop-claro.png` | 1440 × 900 | Claro | PNG legible, 1440 × 900, 366561 bytes |
| `recursos-humanos-instituto-del-sur-next-mobile-claro.png` | 390 × 843 | Claro | PNG legible, 390 × 843, 218185 bytes |

Las capturas se generaron con Chrome headless CLI, sin CDP y sin modificar la demo Vite. La plantilla conserva el mecanismo de tema claro/oscuro ya compartido; estas dos capturas técnicas corresponden al estado claro solicitado.

## Validación

- `npm run lint`: correcto.
- `npm run build`: correcto. Persiste únicamente la advertencia conocida de Next.js por los dos lockfiles legítimos de la raíz Vite y de `next-app`.
- HTTP 200: la ruta nueva, Marketing, las rutas generales, las tres instituciones y diez carreras contextuales de Concepción, y Siglo 21 Monteros con sus cuatro carreras.
- HTTP 404: Administración de Empresas de Instituto del Sur, Recursos Humanos bajo Siglo 21 o Concepción, instituciones aún no migradas, rutas inexistentes y Aguilares.
- La ficha muestra Recursos Humanos, Instituto del Sur, la descripción auditada, el badge `Nueva carrera` y duración `3 años`, sin contexto de Universidad Siglo 21.

## Integridad

`CareerPageClient.js` y `carrera.css` no se modificaron. No se alteraron Vite, los baselines, dependencias, `package.json` ni lockfiles. Marketing sigue navegable y Administración de Empresas sigue visible pero sin ruta contextual.
