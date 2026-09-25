# Auditoría profunda — Academia Profesional Norte | Aguilares

## Identidad y datos canónicos Vite

| Campo | Valor |
| --- | --- |
| Nombre | Academia Profesional Norte |
| ID futuro | `academia-profesional-norte-aguilares` |
| Ciudad / slug | Aguilares / `aguilares` |
| Slug público / ruta futura | `academia-profesional-norte` / `/aguilares/academia-profesional-norte` |
| Tipo / orden | Academia / 3 |
| Logo | APN |
| Portada | `imageBank.design` |
| Slogan | Capacitaciones digitales para empezar a trabajar. |
| Descripción | Cursos prácticos de diseño, redes sociales, ventas y herramientas digitales. |
| Dirección / WhatsApp | Moreno 575, Aguilares / `3865 60 7711` |
| Medio | Video de alumnos |

No hay web ni horarios diferenciados en la fuente Vite. La ficha institucional puede reutilizar InstitutionPageClient, ruta dinámica y CSS existentes sin diferencias estructurales detectadas.

## Ofertas y clasificación comprobada

| Orden | Nombre | Slug previsto | Imagen | Badge | Dominio confirmado |
| --- | --- | --- | --- | --- | --- |
| 1 | Diseño Gráfico | `diseno-grafico` | `imageBank.design` | Inscripciones abiertas | Carrera académica en la SPA |
| 2 | Community Manager | `community-manager` | `imageBank.video` | Nueva carrera | Carrera académica en la SPA |
| 3 | Ventas Digitales | `ventas-digitales` | `imageBank.fair` | Próximo ingreso | Carrera académica en la SPA |

Evidencia: las tres aparecen dentro de `defaultInstitutions[].careers`; `renderCareers()` genera las tarjetas y `showCareer()` las resuelve por `currentInstitution.careers`. No pertenecen a la colección independiente de `trainingPrograms`/`trainingOfferings` usada por Centro de Formación Tucumán. Por ello la arquitectura `trainingProgram + trainingOffering` **no aplica**; no se requiere una arquitectura nueva: el modelo preliminar es `career master + offering`, sujeto a auditoría por oferta.

La primera oferta es Diseño Gráfico, carrera académica prevista `diseno-grafico`; no existe master equivalente en los datos actuales. Su ruta futura prevista, si se confirma en etapa posterior, es `/aguilares/academia-profesional-norte/carreras/diseno-grafico`.

Academia debe permanecer aislada de Centro de Formación Tucumán. Anomalía canónica: contenido etiquetado como capacitaciones/cursos, pero modelado y navegado como carreras por Vite.

## Estado al finalizar

- Siglo 21 Aguilares: cerrada en master.
- Santa Bárbara Aguilares: completa funcionalmente en la rama actual, pendiente de merge de Diagnóstico.
- Academia Profesional Norte: auditada, sin ficha ni ofertas implementadas.
