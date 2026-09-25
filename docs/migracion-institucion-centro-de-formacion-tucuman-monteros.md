# Auditoría — Centro de Formación Tucumán | Monteros

## Fuente canónica y posición

La auditoría se limita a la demo Vite, `src/main.js`. `cityInstitutions()` filtra el arreglo canónico por `inst.city.includes(currentCity)`. Para **Monteros** el orden visible real es:

1. Universidad Siglo 21
2. Instituto del Sur
3. **Centro de Formación Tucumán**
4. Instituto San Miguel

Por lo tanto, Centro de Formación Tucumán es la tercera institución visible. La entrada original está después de Instituto del Sur en `defaultInstitutions`; no tiene un ID explícito en Vite, solo identidad derivada del nombre.

## Identidad de sede futura (no implementada)

- Nombre: **Centro de Formación Tucumán**.
- ID interno futuro: `centro-de-formacion-tucuman-monteros`.
- Slug público futuro: `centro-de-formacion-tucuman`.
- `citySlug`: `monteros`.
- Tipo: `Capacitación`.
- Plan: `Básico`.
- Orden de Monteros: 3.
- Esta es una sede independiente aun cuando la demo también incluye Aguilares en su arreglo `city`; no se usará `id = slug` ni se reutilizará un ID entre sedes.

## Datos institucionales canónicos

| Campo | Valor Vite |
| --- | --- |
| Logo textual | `CFT` |
| Portada | `imageBank.fair` — `https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80` |
| Slogan | Cursos cortos para fortalecer tu perfil laboral. |
| Descripción | Capacitaciones prácticas para jóvenes y adultos que buscan ampliar oportunidades. |
| Dirección | Rivadavia 295, Monteros |
| WhatsApp | 3863 40 2100 |
| Teléfono adicional | No existe campo separado en la fuente canónica. |
| Web | No existe en la fuente canónica. |
| Medio destacado | Imagen superior |

No hay logo de imagen, URL institucional adicional ni video propio documentado. La demo construye la galería de fallback desde portada + `imageBank.students`, `imageBank.classroom` e `imageBank.graduation` cuando no existe un arreglo `gallery` explícito.

## Carreras resumidas

| Orden | Nombre | Descripción | Imagen | Badge derivado |
| --- | --- | --- | --- | --- |
| 1 | Auxiliar Administrativo | Tareas de oficina, atención y documentación comercial. | `imageBank.classroom` | Inscripciones abiertas |
| 2 | Secretariado | Organización, comunicación y soporte administrativo. | `imageBank.students` | Nueva carrera |
| 3 | Operador de PC | Herramientas digitales esenciales para el trabajo. | `imageBank.design` | Próximo ingreso |

La normalización legacy asigna a las tres: duración `3 años`, modalidad `Presencial`, sede heredada `Rivadavia 295, Monteros`, turnos `Consultar`, título igual al nombre, validez `Sí`, formulario habilitado y WhatsApp heredado. Los badges no son datos guardados: `careerCardBadge` los genera cíclicamente por índice con `Inscripciones abiertas`, `Nueva carrera`, `Próximo ingreso`.

## Estructura y comportamiento visual

Al abrir una institución Vite, `showDetail()` conserva el layout institucional compartido:

- botón de regreso a instituciones;
- hero `detail-cover` con portada, logo, tipo + ciudad, nombre y slogan;
- panel de galería/marquee (`creation-marquee`) generado desde la galería de fallback;
- grilla `career-grid` de tarjetas con imagen, badge, metadatos, título, acciones y geometría compartida;
- footer, tema claro/oscuro y responsive globales de la SPA.

La página no requiere DOM, CSS, marquee, tarjetas, footer, controles de tema ni comportamiento responsive especiales. Puede reutilizar íntegramente `InstitutionPageClient.js` y los estilos institucionales existentes. Los botones de carrera deberán permanecer visibles hasta que cada ficha contextual sea auditada/migrada; no se deben abrir rutas indiscriminadamente.

## Navegación y datos de interacción

- Ruta futura de institución: `/monteros/centro-de-formacion-tucuman`.
- En Vite se accede desde `/monteros` con el botón de la tarjeta institucional y se vuelve mediante `backToCity()`.
- La SPA asigna como contexto visual `Capacitación | Monteros`.
- WhatsApp se normaliza por eliminación de caracteres no numéricos y prefijo `54`; el fallback institucional proyectado es `543863402100`.
- El formulario de fichas, cuando existan, reutilizará `localStorage.guiaEducativaLeads`; la ficha institucional por sí sola no crea leads.

## Riesgos y puerta de implementación

1. La presencia de `Aguilares` en la entrada Vite obliga a separar sedes futuras: esta auditoría autoriza solo la sede Monteros.
2. No existe un ID legacy estable: el ID interno futuro debe seguir el modelo `<slug-publico>-monteros`.
3. La demo deriva galería y badges; la implementación debe preservar esos resultados sin inventar recursos o textos.
4. No se detectó estructura visual distinta; si al implementar apareciera una diferencia canónica real, se deberá detener antes de tocar CSS compartido.

Esta auditoría es exclusivamente documental. No crea institución, offering, rutas ni páginas nuevas.

## Resultado de la puerta de plantilla e implementación institucional

La plantilla institucional actual es reutilizable sin CSS ni componentes específicos: header, hero, galería/marquee, tarjetas, footer, tema y responsive coinciden con el flujo genérico que usa Vite. Para reproducir el fallback visual de Vite, la sede implementada declara explícitamente la galería `[imageBank.fair, imageBank.students, imageBank.classroom, imageBank.graduation]`.

La sede Next.js creada únicamente para Monteros usa `id: centro-de-formacion-tucuman-monteros`, `citySlug: monteros` y slug público canónico `centro-de-formacion-tucuman`, derivado por la normalización de la identidad Vite. La tarjeta de ciudad funciona por el mecanismo genérico de slug; se añadió solo el parámetro estático de esta ruta. No se habilitó Instituto San Miguel ni ninguna ruta de oferta.

El valor `3863 40 2100` pertenece al campo canónico **`whatsapp` de Centro de Formación Tucumán** en Vite. No es un teléfono separado, no pertenece a Instituto del Sur y no se transfirió a otra institución. Para una futura oferta de esta sede será su fallback institucional y se normalizará como `543863402100`; no hay una web ni horarios independientes en la fuente. La ficha conserva las tres tarjetas visibles, pero ninguna tiene navegación contextual todavía.
