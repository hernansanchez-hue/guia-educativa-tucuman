# Mapa de datos del GET público

ESTADO: BORRADOR  
REVISIÓN LEGAL: PENDIENTE  
USO EN PRODUCCIÓN: NO APROBADO

Inventario técnico basado en la auditoría de `next-app`. Describe el código local, no la operación del hosting. `localStorage` pertenece al navegador del visitante: no es una cookie ni un backend de GET. La duración de los registros no está definida; debe verificarse el funcionamiento real antes de publicar una política.

| Flujo y ruta | Datos solicitados | Finalidad y destinatario actuales | Almacenamiento y tercero | Consentimiento y evidencia | Conservación / estado |
| --- | --- | --- | --- | --- | --- |
| Institución: `/{ciudad}/{institucion}`, modal de `InstitutionPageClient.js` | Nombre, teléfono/WhatsApp, email **obligatorios**; mensaje **opcional**. Se agregan institución, ciudad, fecha y tipo de consulta. | El formulario pretende recibir una consulta. El submit llama a `savePublicLead`; **no hay envío automático a la institución**. Destino técnico: navegador del visitante. | `guiaEducativaLeads` en `localStorage`; sin tercero de envío detectado. | Sin casilla ni evidencia persistente de decisión asociada al lead. | Indefinida. Puede mostrar éxito aunque falle escritura local. |
| Carrera: `/{ciudad}/{institucion}/carreras/{carrera}`, `CareerPageClient.js` | Nombre, teléfono/WhatsApp, email **obligatorios**; turno y mensaje **opcionales**. Se agregan carrera, institución, ciudad y fecha. | La interfaz promete contacto de la institución; el código solo guarda en el navegador. **No hay derivación automática confirmada.** | Misma clave `guiaEducativaLeads`; sin tercero de envío detectado. | Sin consentimiento separado ni evidencia persistente suficiente. | Indefinida. Puede mostrar éxito tras fallo de escritura. |
| Capacitación: `/{ciudad}/{institucion}/capacitaciones/{capacitacion}`, `TrainingPageClient.js` | Nombre, teléfono/WhatsApp, email **obligatorios**; turno y mensaje **opcionales**. Se agregan programa, institución, identificadores, fecha y tipo `training`. | El submit escribe localmente. **No hay envío automático confirmado a la institución.** | Misma clave `guiaEducativaLeads` en `localStorage`. | Sin consentimiento separado ni evidencia persistente suficiente. | Indefinida. `setItem` no maneja el fallo en el submit. |
| Contacto comercial: `/contacto`, `ContactForm.js` | Institución, persona de contacto, WhatsApp, email y plan **obligatorios**; mensaje **opcional**. | `preventDefault` y alerta “Mensaje listo para seguimiento comercial”. **No se encontró envío ni almacenamiento.** | Ninguno en el submit. | Sin aviso de privacidad, consentimiento ni prueba de envío. | No aplica al código actual; mensaje potencialmente confuso. |
| Orientación Vocacional en ciudades | **Sin formulario ni datos solicitados.** | “Quiero sumarme” indica que la inscripción estará disponible próximamente. | Ninguno observado. | No aplica actualmente. | Futuro flujo y posible participación de menores pendientes. |
| Eventos `/eventos` | **Sin formulario de inscripción.** | Contenido y filtros locales; CTA enlaza a `/contacto` o WhatsApp. | Ninguno para inscripción. | No aplica actualmente. | Futuros registros o autorización de imagen pendientes. |

## Otras entradas y almacenamiento

Los buscadores y filtros de Home, header, ciudades, instituciones y cursos docentes operan en la interfaz; no se encontró submit de esos valores a un backend de leads. La clave `guiaEducativaTheme` guarda el tema visual en `localStorage`, separada de los datos personales de `guiaEducativaLeads`.

WhatsApp se abre por enlaces `wa.me` con textos sobre la propuesta; no se construyen con nombre, email o teléfono ingresado en los formularios. Google Maps recibe nombre/dirección de sede en enlaces y un `iframe` de institución. GA4 carga globalmente con `G-KY9E5NG5V2`; sus cookies y duración efectiva requieren prueba de navegador. El catálogo puede leerse desde Supabase si `PUBLIC_CATALOG_SOURCE=supabase`; no se encontró escritura de leads allí.

## Problemas y definiciones previas a políticas públicas

1. Los leads personales quedan solo en `localStorage`. No existe backend de leads confirmado ni envío automático confirmado a instituciones.
2. No existe evidencia persistente suficiente de consentimiento asociada a esas consultas. Tampoco se conoce un mecanismo operativo de revocación.
3. Definir destinatario real, canal, conservación, eliminación, accesos y tratamiento de errores antes de describir el flujo como vigente.
4. Revisar necesidad de turno y mensaje libre: **Posible dato innecesario — revisar**. No se elimina ningún campo en esta etapa.

Fuentes de código: `next-app/lib/public-leads.js`, los tres componentes `*PageClient.js` de institución/carrera/capacitación, `next-app/app/contacto/ContactForm.js`, `next-app/app/[ciudad]/CityInstitutionSections.js`, `next-app/app/eventos/page.js` y `next-app/app/layout.js`.
