# Auditoría — /monteros

La demo Vite establece Monteros como segunda ciudad canónica, después de Concepción; su slug es `monteros` y el orden canónico de ciudades es Concepción, Monteros, Aguilares.

`/monteros` reutiliza la misma estructura que `/concepcion`: header, slider con autoplay, controles y swipe, buscador y filtros, título de ciudad, cards, footer, temas claro/oscuro y responsive. No requiere componente, CSS ni ruta React exclusivos; se resuelve mediante `app/[ciudad]/page.js` y `CityPageClient.js`.

Instituciones visibles en orden Vite: Universidad Siglo 21 (Privada), Instituto del Sur (Terciario), Centro de Formación Tucumán (Capacitación), Instituto San Miguel (Instituto). Sus carreras resumidas, imágenes, tipo, textos, media y orden se conservan desde los datos canónicos. El slider Vite deriva Universidad Siglo 21, Instituto Santa Bárbara e Instituto del Sur; se conserva esa selección visual incluso cuando Santa Bárbara no es tarjeta local.

La ruta institucional de Monteros permanece sin registrar en `institutionPages`, por lo que sus cards se muestran pero sus fichas continúan 404. La enumeración de `monteros` en `generateStaticParams()` es temporal mientras los datos son locales; Supabase deberá publicar ciudades e instituciones sin editar rutas o componentes.
