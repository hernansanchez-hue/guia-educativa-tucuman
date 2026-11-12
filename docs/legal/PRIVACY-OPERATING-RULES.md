# Privacidad GET — reglas operativas confirmadas

Actualizado: 2026-11-11. Alcance: política pública y consultas de los formularios actuales.
El responsable confirmó la identidad, el domicilio de contacto, el canal de derechos y la regla manual de conservación en este chat. No equivale a certificar cumplimiento jurídico integral ni a aprobar contratos, términos o registros pendientes.

## Datos confirmados

- Responsable: César Hernán Sánchez; Guía Educativa Tucumán, emprendimiento personal.
- Domicilio para recibir solicitudes: Cristóbal Colón 601, Concepción, Tucumán, Argentina. No se infiere domicilio legal.
- Derechos: hernan@guiaeducativatuc.com.ar, confirmado activo por el responsable.
- No incorporar ni publicar DNI. No asumir CUIT, inscripción AAIP, domicilio legal, email legal o datos fiscales no confirmados.
- Configuración: `next-app/lib/legal-config.js`. Política: `next-app/app/privacidad/page.js`.
- La política tiene aprobación del responsable; los demás documentos conservan su estado de borrador.

## Destinos comprobados en el código

| Flujo | Datos y destino | Controles |
| --- | --- | --- |
| Institución/carrera | Nombre, teléfono, email, mensaje, sede y oferta al receptor `public-inquiry-ingest` de GET Instituciones. No se envía a todos los tenants. | Selección validada contra catálogo/mapa privado, autorización explícita, origen, validación, secreto de servidor y comprobante de recepción. |
| `/contacto` | Institución, persona, teléfono, email, plan, mensaje, fecha y estado en `get_commercial_contacts` de get-definitivo. | Miembros activos Administrador/Editor; RLS; idempotencia; límites de frecuencia; servidor confirma solo después de persistir. Sin email ni derivación automática al CRM académico. |
| Analítica | Rutas públicas verificadas y eventos sin texto libre ni datos de contacto. | Deshabilitada hasta confirmar configuración GA4; consentimiento previo; administrador/preview excluidos. |

La nueva casilla/versionado de consentimiento se valida antes de persistir o derivar. No se alteró el contrato del receptor CRM ni el esquema remoto: no se afirma que exista un registro durable individual de la versión del consentimiento. Si se requiere esa evidencia, coordinar una ampliación explícita del contrato y almacenamiento, sin introducirla como texto en mensajes educativos.

## Conservación: regla aprobada, no temporizador inventado

1. Conservar mientras se atiende la consulta o exista seguimiento solicitado.
2. Revisar al cerrar y al detectar falta de respuesta/seguimiento. No dejar consultas abiertas indefinidamente sin una gestión vigente.
3. Eliminar o anonimizar lo innecesario. Una obligación o reclamo concreto que lo impida debe documentarse, restringir acceso y revisarse cuando termine el motivo.
4. El estado `cerrada` NO elimina filas. No hay purga programada. La revisión y su ejecución son responsabilidad operativa de GET.
5. La consola actual solo cambia estados: una eliminación requiere intervención técnica autorizada. No otorgar permisos de borrado públicos ni relajar RLS. Antes de operar, delimitar IDs, verificar dependencias y registros de auditoría, ejecutar de forma controlada y comprobar ausencia de datos personales residuales. Un hash o un UUID enlazable no equivale por sí solo a anonimización.
6. Si el CRM educativo recibió la consulta, coordinar también allí su rectificación/supresión con el responsable de ese sistema. Este cambio NO modifica GET Instituciones.
7. Respaldos: registrar las supresiones con información mínima y acceso restringido. Antes de volver a servir un respaldo restaurado, reaplicar las supresiones. No prometer purga inmediata de todas las copias ni un plazo de proveedor no comprobado.
8. No se ejecuta ninguna eliminación de consultas, archivos o respaldos como parte de este cambio.

## Duraciones que sí existen en código

- Preferencia de Analytics válida 180 días; cookies GA solicitadas con 180 días y sin renovación por visita. No confundirlo con retención de eventos en la cuenta GA4.
- Antispam comercial: ventana de 10 minutos; huella HMAC diaria, no IP cruda persistida en la tabla. La función de recepción limpia huellas de más de un día cuando procesa nuevas consultas. No es una purga cron garantizada si no hay tráfico.
- Duplicados del servidor: memoria de proceso con limpieza oportunista; la deduplicación durable usa el registro de recepción.
- Contactos, historial, logs de proveedores, sesiones y respaldos: no hay un plazo universal de borrado confirmado; aplicar finalidad y reglas verificadas de cada sistema, no inventar meses/años.

## Solicitudes de derechos

- Atender el correo confirmado. Solicitar solo información mínima para verificar identidad y ubicar registros; no pedir DNI completo por defecto.
- Acceso: diez días corridos desde requerimiento fehaciente. Rectificación/actualización/supresión: cinco días hábiles, cuando corresponda. Comunicar a destinatarios las correcciones/supresiones exigibles.
- Registrar motivo de cualquier conservación excepcional y restringir el tratamiento mientras se resuelve.
- Referencias: [Ley 25.326, arts. 4, 6, 14 y 16](https://www.argentina.gob.ar/normativa/nacional/64790/actualizacion), [AAIP](https://www.argentina.gob.ar/aaip/datospersonales/derechos).

## Protecciones de esta entrega

- Consentimiento explícito y versión vigente exigidos en servidor para ambos formularios.
- Destinatario educativo identificado también en perfiles gratuitos.
- Los formularios activos de perfiles/carreras ya no crean copias de datos personales en `localStorage` ante errores. Conservan los campos en memoria para reintentar.
- No borrar silenciosamente copias locales antiguas: la política explica cómo quitar los datos del sitio en el navegador.
- Ningún dato del responsable salvo nombre, actividad, domicilio de contacto y correo confirmado se publica.
- Sin migraciones, cambios de RLS, claves, catálogo, planes ni receptores remotos.

## Pendientes ajenos a esta política

Se conservan los pendientes técnicos ya informados: cierre de rotación de la clave expuesta, confirmación de configuración GA4 y dos ofertas ATSA sin vínculo CRM. No repetir respaldos, pruebas remotas de aceptación o auditorías generales ya completadas. Validar únicamente esta modificación y el candidato final cuando se desbloquee la publicación.

## Archivos de esta etapa

Rutas relativas a `C:\Codex\GET-production`; no representan todos los cambios preexistentes del working tree.

- `next-app/lib/legal-config.js`
- `next-app/lib/privacy/inquiry-consent.mjs` (nuevo)
- `next-app/app/privacidad/page.js`
- `next-app/app/components/approved/InquiryForm.js`
- `next-app/app/contacto/ContactForm.js`
- `next-app/app/contacto/contacto.css`
- `next-app/lib/integration/public-inquiry.mjs`
- `next-app/lib/integration/commercial-contact.mjs`
- `next-app/tests/public-inquiry-integration.test.mjs`
- `next-app/tests/commercial-contact.test.mjs`
- `next-app/tests/commercial-inbox.test.mjs`
- `next-app/tests/public-security-privacy.test.mjs`
- `next-app/tests/privacy-consent.test.mjs` (nuevo)
- `docs/legal/PRIVACY-OPERATING-RULES.md` (nuevo)
- `docs/legal/LEGAL-REVIEW-PENDING.md`
- `docs/legal/LEGAL-LAUNCH-CHECKLIST.md`

## Validación de esta etapa

- Suite completa: 315 pruebas aprobadas, cero fallos.
- Lint: cero errores; 34 advertencias de imágenes preexistentes. Los errores iniciales de Link y nombre de variable en el test se corrigieron antes de finalizar.
- Build completo de Next.js 16.4.1 en copia local aislada: exitoso.
- HTTP sobre ese build: política y tres formularios responden 200; ambos endpoints rechazan sin consentimiento con 400. No se incluyeron claves privadas en el proceso de prueba ni se enviaron consultas a un receptor remoto.
- El primer intento con origen 127.0.0.1 fue rechazado con 403. Se corrigió la configuración del comprobador local para usar localhost y su mapeo de prueba; no se debilitó el control de origen del producto.
- Revisión visual local: escritorio y móvil; sin overflow horizontal en las comprobaciones de 390 px y 320 px. Casillas obligatorias y sin preselección, enlace de privacidad accesible por teclado. Sin errores de consola en las páginas inspeccionadas.
- Catálogo intacto durante esta etapa. No hubo staging, commit, push, deploy, eliminación de datos ni cambios remotos.
