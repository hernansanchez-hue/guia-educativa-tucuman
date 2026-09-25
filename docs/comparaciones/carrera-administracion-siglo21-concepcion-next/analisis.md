# Análisis visual — Lic. en Administración contextual

## Medición de diferencias

| Escenario | Píxeles diferentes | Porcentaje | Delta RGB medio | Clasificación |
|---|---:|---:|---:|---|
| Escritorio claro | 260 / 1.296.000 | 0,0201 % | 0,0136 | Rasterizado menor |
| Escritorio oscuro | 255 / 1.296.000 | 0,0197 % | 0,0064 | Rasterizado menor |
| Móvil claro | 36.359 / 328.770 | 11,0591 % | 0,1080 | Gradiente/subpíxel, sin cambio geométrico |
| Móvil oscuro | 207 / 328.770 | 0,0630 % | 0,0229 | Rasterizado menor |

Las superposiciones y diferencias no muestran desplazamientos estructurales. La variación de móvil claro es de baja intensidad por píxel y reproduce el patrón ya validado de gradiente/antialiasing, no un cambio de DOM o CSS.

## Revisión funcional y visual

| Elemento | Resultado |
|---|---|
| Hero, imagen y título | Coinciden con Vite; imagen de diseño y nombre visible canónico. |
| Badge | `Próximo ingreso` permanece en la tercera tarjeta; la ficha contextual no muestra badge en el hero, igual que Vite. |
| Hechos / tabs | Seis datos correctos; cinco tabs sticky (82px escritorio, 72px móvil), con 150px de alto móvil. |
| Contenido | Descripción, perfil, campo, plan, requisitos y FAQ proceden literalmente de la normalización Vite. |
| Sidebar y formulario | Mismos campos/opciones/reset; lead simulado registra `Lic. en Administración` y se limpia. |
| WhatsApp | Fallback institucional `543865412020` con mensaje contextual. |
| Responsive / temas | Móvil CSS real 390×843 sin overflow. Claro y oscuro mediante `guiaEducativaTheme`. |
| Regresiones | Abogacía y Contador siguen disponibles; Administración navega por mapeo explícito; Higiene sigue inactiva. |

## Clasificación final

- **Estructurales:** ninguna.
- **CSS comprobables:** ninguna; cliente y CSS de carrera permanecen intactos.
- **Contenido:** solo los valores canónicos de Lic. en Administración.
- **Rasterizado:** antialiasing y gradiente menor.
- **Dinámicas:** ninguna relevante en el viewport.
- **Aceptadas:** diferencia histórica de footer móvil compartido, fuera de alcance y no corregida.

Conclusión: no hay diferencias visuales bloqueantes; la comparación recomienda aprobación visual de esta migración.
