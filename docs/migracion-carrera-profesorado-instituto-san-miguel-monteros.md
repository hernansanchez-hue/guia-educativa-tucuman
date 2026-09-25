# Auditoría — Profesorado | Instituto San Miguel | Monteros

## Identificación canónica

La primera carrera visible de Instituto San Miguel en Vite es **Profesorado**.

- ID legacy: `profesorado-<sufijo-aleatorio>` generado por la normalización de Vite; no es estable.
- Slug canónico propuesto: `profesorado`.
- Orden: 1.
- Imagen: `imageBank.classroom` — `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80`.
- Badge derivado: Inscripciones abiertas.
- Descripción: Formación pedagógica con prácticas y acompañamiento.
- Modalidad: Presencial; duración: 3 años; título: Profesorado; sede: Laprida 660, Monteros; turnos: Consultar; validez: Sí; formulario habilitado.
- WhatsApp: no propio; fallback institucional `3863 47 6400` → `543863476400`.

## Career master

No existe en `careers.js` una carrera conceptualmente idéntica. Existen Profesorado de Educación Primaria y Profesorado de Inglés, ambas con nombre, título y descripción explícitamente distintos. Debe crearse una nueva career master futura:

- `careerId`: `profesorado`.
- `slug`: `profesorado`.
- Perfil: Profesional preparado para aplicar conocimientos y desarrollarse en su área.
- Campo laboral: Ámbitos públicos y privados relacionados con la formación profesional.
- Plan: Primer año, Segundo año, Tercer año.
- Requisitos: DNI, Título secundario, Formulario de inscripción.
- FAQ: las dos entradas genéricas normalizadas por Vite sobre inscripciones y solicitud de información.

## Futura offering y presentación

- Offering ID: `instituto-san-miguel-monteros-profesorado`.
- `institutionId`: `instituto-san-miguel-monteros`.
- `citySlug`: `monteros`.
- `careerId`: `profesorado`.
- Ruta futura: `/monteros/instituto-san-miguel/carreras/profesorado`.
- Mapping: no requerido; ID y slug coinciden.

La carrera encaja en el modelo académico existente: career master + academic offering + `CareerPageClient.js`. Pueden reutilizarse sin cambios `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y lógica WhatsApp. Esta auditoría no implementa la carrera ni avanza a Gestión Educativa.
