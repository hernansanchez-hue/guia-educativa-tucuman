# Auditoría — Diagnóstico por Imágenes · Instituto Santa Bárbara · Concepción

## Identidad canónica

La tercera y última entrada de Santa Bárbara en `src/main.js` líneas 51–54 es `Diagnóstico por Imágenes`; no se sustituye por otro nombre.

| Campo | Valor |
| --- | --- |
| ID / slug | `diagnostico-por-imagenes` |
| Imagen | `imageBank.students` → `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80` |
| Badge | Próximo ingreso (índice 2 según `careerCardBadge()` líneas 677–680) |
| Orden | 3 |
| Descripción | Formación en tecnología aplicada a estudios médicos. |

## Carrera maestra y offering heredados

Por ser una entrada heredada, `normalizeCareer()` (`src/main.js` líneas 179–208) define literalmente: perfil «Profesional preparado para aplicar conocimientos y desarrollarse en su área.»; campo laboral «Ámbitos públicos y privados relacionados con la formación profesional.»; plan Primer, Segundo y Tercer año; requisitos DNI, Título secundario y Formulario de inscripción; y las dos FAQ canónicas de inscripción e información.

| Campo de offering | Valor |
| --- | --- |
| ID | `instituto-santa-barbara-concepcion-diagnostico-por-imagenes` |
| Ciudad / institución | `concepcion` / `instituto-santa-barbara` |
| Modalidad / duración | Presencial / 3 años |
| Título | Diagnóstico por Imágenes |
| Sede | Belgrano 810, Aguilares |
| Turnos / validez | Consultar / Sí |
| Visible / orden | Sí / 3 |
| WhatsApp propio | No; fallback institucional `3865 55 1188` |

## Plantilla

Reutiliza por completo la ficha contextual de Instrumentación y Laboratorio: formulario, tabs, FAQ, sidebar, footer, `localStorage.guiaEducativaLeads` y WhatsApp. No requiere cambios en `CareerPageClient.js` ni `carrera.css`; la ruta y la tarjeta usan el ID/slug ya canónico.

La puerta de seguridad queda aprobada para la capa de datos, parámetro estático acotado y tercera tarjeta.
