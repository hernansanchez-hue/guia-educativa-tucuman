# Rediseño del hero de ciudades — GET público V1

## Objetivo y alcance

Esta etapa rediseña exclusivamente el bloque superior compartido de las rutas de ciudad (`/[ciudad]`): header, hero fotográfico, carrusel de carreras destacadas y buscador/filtros inmediato. Las referencias visuales aprobadas de escritorio y móvil guiaron la composición, las jerarquías, la paleta y la respuesta responsive.

No se rediseñaron los bloques posteriores al buscador: título **Instituciones de ...**, tarjetas institucionales, listados, secciones inferiores ni footer.

## Sistema visual

- Tipografía: se mantiene la tipografía existente del sitio.
- Base nocturna: `#081327` y `#0D1B3D` mediante overlays sobre las imágenes reales del catálogo.
- Acento: `#C9971A`.
- Superficies claras: blanco, `#F5F7FB`, `#EEF2F8` y bordes `#D9E1EF`.
- Header: cápsula con transparencia aproximada `rgba(8, 19, 39, 0.34)`, blur y borde blanco sutil.
- El hero usa directamente `public/assets/get-logo-hero-blanco-dorado.png`, el asset oficial compacto blanco/dorado con transparencia, sin filtros ni recreaciones.

## Componentes

Reutilizados:

- `app/[ciudad]/CityPageClient.js`: filtros, búsqueda, navegación institucional, footer y estructura inferior.
- `app/components/PublicHeader.js`: navegación, tema, Cursos Docentes y menú móvil existentes.
- El catálogo de ciudad existente, tanto local como Supabase.

Creado:

- `app/[ciudad]/CityFeaturedCareers.js`: componente visual del hero/carrusel. Consume las carreras ya disponibles dentro de cada ciudad y no duplica readers, queries ni datos.

## Hero y slider

El carrusel forma temporalmente una colección de hasta cinco carreras reales a partir de las instituciones del catálogo de la ciudad actual. Cada entrada conserva imagen, nombre, descripción, institución y ruta contextual existente. Para capacitaciones se respeta el segmento contextual correspondiente; para carreras se conserva la ruta `/<ciudad>/<institucion>/carreras/<carrera>`.

- Avance automático: 3 segundos.
- Controles anterior/siguiente, barra de progreso, contador `01 / 05` y gesto de swipe.
- El hero se actualiza junto a la tarjeta activa: imagen, título, descripción y CTA.
- `prefers-reduced-motion` desactiva el avance automático y las transiciones del bloque.

La futura regla comercial de una carrera destacada por institución paga **no fue implementada**: no se añadieron campos, tablas, planes, schema, persistencia ni lógica de pago/gratuidad.

## Buscador y funcionalidad preservada

El formulario existente conserva su estado y handlers: búsqueda por institución/carrera, modalidad, nivel, aplicación de filtros y scroll hacia los resultados. Sólo cambió la presentación a una cápsula flotante. También se preservan los accesos Inicio, Eventos como elemento visual sin ruta nueva, Nosotros, tema, Cursos Docentes y navegación móvil.

No se eliminaron funciones. La composición anterior de institución destacada se reemplazó visualmente por el componente de carreras, sin afectar los datos ni la navegación institucional.

## Responsive y temas

En escritorio el contenido editorial se muestra a la izquierda y una ventana de tres tarjetas verticales aparece a la derecha. La colección sigue conteniendo hasta cinco carreras y el contador conserva el total real. En móvil (390 × 843) el hero se reordena, el rail de tarjetas es táctil/horizontal y el buscador conserva los cuatro controles apilados y compactados. Se verificó ausencia de overflow horizontal para Concepción, Monteros y Aguilares.

El sistema claro/oscuro existente continúa siendo el único sistema de tema. El hero mantiene su overlay azul y el buscador se adapta a la superficie oscura sin introducir un segundo mecanismo.

## Validaciones

- Edge, Concepción: validación visual desktop 1440 × 900 y móvil 390 × 843; header, hero, jerarquía, rail, controles, buscador, contenido inferior y ausencia de overflow.
- Edge, Monteros y Aguilares: ventana de tres tarjetas, total real preservado y ausencia de overflow.
- Slider: avance automático y control siguiente verificados.
- HTTP local: 200 para las tres ciudades, institución, carrera, capacitación, Cursos Docentes, Nosotros y Contacto.
- Suite local: 99/99 tests correctos.
- `npm run lint`: correcto, con los cinco warnings `img` preexistentes en Cursos Docentes y Nosotros.
- `npm run build`: correcto; 56 páginas generadas.
- Build Supabase: no repetido en esta sesión porque `SUPABASE_URL` y `SUPABASE_PUBLISHABLE_KEY` no estaban disponibles; no se modificó Supabase.
- `git diff --check`: correcto.

## Límites de la etapa

No se modificaron Vite, Supabase remoto, readers, modelo de datos, SEO, sitemap, ISR, rutas, 404, paquetes ni lockfiles. El resto de GET queda fuera de este rediseño.

## Ajuste visual V1.1

El ajuste V1.1 mantiene el hero, sus datos y su lógica, y corrige exclusivamente diferencias visuales detectadas frente a las referencias aprobadas.

- Header: se incorporó `public/assets/get-logo-hero-blanco-dorado.png`, el PNG oficial blanco/dorado con canal alfa. Se renderiza directamente, sin filtros CSS, inversión, caja o fondo blanco; el asset anterior continúa intacto para sus usos existentes.
- Tipografía: no se modificó la familia global. El título del hero pasó de peso 800 a 700; títulos de cards a 600; descripciones a 400; navegación y botones a 600 o menor según jerarquía.
- Ancho: el área interior del hero y el header ahora usan `min(1800px, calc(100% - clamp(32px, 4vw, 64px)))`, reduciendo el encierro central en resoluciones desktop sin llevar la composición a borde absoluto.
- Controles: en desktop las flechas, progreso y contador se alinean con la zona del carrusel, no con el bloque editorial izquierdo. La barra se limita al espacio restante del carrusel. En móvil vuelve a la fila compacta bajo las cards horizontales.
- Buscador: estructura, filtros de Modalidad y Nivel, búsqueda y botón se preservan sin cambios funcionales.
- Responsive: validación visual en Edge para escritorio y breakpoint móvil; no se detectó overflow horizontal en Concepción, Monteros ni Aguilares.
- La lógica de autoplay de tres segundos, anterior/siguiente, contador, CTA contextual, tema, menú y Cursos Docentes permanecen intactos.

## Cierre visual final

- La ventana de escritorio muestra tres cards simultáneas; no se eliminan carreras ni se limita la colección del catálogo.
- El contador y la barra de progreso continúan recorriendo el total real, por ejemplo `01 / 05` a `05 / 05`.
- El bloque editorial principal vuelve a renderizar la descripción real de la carrera activa con peso 400.
- Las cards laterales conservan únicamente el nombre de la carrera.
- Autoplay de tres segundos, navegación anterior/siguiente, CTA contextual, imagen, buscador, filtros y estructura inferior permanecen sin cambios funcionales.
