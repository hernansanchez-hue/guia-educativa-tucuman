# Auditoría — Instituto San Miguel | Monteros

## Identidad canónica

La cuarta y última institución visible de Monteros en Vite es **Instituto San Miguel**.

- ID legacy: no existe como campo estable; Vite deriva su identidad desde el nombre cuando opera sobre la institución.
- Slug público canónico: `instituto-san-miguel`.
- ID interno futuro: `instituto-san-miguel-monteros`.
- `citySlug`: `monteros`.
- Tipo: Instituto.
- Orden: 4.
- Logo textual: ISM.
- Portada: `imageBank.classroom` — `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80`.
- Medio: Imagen superior.
- Slogan: Educación cercana para acompañar vocaciones de servicio.
- Descripción: Propuestas presenciales y a distancia vinculadas a educación, salud y comunidad.
- Dirección: Laprida 660, Monteros.
- WhatsApp: 3863 47 6400; normalización futura: 543863476400.
- Teléfono separado, web y horarios: no existen en Vite.

No hay otra sede de Instituto San Miguel en Vite, pero el modelo requiere mantener el ID interno distinto del slug.

## Tarjetas visibles y dominio

| Orden | Nombre | Descripción | Imagen | Badge derivado |
| --- | --- | --- | --- | --- |
| 1 | Profesorado | Formación pedagógica con prácticas y acompañamiento. | `imageBank.classroom` | Inscripciones abiertas |
| 2 | Gestión Educativa | Herramientas para coordinar proyectos institucionales. | `imageBank.students` | Nueva carrera |
| 3 | Acompañante Terapéutico | Intervención, apoyo y seguimiento en contextos de cuidado. | `imageBank.lab` | Próximo ingreso |

Vite las presenta mediante el flujo genérico de `careers` y la ficha muestra título, duración, modalidad, plan, requisitos y formulario. Por su semántica y el tipo institucional, deben auditarse como **carreras académicas** con `career master + offering`, no como capacitaciones. No se implementa ninguna en esta etapa.

## Plantilla visual

La ficha usa íntegramente la plantilla institucional existente: ruta dinámica, `InstitutionPageClient.js`, hero, marquee/galería fallback, tarjetas, footer, tema claro/oscuro y responsive. La galería de fallback canónica será portada + `imageBank.students`, `imageBank.classroom` e `imageBank.graduation`.

Ruta institucional futura: `/monteros/instituto-san-miguel`. No se detectó diferencia estructural que requiera componente o CSS específico.
