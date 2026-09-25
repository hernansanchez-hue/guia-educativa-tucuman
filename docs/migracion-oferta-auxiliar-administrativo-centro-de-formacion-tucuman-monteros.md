# Auditoría — Auxiliar Administrativo | Centro de Formación Tucumán | Monteros

## Identificación canónica

La primera tarjeta visible de Centro de Formación Tucumán en la demo Vite es **Auxiliar Administrativo**. La demo la introduce dentro de una institución cuyo tipo es **Capacitación** y cuyo slogan es **Cursos cortos para fortalecer tu perfil laboral.** Aunque la SPA técnica utiliza el arreglo genérico `careers` y el rótulo visual genérico `Carreras`, la semántica canónica institucional no demuestra que sea una carrera académica.

- Nombre: Auxiliar Administrativo.
- ID legacy: `auxiliar-administrativo-<sufijo-aleatorio>`; Vite deriva `slugifyCareer(nombre)` y añade aleatoriedad, por lo que no es estable.
- Slug canónico propuesto: `auxiliar-administrativo`.
- Orden: 1.
- Imagen: `imageBank.classroom` — `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80`.
- Badge derivado por posición: Inscripciones abiertas.
- Descripción: Tareas de oficina, atención y documentación comercial.
- Duración: 3 años; modalidad: Presencial; título: Auxiliar Administrativo; sede: Rivadavia 295, Monteros; turnos: Consultar; validez: Sí.

## Contenido normalizado por Vite

La entrada legacy recibe por `normalizeCareer`: acerca de igual a la descripción, perfil `Profesional preparado para aplicar conocimientos y desarrollarse en su área.`, campo `Ámbitos públicos y privados relacionados con la formación profesional.`, plan de tres años, requisitos DNI/Título secundario/Formulario de inscripción, dos FAQ genéricas, formulario habilitado y WhatsApp heredado `3863 40 2100` (normalización futura `543863402100`). No hay contenidos, certificación ni URL más específicos en la fuente.

## Clasificación y puerta de seguridad

Visualmente Vite reutiliza la ficha genérica (hero, hechos, tabs, FAQ, sidebar, formulario, WhatsApp y footer). Sin embargo, la reutilización visual no impone el modelo de datos. Por tipo institucional, slogan y descripción canónicos, la clasificación recomendada es **oferta de capacitación / curso**, no una career master + offering académica, hasta definir una etapa arquitectónica específica de cursos/capacitaciones.

No debe añadirse a `careers.js`, ni crearse offering contextual o ruta de carrera en la siguiente etapa sin esa definición. La futura ruta canónica queda pendiente del modelo; Vite no ofrece URL SPA persistente, solo `showCareer()` con un ID aleatorio. La plantilla visual podría reutilizarse, pero eso debe resolverse por composición una vez definido el modelo de Cursos/Capacitaciones.
