# Auditoría — Secretariado | Centro de Formación Tucumán | Monteros

## Identidad y clasificación

- Nombre visible y completo: **Secretariado**.
- Naturaleza: capacitación institucional; no carrera académica ni Curso Docente provincial.
- ID legacy Vite: `secretariado-<sufijo-aleatorio>` generado por la normalización, por lo que no es estable.
- Slug canónico: `secretariado`.
- Orden: 2.
- Imagen: `imageBank.students` — `https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80`.
- Badge derivado: `Nueva carrera` (texto visual canónico del ciclo de badges, aunque el dominio correcto sea capacitación).

La búsqueda completa en Vite no encontró otra oferta denominada Secretariado en otra institución. Debe crearse un `trainingProgram` nuevo con ID `secretariado`; podrá reutilizarse en el futuro solo si otra sede demuestra contenido canónico exactamente equivalente.

## Futuro training program

- `id` / `slug`: `secretariado`.
- Nombre: Secretariado.
- Descripción: `Organización, comunicación y soporte administrativo.`
- Perfil: `Profesional preparado para aplicar conocimientos y desarrollarse en su área.`
- Campo/salida: `Ámbitos públicos y privados relacionados con la formación profesional.`
- Contenidos: `Primer año`, `Segundo año`, `Tercer año`.
- Requisitos: `DNI`, `Título secundario`, `Formulario de inscripción`.
- FAQ: las dos preguntas/respuestas genéricas normalizadas por Vite sobre inscripciones y solicitud de información.

## Futura training offering

- ID: `centro-de-formacion-tucuman-monteros-secretariado`.
- `institutionId`: `centro-de-formacion-tucuman-monteros`.
- `citySlug`: `monteros`.
- `trainingProgramId`: `secretariado`.
- Modalidad: Presencial.
- Duración: 3 años.
- Certificación: Secretariado.
- Sede: Rivadavia 295, Monteros.
- Turnos: Consultar.
- Validez: Sí.
- Imagen y badge: los indicados arriba.
- Visible: sí; orden: 2; formulario: habilitado.
- WhatsApp propio: no existe; fallback institucional `3863 40 2100`, normalizado `543863402100`.

## Ruta y presentación futuras

- Ruta: `/monteros/centro-de-formacion-tucuman/capacitaciones/secretariado`.
- Mapping: no requerido; ID y slug coinciden.
- Puede reutilizar íntegramente `TrainingPageClient.js` y las clases visuales ya empleadas por Auxiliar Administrativo, manteniendo `trainingPrograms.js` y `trainingOfferings.js` separados de carreras y Cursos Docentes.

Esta auditoría es exclusivamente documental. Secretariado no fue implementado y Operador de PC queda fuera de alcance.
