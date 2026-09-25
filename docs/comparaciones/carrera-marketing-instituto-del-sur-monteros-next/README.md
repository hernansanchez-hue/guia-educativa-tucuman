# Marketing — Instituto del Sur, Monteros

## Arquitectura validada

| Nivel | Identidad |
| --- | --- |
| Carrera maestra nueva | `marketing` |
| Institución interna | `instituto-del-sur-monteros` |
| Ciudad | `monteros` |
| Offering | `instituto-del-sur-monteros-marketing` |
| Ruta pública | `/monteros/instituto-del-sur/carreras/marketing` |

La carrera maestra contiene exclusivamente información general de Marketing. La
offering contiene la disponibilidad de Instituto del Sur Monteros y la institución
conserva sus datos de sede. No se mezclaron estos niveles.

## Datos validados

| Campo | Valor |
| --- | --- |
| Descripción | Planificación comercial, comunicación y campañas digitales. |
| Modalidad | Presencial |
| Duración | 3 años |
| Título | Marketing |
| Turnos | Consultar |
| Validez nacional | Sí |
| Imagen | `imageBank.design` |
| Badge | Inscripciones abiertas |
| Orden | 1 |
| Formulario | Simulado y habilitado; reutiliza `localStorage.guiaEducativaLeads` |
| WhatsApp | Sin número propio; fallback institucional `3865 44 8712` |

`CareerPageClient.js` y `carrera.css` permanecen intactos. El formulario, tabs,
FAQ, sidebar, footer y WhatsApp reutilizan la plantilla contextual compartida; la
normalización esperada del fallback es `543865448712` con mensaje contextual de
Marketing.

## Capturas técnicas Next.js

Generadas con Chrome headless CLI local, perfil temporal independiente y escala 1.

| Archivo | Viewport | Dimensiones PNG | Tema | Peso | Estado |
| --- | --- | --- | --- | ---: | --- |
| `marketing-instituto-del-sur-next-desktop-claro.png` | 1440 × 900 | 1440 × 900 | Claro | 343.057 bytes | PNG válido |
| `marketing-instituto-del-sur-next-mobile-claro.png` | 390 × 843 | 390 × 843 | Claro | 163.876 bytes | PNG válido |

Claro/oscuro continúan usando el mecanismo global `guiaEducativaTheme`; no se
agregaron estilos o controles particulares.

## HTTP y regresión

HTTP 200: Home, Ciudades, Concepción con tres instituciones y diez carreras,
Monteros, Siglo 21 Monteros con sus cuatro carreras, Instituto del Sur y Marketing.

HTTP 404: Marketing bajo Concepción o Siglo 21, Recursos Humanos, Administración de
Empresas, carrera inexistente, Centro de Formación Tucumán, Instituto San Miguel y
Aguilares. Marketing es la única tarjeta de Instituto del Sur conectada en esta
etapa; las otras dos siguen visibles y sin ruta contextual.

- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm start`: correcto en el puerto temporal 3152; detenido tras validar.
- Vite, baseline, paquetes, lockfiles, dependencias, otras careers y offerings,
  `CareerPageClient.js` y `carrera.css`: sin cambios.
- Advertencia no bloqueante conocida: Next.js detecta los lockfiles legítimos de
  Vite y Next.js e infiere `C:\Codex\GET` como workspace root.
