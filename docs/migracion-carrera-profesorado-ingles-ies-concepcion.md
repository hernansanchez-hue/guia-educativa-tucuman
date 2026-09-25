# Auditoría — Profesorado de Inglés · IES Concepción · Concepción

## Identidad canónica

La tercera y última carrera visible de IES Concepción en `src/main.js` es `Profesorado de Inglés`; ocupa la tercera tarjeta, después de Profesorado de Educación Primaria y Tecnicatura en Administración.

| Campo | Valor |
| --- | --- |
| ID / slug | `profesorado-ingles` |
| Nombre | Profesorado de Inglés |
| Descripción | Formación pedagógica y práctica del idioma. |
| Imagen | `imageBank.fair` → `https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80` |
| Badge | Próximo ingreso |
| Orden | 3 |

## Carrera maestra y offering

`normalizeCareer()` en la demo aporta literalmente perfil «Profesional preparado para aplicar conocimientos y desarrollarse en su área.», campo laboral «Ámbitos públicos y privados relacionados con la formación profesional.», plan Primer, Segundo y Tercer año, requisitos DNI, Título secundario y Formulario de inscripción, y las dos FAQ canónicas. No existe una carrera maestra idéntica en Next.js.

La offering canónica es Concepción + `ies-concepcion` + `profesorado-ingles`: modalidad Presencial, duración 3 años, título Profesorado de Inglés, sede España 320, Concepción, turnos Consultar, validez Sí, visible, orden 3, imagen `imageBank.fair` y badge Próximo ingreso. No posee WhatsApp propio; usa el fallback institucional `3865 50 3300`.

## Reutilización

Reutiliza íntegramente la ficha contextual validada por las dos carreras anteriores: formulario, `localStorage.guiaEducativaLeads`, tabs, FAQ, sidebar, footer y lógica WhatsApp. `CareerPageClient.js` y `carrera.css` permanecen sin cambios; no se requiere componente ni estructura nuevos.
