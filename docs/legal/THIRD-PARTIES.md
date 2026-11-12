# Terceros y recursos externos detectados

ESTADO: BORRADOR  
REVISIÓN LEGAL: PENDIENTE  
USO EN PRODUCCIÓN: NO APROBADO

Inventario del código local. “Posible procesamiento fuera de Argentina” es un punto a verificar, **no** una conclusión sobre ubicación, adecuación o licitud de una transferencia. No se auditó la configuración activa de cuentas y hosting.

| Servicio | Función y ubicación | Información potencial / carga externa | Procesamiento fuera de Argentina | Estado y pendiente |
| --- | --- | --- | --- | --- |
| Google Analytics 4 | `next-app/app/layout.js`, `gtag.js`, ID `G-KY9E5NG5V2`. | Solicitudes, interacción y datos técnicos según configuración; script externo global. | Posible: **REQUIERE REVISIÓN LEGAL**. | Inicializa sin esperar preferencia. PENDIENTE IMPLEMENTAR CONSENTIMIENTO PREVIO. Verificar cookies en navegador. |
| Google Maps | `InstitutionPageClient.js`, `iframe` y enlaces; footer y fichas SEO. | Nombre/dirección de sede y datos técnicos; el embed puede cargar al visualizarse. | Posible: **REQUIERE REVISIÓN LEGAL**. | Revisar carga y política del proveedor. |
| WhatsApp | Enlaces `wa.me` en footer, instituciones, carreras, capacitaciones, cursos, eventos y servicios. | Número/texto precargado y conversación posterior si se hace clic. | Posible: **REQUIERE REVISIÓN LEGAL**. | No se encontró envío automático de campos de formularios. |
| Cloudinary | Video de Home en `HomeMapClient.js` y `HomeClient.js`. | Video y datos técnicos de conexión. | Posible: **REQUIERE REVISIÓN LEGAL**. | Confirmar cuenta y condiciones. |
| Unsplash | Imágenes externas en datos y páginas de carreras, instituciones, cursos y eventos. | Imágenes y datos técnicos de conexión. | Posible: **REQUIERE REVISIÓN LEGAL**. | Revisar licencias y trazabilidad. |
| Google Fonts | `@import` de Poppins y Geist en `app/globals.css`. | Fuentes y datos técnicos de conexión. | Posible: **REQUIERE REVISIÓN LEGAL**. | Confirmar carga real y condiciones. |
| media.w3.org | Video de ejemplo `sintel/trailer.mp4` en `InstitutionPageClient.js`. | Video y datos técnicos de conexión. | Posible: **REQUIERE REVISIÓN LEGAL**. | Revisar pertinencia y derechos de uso. |
| Netlify | Hosting/build declarado en `netlify.toml`. | Posibles registros técnicos del alojamiento. | Posible: **REQUIERE REVISIÓN LEGAL**. | Confirmar configuración de cuenta, ubicación y logs. No se encontró Netlify Forms. |
| Supabase — **condicional** | Lectura REST de catálogo en `next-app/lib/public-catalog/supabase-public-catalog.js` si `PUBLIC_CATALOG_SOURCE=supabase`. | Catálogo público y datos técnicos de petición del servidor. | Posible si activo: **REQUIERE REVISIÓN LEGAL**. | Confirmar activación en producción. No se encontró escritura de leads personales. |

## Almacenamiento propio, distinto de cookies

`guiaEducativaLeads` y `guiaEducativaTheme` son claves del `localStorage` del sitio. La primera contiene datos personales de consultas; la segunda guarda el tema visual. **No son cookies.** Las cookies que establezcan GA4 u otros terceros, y su duración, requieren pruebas de navegador y revisión de configuración.

No se encontró Meta Pixel, GTM independiente de `gtag.js`, newsletter ni Netlify Forms. Los botones “próximamente” de redes en el footer no prueban una integración técnica con esas redes.
