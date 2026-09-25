# Análisis visual — Contador Público contextual

## Pares y medición de píxeles

| Escenario | Píxeles diferentes | Porcentaje | Delta RGB medio (0–255) | Evaluación |
|---|---:|---:|---:|---|
| Escritorio claro | 260 / 1.296.000 | 0,0201 % | 0,0136 | Rasterizado menor |
| Escritorio oscuro | 255 / 1.296.000 | 0,0197 % | 0,0064 | Rasterizado menor |
| Móvil claro | 33.770 / 328.770 | 10,2716 % | 0,1039 | Gradiente/subpíxel, sin cambio geométrico |
| Móvil oscuro | 207 / 328.770 | 0,0630 % | 0,0229 | Rasterizado menor |

Los cuatro pares tienen dimensiones idénticas. Las imágenes de diferencia confirman que no hay desplazamientos estructurales: el porcentaje móvil claro procede de variaciones muy leves de rasterizado/gradiente, con delta RGB medio inferior a 0,11 por canal. No hay video ni otra región dinámica en la captura de la ficha que explique una diferencia estructural.

## Revisión por bloque

| Elemento | Resultado Vite ↔ Next.js |
|---|---|
| Hero, imagen y título | Iguales: imagen `students`, nombre `Contador Público`, institución y ciudad contextuales. |
| Badge | `Nueva carrera` se conserva en la segunda tarjeta institucional; la ficha contextual no muestra badge en ninguno de los dos proyectos. |
| Seis hechos | Iguales: Duración 3 años, Sede San Martín 124, Concepción, Título Contador Público, Validez Sí, Turnos Consultar y Modalidad Presencial. |
| Tabs y sticky | Cinco tabs, mismo orden; sticky 82px en escritorio y 72px en móvil. En móvil envuelven con altura de 150px, igual que Vite. |
| Descripción, perfil y campo laboral | Literales de la normalización Vite, sin contenido inventado. |
| Plan, requisitos y FAQ | Tres años, tres requisitos y dos FAQ, con la misma jerarquía y textos. |
| Sidebar, formulario y WhatsApp | Misma estructura. El formulario simulado almacena institución y carrera Contador Público en `guiaEducativaLeads`, luego resetea. WhatsApp aplica el fallback `543865412020` y mensaje contextual. |
| Footer | Conserva el componente compartido ya validado. La diferencia preexistente de altura total en móvil no se corrige ni se atribuye a esta carrera. |
| Responsive | Viewport móvil CSS real 390×843, header/regreso/imagen/hechos/tabs/sidebar/footer presentes y sin overflow horizontal. |
| Claro / oscuro | Ambos temas usan el mecanismo existente `localStorage.guiaEducativaTheme` y la clase `body.dark-theme`. |

## Clasificación de diferencias

- **Estructurales:** ninguna.
- **CSS comprobables:** ninguna. `CareerPageClient.js` y `carrera.css` quedaron intactos.
- **Contenido:** la única sustitución es el contenido canónico propio de Contador Público, conforme a Vite.
- **Rasterizado:** diferencias menores de fuentes/antialiasing y gradientes, especialmente en móvil claro.
- **Dinámicas:** ninguna relevante en el viewport capturado.
- **Aceptadas:** la diferencia histórica de altura del footer móvil compartido, previamente documentada, permanece fuera de alcance.

## Conclusión

No se detectan diferencias bloqueantes. La comparación recomienda aprobar visualmente Contador Público una vez revisadas las imágenes fuente y de análisis incluidas en esta carpeta.
