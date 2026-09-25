# Auditoría — Profesorado de Educación Primaria · IES Concepción · Concepción

## Identidad canónica

La primera entrada visible de IES Concepción en `src/main.js` líneas 130–146 es `Profesorado de Educación Primaria`; es la primera tarjeta, antes de Tecnicatura en Administración y Profesorado de Inglés.

| Campo | Valor |
| --- | --- |
| ID / slug | `profesorado-educacion-primaria` |
| Imagen | `imageBank.classroom` → `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80` |
| Badge | Inscripciones abiertas (índice 0 de `careerCardBadge()`) |
| Orden | 1 |
| Descripción | Formación docente para nivel primario. |

## Carrera maestra

La entrada heredada se normaliza mediante `normalizeCareer()` (`src/main.js` líneas 179–208): perfil «Profesional preparado para aplicar conocimientos y desarrollarse en su área.»; campo laboral «Ámbitos públicos y privados relacionados con la formación profesional.»; plan Primer, Segundo y Tercer año; requisitos DNI, Título secundario y Formulario de inscripción; FAQ canónicas de inscripción e información. No existe una carrera maestra conceptualmente idéntica en `next-app/app/data/careers.js`; se agregará como entidad independiente.

## Offering IES

| Campo | Valor |
| --- | --- |
| Institution ID | `ies-concepcion` |
| City slug | `concepcion` |
| Offering ID | `ies-concepcion-concepcion-profesorado-educacion-primaria` |
| Modalidad / duración | Presencial / 3 años |
| Título | Profesorado de Educación Primaria |
| Sede | España 320, Concepción |
| Turnos / validez | Consultar / Sí |
| Imagen / badge | `imageBank.classroom` / Inscripciones abiertas |
| Visible / orden | Sí / 1 |
| WhatsApp propio | No; fallback de IES `3865 50 3300` |

## Reutilización

La ficha usa la misma arquitectura contextual validada: header, volver, hero, seis hechos, tabs sticky, descripción, perfil, campo laboral, plan, requisitos, FAQ, sidebar, formulario, WhatsApp, footer y responsive. Se mantienen intactos `CareerPageClient.js`, `carrera.css`, formulario, `localStorage.guiaEducativaLeads`, tabs, FAQ, sidebar, footer y lógica WhatsApp. La puerta de seguridad queda aprobada; solo se habilita la primera tarjeta, mientras las otras dos de IES permanecen sin ruta contextual.
