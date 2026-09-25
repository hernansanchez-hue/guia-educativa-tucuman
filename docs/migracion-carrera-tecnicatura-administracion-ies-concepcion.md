# Auditoría — Tecnicatura en Administración · IES Concepción · Concepción

## Identidad canónica

La segunda entrada visible de IES Concepción en `src/main.js` (líneas 130–146) es `Tecnicatura en Administración`, ubicada entre Profesorado de Educación Primaria y Profesorado de Inglés. No es la misma carrera que `Lic. en Administración` de Universidad Siglo 21 y debe tener una carrera maestra independiente.

| Campo | Valor |
| --- | --- |
| ID / slug | `tecnicatura-administracion` |
| Nombre | Tecnicatura en Administración |
| Descripción | Gestión administrativa para organizaciones públicas y privadas. |
| Imagen | `imageBank.students` → `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80` |
| Badge | Nueva carrera (índice 1 de `careerCardBadge()`) |
| Orden | 2 |

## Carrera maestra

La entrada heredada se normaliza mediante `normalizeCareer()` en `src/main.js`: perfil «Profesional preparado para aplicar conocimientos y desarrollarse en su área.»; campo laboral «Ámbitos públicos y privados relacionados con la formación profesional.»; plan Primer, Segundo y Tercer año; requisitos DNI, Título secundario y Formulario de inscripción; y las FAQ canónicas de inscripción e información. No existe una carrera maestra conceptualmente idéntica en `next-app/app/data/careers.js`: `Lic. en Administración` no se reutiliza.

## Offering IES

| Campo | Valor |
| --- | --- |
| Institution ID / city slug | `ies-concepcion` / `concepcion` |
| Offering ID | `ies-concepcion-concepcion-tecnicatura-administracion` |
| Modalidad / duración | Presencial / 3 años |
| Título | Tecnicatura en Administración |
| Sede | España 320, Concepción |
| Turnos / validez | Consultar / Sí |
| Imagen / badge | `imageBank.students` / Nueva carrera |
| Visible / orden | Sí / 2 |
| WhatsApp propio | No; fallback institucional IES `3865 50 3300` |

## Reutilización y alcance

La ficha reutiliza íntegramente la arquitectura contextual validada por Profesorado de Educación Primaria: header, volver, hero, hechos, tabs sticky, descripción, perfil, campo laboral, plan, requisitos, FAQ, sidebar, formulario, WhatsApp, footer y responsive. Permanecen sin cambios `CareerPageClient.js`, `carrera.css`, formulario, `localStorage.guiaEducativaLeads`, tabs, FAQ, sidebar, footer y lógica WhatsApp. Se habilita solo la segunda tarjeta; Profesorado de Educación Primaria sigue navegando y Profesorado de Inglés permanece sin ruta contextual.
