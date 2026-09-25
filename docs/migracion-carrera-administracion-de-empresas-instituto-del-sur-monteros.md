# Auditoría — Administración de Empresas | Instituto del Sur | Monteros

## Fuente canónica y detección

La única fuente auditada es la demo Vite en `src/main.js`. En la institución **Instituto del Sur**, tercera y última tarjeta del arreglo `careers`, figura literalmente:

- Nombre visible y completo: **Administración de Empresas**.
- Descripción: **Organización, procesos y gestión operativa.**
- Imagen: `imageBank.classroom` — `https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80`.
- Orden: 3.
- Badge calculado por posición: **Próximo ingreso**.
- ID de tarjeta durante la demo: `administracion-de-empresas-<sufijo-aleatorio>`; se origina en `slugifyCareer(nombre)` y el sufijo aleatorio evita que sea un identificador estable.
- Slug canónico de migración propuesto: `administracion-de-empresas`.

La carrera es la tercera y última visible de Instituto del Sur; no hay una cuarta tarjeta en la fuente canónica.

## Datos generales de la carrera en Vite

Al ser una entrada legacy de tres valores, `normalizeCareer` le aplica sin interpretación adicional:

- Duración: `3 años`.
- Modalidad: `Presencial`.
- Título: `Administración de Empresas`.
- Descripción ampliada / acerca de: `Organización, procesos y gestión operativa.`
- Perfil profesional: `Profesional preparado para aplicar conocimientos y desarrollarse en su área.`
- Campo laboral: `Ámbitos públicos y privados relacionados con la formación profesional.`
- Plan: `Primer año`, `Segundo año`, `Tercer año`.
- Requisitos: `DNI`, `Título secundario`, `Formulario de inscripción`.
- FAQ: `¿Cuándo comienzan las inscripciones?` / `Consultá con la institución para conocer las próximas fechas.`; `¿Cómo solicito más información?` / `Podés utilizar WhatsApp o el formulario de esta página.`
- Formulario: habilitado.

## Comparación obligatoria con Lic. en Administración

No se demuestra equivalencia canónica con `lic-en-administracion`, que pertenece a Universidad Siglo 21. Los nombres no coinciden y sus descripciones también difieren literalmente:

| Instituto del Sur | Siglo 21 |
| --- | --- |
| Administración de Empresas | Lic. en Administración |
| Organización, procesos y gestión operativa. | Gestión, liderazgo y estrategia para organizaciones actuales. |
| Título: Administración de Empresas | Título: Lic. en Administración |

Aunque la duración y las generalidades normalizadas son iguales en la demo, eso resulta del mismo mecanismo legacy y no prueba equivalencia académica. La decisión segura es una **nueva career master**, no reutilizar `lic-en-administracion`.

- Career master futura: `administracion-de-empresas`.
- Career ID futuro: `administracion-de-empresas`.
- Slug futuro: `administracion-de-empresas`.

## Futura offering contextual (no implementada)

- ID propuesto: `instituto-del-sur-monteros-administracion-de-empresas`.
- `institutionId`: `instituto-del-sur-monteros`.
- `citySlug`: `monteros`.
- `careerId`: `administracion-de-empresas`.
- Modalidad: `Presencial`.
- Duración: `3 años`.
- Título: `Administración de Empresas`.
- Sede heredada: `Av. Mitre 420, Concepción` (dato canónico tal como existe, aunque la institución se muestra en Monteros).
- Turnos: `Consultar`.
- Validez nacional: `Sí`.
- Imagen: `imageBank.classroom` indicada arriba.
- Badge: `Próximo ingreso`.
- Visible: sí.
- Orden: 3.
- Formulario: habilitado.
- WhatsApp propio: no existe; deberá usar el fallback institucional `3865 44 8712`, normalizado por la lógica compartida como `543865448712`.
- Ruta futura: `/monteros/instituto-del-sur/carreras/administracion-de-empresas`.
- Mapping especial: no requerido; el ID y slug estables propuestos coinciden.

## Reutilización y riesgos

La futura ficha puede reutilizar, sin cambios previstos, `CareerPageClient.js`, `carrera.css`, formulario, tabs, FAQ, sidebar, footer y WhatsApp. La tarjeta puede enlazarse con el patrón ya usado por Marketing y Recursos Humanos conservando DOM, clases, imagen, badge, orden, geometría, hover y responsive.

Riesgos que requieren cuidado en la próxima etapa:

1. No confundir el ID aleatorio interno de Vite con el ID estable de datos Next.js.
2. Mantener separada Administración de Empresas de Lic. en Administración hasta que una fuente canónica demuestre una equivalencia exacta.
3. Conservar la sede canónica textual y el fallback institucional, sin corregir ni reinterpretar datos.
4. No habilitar rutas de carreras ajenas ni modificar componentes o CSS compartidos sin una diferencia real demostrada.

Esta auditoría es exclusivamente documental: no crea career master, offering, ruta ni navegación.
