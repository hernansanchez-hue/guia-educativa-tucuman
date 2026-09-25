# Nosotros — migración Vite a Next.js v1

## Fuente canónica

- HTML: `index.html`, sección `#aboutPage`.
- Apertura SPA: `showInfoPage('about')` en `src/main.js`.
- CSS: reglas `.about-*` de `src/styles.css`.

## Implementación

La ruta editorial `next-app/app/nosotros/page.js` reproduce los cinco bloques canónicos: hero, timeline, beneficios, misión y cierre. Conserva los textos, las dos imágenes externas y los SVG inline del Vite. El CSS migrado está aislado en `next-app/app/nosotros/nosotros.css`.

La navegación principal `Nosotros` del header público dirige a `/nosotros`.

## Reveal canónico

`AboutRevealClient.js` reproduce `initAboutReveal()` del Vite:

- consulta `.about-reveal` después del montaje;
- usa `IntersectionObserver` con `threshold: 0.12`;
- agrega la clase `visible` y ejecuta `unobserve`;
- deja visibles los elementos cuando no hay observer o se solicita movimiento reducido.

Se corrigió una inicialización prematura: el script inline anterior se ejecutaba antes de que existieran los cinco nodos `.about-reveal`, por lo que el hero quedaba inicialmente con `opacity: 0`. El cliente aislado registra el observer con los nodos ya renderizados, sin eliminar la animación.

## Validación

- Microsoft Edge normal: desktop y móvil 390 × 843 validados manualmente.
- Hero visible al cargar; timeline, beneficios, misión y cierre correctos.
- Sin overflow horizontal ni elementos cortados o superpuestos.
- Modo claro y oscuro correctos.
- HTTP `/nosotros`: 200; regresiones públicas correctas.
- `npm run lint`: correcto con dos advertencias conocidas por los `<img>` canónicos.
- `npm run build`: correcto, 51 páginas.
- `/nosotros` no consulta Supabase.
- Vite permanece intacta y Supabase remoto no fue modificado.

Build Supabase no repetido en esta sesión por ausencia de variables de entorno; `/nosotros` es editorial, no consulta Supabase y el catálogo Supabase ya fue validado en etapas anteriores.
