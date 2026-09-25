# Auditoría — Operador de PC | Centro de Formación Tucumán | Monteros

## Identificación canónica

Operador de PC es la tercera y última tarjeta visible de Centro de Formación Tucumán en Vite.

- Nombre: Operador de PC.
- ID legacy: `operador-de-pc-<sufijo-aleatorio>`; Vite lo deriva del nombre y añade un sufijo no estable.
- Slug canónico: `operador-de-pc`.
- Imagen: `imageBank.design` — `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80`.
- Badge derivado: Próximo ingreso.
- Orden: 3.
- Descripción: Herramientas digitales esenciales para el trabajo.
- Modalidad: Presencial; duración: 3 años; certificación: Operador de PC; sede: Rivadavia 295, Monteros; turnos: Consultar; validez: Sí.

## Futuro dominio de capacitación

No existe una capacitación canónica idéntica en otra institución dentro de Vite. Corresponde un nuevo `trainingProgram`:

- `id` / `slug`: `operador-de-pc`.
- Perfil: Profesional preparado para aplicar conocimientos y desarrollarse en su área.
- Campo: Ámbitos públicos y privados relacionados con la formación profesional.
- Contenidos: Primer año, Segundo año, Tercer año.
- Requisitos: DNI, Título secundario, Formulario de inscripción.
- FAQ: las dos entradas genéricas normalizadas por Vite sobre inscripciones y solicitud de información.

Futura offering:

- `id`: `centro-de-formacion-tucuman-monteros-operador-de-pc`.
- `institutionId`: `centro-de-formacion-tucuman-monteros`.
- `citySlug`: `monteros`.
- `trainingProgramId`: `operador-de-pc`.
- Formulario habilitado; WhatsApp propio inexistente; fallback institucional `3863 40 2100` → `543863402100`.
- Visible, orden 3, con imagen y badge indicados.

Ruta futura: `/monteros/centro-de-formacion-tucuman/capacitaciones/operador-de-pc`. No requiere mapping porque el ID y slug canónicos coinciden. Puede reutilizar íntegramente `TrainingPageClient.js`; no se requieren cambios estructurales.

Esta auditoría no implementa Operador de PC ni modifica rutas, datos o componentes.
