# Análisis visual — Universidad Siglo 21 Concepción

## Resultado general

La ficha institucional de Next.js reproduce la estructura y geometría canónicas de Vite en escritorio y móvil, en tema claro y oscuro. Las correcciones realizadas durante la comparación se limitaron al nuevo CSS/componente institucional: variante `.btn.light`, breakpoint del título, regla `.eyebrow` y su estilo inline canónico.

## Mediciones estructurales

Los valores Vite y Next.js coincidieron en la inspección computada final, salvo la posición horizontal instantánea de las tarjetas del marquee.

| Elemento | Escritorio | Móvil 390 px | Resultado |
|---|---:|---:|---|
| Header | 1120 × 62 px; `x=152.4`, `y=12` | 355.2 × 58 px con gutter del navegador | Coincidente |
| Botón de regreso | 216.7 × 45.6 px; `x=85.49`, `y=102` | 216.7 × 45.6 px | Coincidente |
| Portada | 1253.83 × 310 px | 337.7 × 310 px | Coincidente |
| Título institucional | 60 px / 63 px; peso 700 | 36 px / 37.8 px; peso 700 | Coincidente |
| Eslogan | 20 px / 29 px | 20 px / 29 px | Coincidente |
| Panel de galería | 1253.83 × 429.2 px | 337.7 × 359.2 px | Coincidente |
| Galería visible | 1152 × 336 px | 292.1 × 266 px | Coincidente |
| Tarjeta de galería | 224 × 320 px | 176 × 250 px | Coincidente |
| Grid de carreras | 1208.22 × 393.8 px, cuatro columnas | 292.1 px, una columna | Coincidente |
| Primera tarjeta de carrera | 290.05 × 393.8 px | 292.1 × 436.95 px | Coincidente |
| Acciones de carrera | dos columnas | una columna a ≤414 px | Coincidente |
| Footer | 1424.8 × 398 px en escritorio | apilado en móvil | Coincidente |
| Logo `US21` | `display: none`, 0 × 0 | `display: none`, 0 × 0 | Coincidente |

La tipografía computada es `Poppins, Arial, Helvetica, sans-serif` en ambos proyectos. Los pesos, tamaños y alturas de línea de título, eslogan, rótulo y tarjetas coinciden.

## Galería marquee

- Cuatro imágenes originales, repetidas una vez para formar ocho `.creation-card`.
- Orden canónico: portada, estudiantes, aula, graduación; el mismo orden se repite.
- Tarjetas de 224 × 320 px en escritorio y 176 × 250 px en móvil.
- Animación `creationMarquee`, lineal, infinita y con duración computada de 10 s.
- La transformación cambió de `translateX(-6.83 px)` a `translateX(-35.84 px)` en 250 ms durante la prueba, confirmando movimiento real.
- Pausa por `hover` y por `prefers-reduced-motion` conservada.

La posición de las fotos en cada captura depende del instante de renderizado. Por eso el área completa presenta más diferencia de píxeles que la zona estática, sin indicar un cambio de estructura.

## Tarjetas de carreras

Se conservaron cuatro tarjetas y su orden:

1. `Abogacía` — `Inscripciones abiertas`.
2. `Contador Público` — `Nueva carrera`.
3. `Lic. en Administración` — `Próximo ingreso`.
4. `Higiene y Seguridad` — `Inscripciones abiertas`.

Todas muestran `3 años`, `Presencial`, `Concepción`, `Privada` y `Propuesta académica con ficha completa disponible.`. Las cuatro acciones `Ver carrera` y `Consultar` mantienen su interacción visual pero permanecen deliberadamente inactivas: la URL no cambió y no apareció diálogo alguno.

## Métrica de diferencia visual

La zona estática superior se midió desde `y=0` hasta `y=489`, antes del contenido animado principal de la galería.

| Escenario | Diferencia absoluta media total | Píxeles >24 total | Diferencia media zona estática | Píxeles >24 zona estática |
|---|---:|---:|---:|---:|
| Escritorio claro | 20.202 | 23.666 % | 0.000 | 0.000 % |
| Escritorio oscuro | 20.405 | 24.905 % | 0.073 | 0.081 % |
| Móvil claro | 11.841 | 13.709 % | 0.306 | 0.263 % |
| Móvil oscuro | 8.015 | 10.165 % | 0.591 | 0.498 % |

La diferencia casi nula de la zona estática confirma portada, textos, header, regreso, márgenes, colores y tipografía equivalentes. El valor total está dominado por la fase del marquee.

## Diferencias clasificadas

### Estructurales

No se encontraron diferencias estructurales pendientes. La jerarquía visible, las cantidades de elementos, los paneles, las cuatro carreras, el footer y el logo oculto coinciden.

### CSS comprobables

Se detectaron y corrigieron antes del cierre:

- `.btn.light`: faltaba la variante visual del botón de regreso.
- Breakpoint del título: 30 px corresponde a ≤360 px, no a ≤414 px.
- `.eyebrow`: faltaban sus propiedades canónicas.
- Estilo inline del rótulo: `color: #c8f5df; margin: 0`.

No quedan diferencias CSS comprobables pendientes.

### Contenido

No se encontraron diferencias de contenido. Nombre, tipo, ciudad, eslogan, imágenes, badges, duración, modalidad, textos auxiliares y orden coinciden.

### Dinámicas del marquee y fotograma

Las fotos ocupan posiciones horizontales diferentes cuando las capturas se toman en instantes distintos. Esta región se acepta como dinámica porque duración, geometría, orden y movimiento coinciden.

### Rasterizado y captura

- Variaciones subpíxel/JPEG de la captura original del navegador quedan reflejadas en los PNG re-encodificados.
- El backend entregó 899 px de alto para la toma de escritorio calibrada; se duplicó solo la fila inferior para llegar a 900 px, sin escalar ni recortar.
- El botón circular `N` es un overlay exclusivo del servidor de desarrollo de Next.js y no pertenece al DOM de la aplicación.

### Diferencias aceptadas

- Fotograma del marquee.
- Rasterizado/compresión de captura.
- Overlay `N` de desarrollo de Next.js.

## Responsive, temas y estados

- Escritorio y móvil responden con los mismos breakpoints y dimensiones computadas.
- El título permanece en 36 px a 390 px y pasa a 30 px únicamente a ≤360 px.
- La grilla de carreras pasa de cuatro columnas a una; sus acciones pasan a una columna a ≤414 px.
- Tema claro y oscuro alternan correctamente con el control existente.
- En oscuro, paneles y tarjetas usan fondo `#111c2e`; la página/footer usan `#0b1423`.
- Hover/focus y transiciones se conservaron mediante las reglas canónicas copiadas.

## Regresiones y comportamiento

- Home conserva `Concepción`, `Monteros` y `Aguilares`, en ese orden y con un botón por ciudad.
- `/ciudades` conserva las tres ciudades canónicas.
- `/concepcion` conserva slider, filtros, tarjetas, tema y responsive.
- El filtro `Higiene y Seguridad` devuelve únicamente `Universidad Siglo 21`, confirmando compatibilidad con los nuevos objetos resumidos de carreras.
- Santa Bárbara e IES permanecen inactivas; el destacado Instituto del Sur también permanece inactivo.
- La tarjeta Siglo 21 navega a la nueva ruta y el botón de regreso vuelve a `/concepcion`.
- No se registraron errores en la consola del navegador.

## Conclusión

La ficha es funcional y visualmente comparable. No existe una diferencia estructural importante que bloquee el commit; queda lista para revisión visual humana sin habilitar todavía rutas contextuales de carreras ni otras instituciones.
