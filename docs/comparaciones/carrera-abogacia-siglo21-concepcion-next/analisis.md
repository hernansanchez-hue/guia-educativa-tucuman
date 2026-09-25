# Análisis visual — Abogacía contextual

## Resultado general

La ficha contextual de Next.js reproduce la estructura canónica de Vite. En escritorio, las posiciones y dimensiones del hero, tabs, secciones y sidebar coinciden. En móvil, la comparación detectó y corrigió dos reglas faltantes: el breakpoint final de 414 px y la alineación inicial de tabs. Después de corregirlas, la geometría visible coincide.

## Mediciones

| Elemento | Escritorio Vite / Next | Móvil Vite / Next | Estado |
|---|---:|---:|---|
| Viewport CSS | 1440×900 / 1440×900 | 390×843 / 390×843 | Igual |
| Hero, inicio | mismo punto | 155 px / 155 px | Igual |
| Hero, altura móvil | — | 614.91 px / 614.91 px | Igual |
| Tabs, inicio móvil | — | 787.91 px / 787.91 px | Igual |
| Tabs, altura móvil | — | 150 px / 150 px | Igual |
| Sobre la carrera | mismo punto | 955.91 px / 955.91 px | Igual |
| Campo laboral | mismo punto | 1338.47 px / 1338.47 px | Igual |
| Plan de estudios | mismo punto | 1633.64 px / 1633.64 px | Igual |
| Requisitos | mismo punto | 2045.38 px / 2045.38 px | Igual |
| FAQ | mismo punto | 2208.55 px / 2208.55 px | Igual |
| Sidebar | mismo punto | 2485.11 px / 2485.11 px | Igual |

## Comparación por elemento

- **Header y navegación:** se reutiliza el header público ya validado. Logo, navegación, control de tema y menú móvil conservan estructura, clases y responsive.
- **Hero e imagen:** mismas columnas en escritorio, mismo orden DOM, imagen a la izquierda mediante `order:-1`, `object-fit:cover`, seis hechos y descripción inferior. En 390 px la imagen usa el mínimo canónico de 220 px.
- **Título e institución:** `Abogacía`, `Universidad Siglo 21 · Concepción` y el título otorgado `Abogacía` permanecen literales.
- **Badge:** la ficha contextual de Vite no muestra un badge dentro del hero. El badge `Inscripciones abiertas` permanece en la tarjeta institucional y en la oferta local, sin agregar un elemento inexistente.
- **Datos destacados:** Duración, Sede, Título, Validez, Turnos y Modalidad conservan orden, icono de tilde, tamaños y grilla 3×2 en escritorio / 2×3 en móvil.
- **Tabs y sticky:** cinco botones; sticky a 82 px en escritorio y 72 px en móvil. La prueba de Plan de estudios dejó el tab en `rectTop=82` durante scroll. El comportamiento móvil efectivo de la demo es wrap en varias filas (`flex-wrap:wrap`, 150 px de alto), por lo que `scrollWidth=clientWidth=349`; Next conserva ese resultado aunque el contenedor declare overflow horizontal.
- **Secciones académicas:** Sobre la carrera, Perfil del egresado, Campo laboral, Plan de estudios, Requisitos y FAQ conservan textos, orden, cards, padding y columnas.
- **Plan:** tres columnas en escritorio y una en móvil. A 414 px los ítems vuelven a `min-height:0`, como Vite.
- **FAQ:** dos ítems estáticos; no se introdujeron acordeones.
- **Sidebar y formulario:** sticky en escritorio y estático bajo 900 px. Campos, placeholders, opciones, validación nativa, mensaje y reset coinciden.
- **WhatsApp:** enlace a `https://wa.me/543865412020` con el texto contextual canónico. Usa el número institucional por ausencia de `offering.whatsapp`.
- **Footer:** se reutiliza el componente público ya validado. Su altura móvil es 826.59 px frente a 902.09 px en Vite; es una diferencia preexistente del componente compartido y no cambia la ficha ni la primera pantalla capturada.
- **Tipografía:** Poppins, pesos, tamaños y line-height provienen de la capa visual ya migrada y de reglas copiadas de la demo.
- **Responsive y overflow:** `innerWidth=390`, `clientWidth=390`, `scrollWidth=390`; no hay scroll horizontal de página.

## Diferencias clasificadas

### Estructurales

Ninguna dentro de la ficha de carrera después de las correcciones.

### CSS

Corregidas: reglas `@media (max-width:414px)` para padding/título/imagen/plan y `justify-content:flex-start; gap:5px` para las tabs móviles.

### Contenido

Ninguna. La sede y WhatsApp se resuelven mediante fallback institucional sin duplicarlos en la oferta.

### Dinámicas

No hay video ni marquee en esta página. La carga de la imagen externa puede variar temporalmente; las capturas esperaron su finalización.

### Rasterizado

Las diferencias residuales son mínimas: 0.0201 % de píxeles en escritorio claro, 0.0197 % en escritorio oscuro y 0.0630 % en móvil oscuro. En móvil claro el degradado modifica valores mínimos en 11.7419 % de píxeles, pero el delta RGB medio es solo 0.1119/255 y no representa desplazamiento geométrico.

### Diferencias aceptadas

La altura del footer compartido ya validado es distinta en móvil. No se modificó para evitar regresiones sobre Home, ciudades e instituciones aprobadas.

## Datos y funcionalidad

- Carrera maestra: `careers.js`, ID/slug `abogacia`.
- Oferta: `offerings.js`, ID `universidad-siglo-21-concepcion-abogacia`; relaciona ciudad, institución y carrera.
- Institución: `institutions.js`, sin duplicar identidad, dirección ni WhatsApp.
- Duplicación temporal: el resumen de Abogacía permanece en `institutions.js` porque alimenta la tarjeta institucional.
- Formulario: agrega un objeto simulado a `localStorage.guiaEducativaLeads`; la prueba confirmó institución y carrera y se limpió al terminar.
- Navegación: únicamente Abogacía abre la ruta contextual; las otras tres carreras mantienen la URL institucional.
- Consola: sin excepciones ni entradas de nivel error durante capturas e interacciones.

## Recomendación

La ficha contextual de Abogacía puede aprobarse visual y técnicamente, manteniendo registrada la diferencia heredada del footer para una futura revisión transversal autorizada.
