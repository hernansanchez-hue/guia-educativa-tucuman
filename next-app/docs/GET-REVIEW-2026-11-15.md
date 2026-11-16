# Correcciones acotadas de GET — 15 de noviembre de 2026

## Alcance y recuperación

Base de producción: `b2683ba69ebf1578a6d24436da2439ebbcde00ab`.
Deploy previo: `6af53a2d1bf9092b547d1b5e` (Netlify, `guia-educativa-tucuman`).
Trabajo aislado en `codex/review-fixes-20261115`; no se incorporan los cambios pendientes de `C:\Codex\GET-production`.

Esta entrega no modifica esquemas, datos, Auth, RLS, claves ni otros proyectos. El rollback puede republicar el deploy previo o revertir este commit mediante un nuevo commit y un push fast-forward. No debe restaurar ni borrar datos de Supabase. El deploy anterior contiene una versión anterior de Next.js: usarlo solo como recuperación de emergencia mientras se corrige el problema.

## Cambios independientes preparados

- Next.js y eslint-config-next: 16.4.1 → 16.4.5, con lockfile y dependencias internas correspondientes; sin actualizaciones masivas. [Recomendación oficial para Netlify](https://www.netlify.com/changelog/2026-11-03-nextjs-security-vulnerabilities/). El adaptador se instala automáticamente: comprobar en el nuevo deploy que sea al menos `@netlify/plugin-nextjs` 5.16.6.
- GA4 conserva `G-KY9E5NG5V2`, consentimiento previo, señales publicitarias desactivadas y exclusión del administrador, vistas privadas y dominios de prueba. Las campañas usan una taxonomía cerrada y los referidores autorizados solo conservan el dominio. Los títulos proceden del catálogo publicado.
- Las búsquedas se contabilizan al enviar, presionar Enter o elegir un resultado, no por pausas de escritura. Los comprobantes confirmados se deduplican con una huella local en la pestaña (30 minutos, solo con consentimiento); nunca se envían a GA4. Los clics en WhatsApp siguen siendo interacciones, no consultas recibidas.
- Sitemap y enlaces derivados de ciudad reutilizan la elegibilidad real de las fichas destacadas. Las carreras sin ficha individual apuntan al listado de su institución. No se alteran planes, seleccionados, textos o catálogo. `/ciudades` conserva su 301 a `/`.
- Consultas educativas: lectura limitada a 8 KiB reales, incluido cuerpo sin Content-Length, y clave de idempotencia estable para reintentos del mismo contenido durante 10 minutos en memoria. No se guarda el contenido en almacenamiento del navegador.
- Protección declarativa Netlify en `next-app/netlify/edge-functions/public-inquiry-guard.js`: POST `/api/public-inquiries`, 30 solicitudes por 60 segundos por IP y dominio; HTTP 429. No usa un contador de memoria de Next.js. Según [Netlify](https://docs.netlify.com/manage/security/secure-access-to-sites/rate-limiting/), la aplicación del límite puede tardar hasta 10 segundos. Verificar su aceptación en postprocesamiento; un deploy exitoso por sí solo no demuestra que la regla fue aceptada.
- Imágenes de logos compartidos con variantes responsivas, dimensiones visuales preservadas, preconexión a los mismos proveedores tipográficos y etiquetas accesibles que incluyen el texto visible. No hay cambios de CSS, colores, tipografía, composición ni fondo animado.
- Política de privacidad: solo descripción de esta atribución, deduplicación y sus versiones. No se cambian los datos confirmados del responsable ni las reglas de conservación de consultas.

## Invariantes

- Catálogo local: 27 ciudades, 125 sedes, 197 carreras maestras y 200 ofertas territoriales.
- SHA-256 de `lib/catalog/public-catalog.json`: `1ea7588b5940050112e54ca513e43646531d52a9a329826ea1f1652c57b60fa9`.
- Mapeo privado CRM: 125 sedes y 198 ofertas, sin modificación de UUID ni receptor. Las dos ofertas de ATSA pendientes de vinculación no se inventan ni se importan.
- Consultas educativas → GET Instituciones. Consultas comerciales → bandeja del Centro de Control. No se enviaron consultas falsas para verificar conversiones.
- El mapa privado debe aparecer en el trace de `/api/public-inquiries` y no ser accesible por HTTP.

## Validación y límites de la evidencia

La suite contiene 340 tests, incluidos regresiones de atribución, consentimiento, deduplicación, búsqueda, elegibilidad, lectura limitada y guard de Netlify. Lint conserva advertencias preexistentes de imágenes. El proyecto usa JavaScript y `jsconfig.json`, sin `tsconfig.json` ni fuentes TypeScript: se comprueba la compilación y la fase de tipos de Next, no se afirma una auditoría TypeScript independiente.

Las pruebas de Auth, recuperación, roles y publicación usan clientes aislados; no envían correos ni escriben producción. La prueba de sesión humana, MFA, publicación editorial real y escritura comercial requiere las condiciones de respaldo y la participación indicadas abajo. Un build encontró un corte remoto `ECONNRESET`; no se alteró el código para esconderlo.

Lighthouse previo, producción, perfil móvil predeterminado Lighthouse 13.0.1 (laboratorio, no datos de usuarios):

| Ruta | Rendimiento | Accesibilidad | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 73 | 97 | 4,0 s | 0 | 170 ms |
| `/concepcion` | 83 | 92 | 3,6 s | 0 | 70 ms |
| `/concepcion/universidad-siglo-21/carreras/abogacia` | 68 | 97 | 5,4 s | 0 | 90 ms |
| `/contacto` | 66 | 100 | 6,3 s | 0 | 130 ms |

Los JSON completos y la comparación posterior se conservan fuera del repositorio. Las variaciones de red y carga local afectan estas mediciones; no equivalen a CrUX ni permiten prometer una mejora sostenida con una sola ejecución.

## Pendientes que NO se declaran terminados

1. **Respaldo nuevo + Storage y restauración:** Docker Desktop falla al inicializar Inference manager (`dockerInference`). Esta tarea solo consultó disponibilidad/logs, no inició Desktop ni Inference, no reinició WSL y no borró contenedores, volúmenes o respaldos. El respaldo verificado del 6/11 se conserva, pero no sustituye una copia actual del Centro de Control. No hay escrituras remotas de esta entrega.
2. **Consentimiento comercial persistido:** la validación de aceptación existente se mantiene; los campos de versión, fecha de servidor, origen y relación con consulta deben añadirse después del respaldo actual verificado. No se atribuye consentimiento a consultas históricas.
3. **MFA:** pendiente de preparación/activación y prueba humana con servidor y RLS consistentes después del respaldo. No se exige segundo factor ni se modifica el acceso actual.
4. **Panel GA4:** sin sesión autorizada en este navegador. No se afirma que eventos clave o dimensiones estén configurados. Verificar `generate_lead` y `commercial_inquiry_received` como eventos clave; no usar `click_whatsapp` como consulta. Verificar dimensiones de alcance evento `page_type`, `city_slug`, `institution_slug`, `career_slug`, sin duplicar definiciones existentes. Medición mejorada, Signals y personalización publicitaria deben continuar desactivados.
5. **Adquisición:** prueba acotada autorizada con `utm_source=qa-get&utm_medium=verification&utm_campaign=get-verificacion-20261115&utm_content=header`; comprobar los eventos reales y luego su recepción en GA4, sin generar leads ficticios. La llegada a los informes no se puede confirmar únicamente inspeccionando el cliente.

Antes de reiniciar Docker o Windows, coordinar con el usuario el guardado y pausa de ambos chats. No reiniciar ni reinstalar automáticamente. Reanudar las operaciones pendientes solo después de comprobar recuperación aislada, sin tocar GET Instituciones.
