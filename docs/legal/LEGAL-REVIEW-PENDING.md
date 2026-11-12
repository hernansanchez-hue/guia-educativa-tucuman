# Pendientes maestros de revisión legal y técnica

> Registro histórico de la etapa documental inicial. Para el estado vigente de la política y los formularios, consultar [PRIVACY-OPERATING-RULES.md](./PRIVACY-OPERATING-RULES.md), actualizado el 2026-11-11. Las observaciones de este archivo sobre ausencia de backend, Analytics sin consentimiento y titular sin definir ya no describen los flujos públicos actuales. Los contratos y demás documentos no quedan aprobados por esa actualización.

ESTADO: BORRADOR  
REVISIÓN LEGAL: PENDIENTE  
USO EN PRODUCCIÓN: NO APROBADO

Registra decisiones abiertas. Ningún documento de esta carpeta debe presentarse como política o contrato vigente.

## Identidad legal

- Definir titular/persona responsable, CUIT, domicilio, ciudad y emails de privacidad, asuntos legales y contacto general.
- Analizar inscripción o registro ante AAIP según estructura final y normativa vigente. **REVISIÓN LEGAL PENDIENTE.**

## Datos y formularios

- Tres formularios de leads guardan datos personales en `localStorage`. No existe backend de leads confirmado ni envío automático confirmado a instituciones.
- No existe evidencia persistente suficiente de consentimiento asociada a cada consulta ni mecanismo operativo de revocación documentado.
- Definir destino real de leads, responsable de respuesta, backend, acceso, seguridad, conservación y eliminación **antes** de describir el flujo futuro en páginas legales.
- Institución y carrera pueden mostrar éxito aunque falle la escritura local; capacitación no maneja fallo de `setItem`. Documentar y corregir en etapa funcional.
- `/contacto` solo muestra una alerta; definir destinatario y almacenamiento antes de llamarlo seguimiento comercial operativo.
- Revisar minimización de turno y mensaje libre: **Posible dato innecesario — revisar**. No eliminar campos automáticamente.
- Confirmar que futuras URLs y logs no contengan nombre, email, teléfono o mensaje de formulario.

## Instituciones

- Definir quién recibe, responde y conserva consultas en un flujo real de derivación.
- Determinar roles jurídicos de GET y cada institución según el flujo, finalidades, uso posterior, seguridad, atención de solicitudes, incidentes y eliminación. **REVISIÓN LEGAL PENDIENTE.**
- Separar tratamiento principal, eventual derivación y marketing opcional. No se detectó newsletter ni marketing opt-in en formularios actuales.

## Analítica, cookies, almacenamiento y terceros

- GA4 `G-KY9E5NG5V2` se inicializa globalmente antes de una preferencia. Diseñar e implementar consentimiento previo en otra etapa; validar aceptación, rechazo, cambio y no duplicación.
- Identificar mediante navegador cookies reales, duración y comportamiento de terceros. No llamar cookie a `localStorage` de leads.
- Revisar Google Maps embebido, WhatsApp, Cloudinary, Unsplash, Google Fonts, media.w3.org, Netlify y Supabase condicional.
- Verificar configuración de cuentas, ubicación efectiva y posibles transferencias internacionales proveedor por proveedor con profesional. No se afirma licitud actual.

## Menores, orientación y eventos

- Orientación Vocacional aún no tiene formulario. Antes de captar datos, definir datos mínimos, finalidad, receptores, edades posibles y medidas pertinentes. No presumir que una casilla resuelve la participación de menores.
- Eventos aún no tiene inscripción. Futuros registros, sorteos, acreditaciones y autorizaciones de imagen requieren inventario y textos separados; revisar menores si corresponde.

## Consumo, información y propiedad intelectual

- Revisar términos, privacidad, cookies, información académica, destacados, publicidad, promociones y derechos de usuarios/consumidores con abogado.
- Verificar origen y actualización de carreras, sedes, títulos, modalidades, aranceles y promociones.
- Confirmar autorización o licencia de marcas, logos, fotografías, videos, testimonios y material institucional. No presumir autorización existente.

## Cierre documental

- Completar todos los placeholders de `next-app/lib/legal-config.js`; `legalReviewStatus` permanece `draft` hasta aprobación.
- Revisar profesionalmente contrato, autorización de material, esquema de tratamiento y procedimiento de derechos.
- Crear páginas públicas, controles de cookies y cambios de formularios solo en etapas posteriores. No publicar estos borradores.

## Fuentes oficiales de referencia para la revisión

- [AAIP: derechos sobre datos personales](https://www.argentina.gob.ar/aaip/datospersonales/derechos).
- [Ley 25.326, texto oficial](https://www.argentina.gob.ar/normativa/nacional/ley-25326-64790/texto).
- [Ley 24.240, texto actualizado](https://www.argentina.gob.ar/normativa/nacional/638/actualizacion).
- [Ley 11.723, texto actualizado](https://www.argentina.gob.ar/normativa/nacional/ley-11723-42755/actualizacion).
