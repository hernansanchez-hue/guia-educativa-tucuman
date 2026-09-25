# Validación — /monteros

Ruta dinámica temporal: `/monteros`. La fuente de verdad es la demo Vite; no había baseline histórica utilizable de Monteros, por lo que se generó evidencia Next.js con Chrome headless CLI en escritorio 1440 × 900 y móvil 390 × 843.

Se conservan header, slider, autoplay, flechas, swipe, buscador, filtros, cards, footer, temas y responsive del mismo cliente de Concepción. Las instituciones visibles y su orden canónico son Universidad Siglo 21, Instituto del Sur, Centro de Formación Tucumán e Instituto San Miguel. Las fichas institucionales de Monteros permanecen sin migrar y devuelven 404.

`npm run lint` y `npm run build` finalizaron correctamente; `/monteros` responde 200 y `/aguilares` permanece 404. La enumeración manual de la ruta es temporal hasta que Supabase publique ciudades e instituciones dinámicamente.
