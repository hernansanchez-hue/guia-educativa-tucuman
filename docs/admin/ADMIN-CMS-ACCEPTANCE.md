# Aceptación funcional final del CMS GET

14/10/2026. Alcance: activación real, pruebas controladas, clasificación de fallos y estado del roadmap. Sin nuevas funciones ni despliegue.

## Identidad real

El archivo local ignorado `.env.local` tiene `SUPABASE_SECRET_KEY`; solo se comprobó su presencia. Proyecto, email, nombre y origen local coinciden con `get-definitivo`, `hernan@guiaeducativatuc.com.ar`, César Hernán Sánchez y `http://localhost:4004`. `npm run admin:bootstrap -- invite` terminó correctamente. Supabase Auth devuelve `invited=true`, `email_confirmed=false`, `has_profile=false`; rol y estado siguen nulos. No se llamó a `promote` antes de la confirmación ni se creó contraseña ficticia. La clave no se imprimió, no se movió a `NEXT_PUBLIC_*` y `.env.local` está fuera de Git.

El usuario debe abrir su invitación y definir su propia contraseña. Solo entonces corresponde ejecutar el bootstrap `promote`, verificar `SUPERADMIN/active` y recorrer las pruebas reales autenticadas. Los tests SQL usan identidades temporales con rollback y no equivalen a este paso.

## Casos de aceptación solicitados

| Caso | Estado | Evidencia disponible y paso restante |
| --- | --- | --- |
| A — Institución | PENDIENTE | Modelo, UI aislada, SQL y preview privado probados. Falta sesión real: teléfono temporal → draft privado → publicar → HTTP sin deploy → restaurar → historial. |
| B — Carrera | PENDIENTE | Preview desktop/mobile aislado y descarte del modelo probados. Falta edición y descarte con sesión real. |
| C — Home | PENDIENTE | Video/mapa y paridad pública confirmados; draft/preview/descarte SQL y UI aislada. Falta recorrido autenticado real. |
| D — Multimedia | PENDIENTE | Validaciones binarias, permisos y picker probados en código/SQL. Falta upload real, Storage, uso, protección y limpieza controlada. |
| E — SEO | PENDIENTE | Draft/publish, sitemap y metadata validados a nivel de modelo/SQL. Falta meta title temporal y restauración vía HTTP autenticado. |
| F — Usuarios | PENDIENTE | Restricciones de EDITOR/ADMIN/SUPERADMIN y no escalamiento probadas en SQL. No se invitó a un email de prueba sin destinatario humano confirmado; falta prueba real y desactivación. |

Login, logout y recuperación de contraseña también están **PENDIENTES** de confirmación de correo y operación humana. El acceso anónimo a 29 rutas privadas redirige a login; recuperación se renderiza, reset anónimo se deniega, `/admin` devuelve noindex/no-store y no carga Analytics/fondo/footer público.

## Once fallos previos de instituciones

El fixture `tests/institution-page-catalog.test.mjs` fabricaba filas remotas sin `national_validity`; el adaptador correctamente devolvía `undefined` y el `deepEqual` fallaba frente al catálogo local. El dato real existe: las 30 ofertas académicas y 3 capacitaciones remotas tienen `national_validity='Sí'`; los arrays locales también tienen ese campo. Se agregó al fixture desde `app/data/offerings.js` y `app/data/trainingOfferings.js`, con aserción si falta la oferta fuente. No se cambió contenido público, esquema ni datos remotos.

| Fallo | Clasificación | Estado |
| --- | --- | --- |
| Piloto Concepción / Universidad Siglo 21 | Error real del fixture; no bloqueo de producción | PASS |
| Concepción / Universidad Siglo 21 | Error real del fixture; no bloqueo de producción | PASS |
| Concepción / Instituto Santa Bárbara | Error real del fixture; no bloqueo de producción | PASS |
| Concepción / IES Concepción | Error real del fixture; no bloqueo de producción | PASS |
| Monteros / Universidad Siglo 21 | Error real del fixture; no bloqueo de producción | PASS |
| Monteros / Instituto del Sur | Error real del fixture; no bloqueo de producción | PASS |
| Monteros / Centro de Formación Tucumán | Error real del fixture; no bloqueo de producción | PASS |
| Monteros / Instituto San Miguel | Error real del fixture; no bloqueo de producción | PASS |
| Aguilares / Universidad Siglo 21 | Error real del fixture; no bloqueo de producción | PASS |
| Aguilares / Instituto Santa Bárbara | Error real del fixture; no bloqueo de producción | PASS |
| Aguilares / Academia Profesional Norte | Error real del fixture; no bloqueo de producción | PASS |

No eran datos legacy faltantes ni una expectativa obsoleta: la comparación de formas sigue vigente. Resultado: 19/19 en el archivo y 178/178 en la suite general.

## Cuatro pantallas restantes del roadmap 22/22

“Necesaria para producción” se refiere a la pantalla editorial del CMS, no a las obligaciones generales del sitio público. El registro real es `lib/admin/module-registry.mjs`.

| Módulo faltante | Motivo | Necesaria para producción del CMS editorial | Pendiente legal | Pendiente opcional |
| --- | --- | --- | --- | --- |
| Cursos docentes | Página pública legacy; aún no tiene editor CMS. | NO | NO | SÍ |
| Contacto comercial | Página pública legacy; su formulario se excluyó de esta migración. | NO | NO; el tratamiento de datos del formulario sí requiere revisión independiente. | SÍ |
| Formularios | Se difirió para no alterar leads/consentimientos sin reglas aprobadas. | NO como pantalla; revisar el flujo público antes de cualquier lanzamiento. | SÍ | NO |
| Legal | Documentos y textos siguen en revisión profesional; no existe editor CMS. | NO como pantalla; la aprobación legal del sitio público sí es necesaria. | SÍ | NO |

Cobertura de pantallas implementadas: **18/22 = 81,8 %**. No representa aceptación humana ni autoriza publicar.

## Verificación final realizada

| Control | Resultado |
| --- | --- |
| Tests CMS | 73/73 PASS |
| Suite Node completa | 178/178 PASS tras corregir el fixture |
| SQL transaccional | 487 PASS: Auth 40 + editorial visual 24 + Home 21 + extendido/media 131 + final 271; todos con rollback |
| Integridad persistente tras SQL | 106 documentos, 119 versiones, 119 auditorías; redirects 0. Auth pasó de 0 a 1 usuario invitado por la acción autorizada. |
| Lint | 0 errores; 9 avisos anteriores de `<img>` |
| Build / TypeScript | PASS; Next 16.4.0, 114 páginas estáticas |
| Responsive CMS aislado | 35 vistas a 1440/1280/1024/768/390, 3 interacciones; sin error JS/overflow |
| Público | 21 vistas a 1440/768/390 con paridad exacta; 8 rutas HTTP 200 |
| Seguridad anónima | 29 rutas privadas redirigen a login con no-store/noindex; reset anónimo denegado |
| Sitemap | HTTP 200, 103 URLs, sin rutas privadas `/admin` |
| Redirects | Reglas y status probados en SQL; sin fila publicada, prueba HTTP real pendiente |
| Supabase advisor | 0 WARNING/ERROR. 1 INFO de tabla privada `cms_private.editorial_schemas` con RLS sin grants/policies directos, intencional. |

## Estado y bloqueos reales

**CMS FUNCIONAL: 81,8 % de cobertura. ROADMAP: 18/22. LISTO PARA USO LOCAL: NO. LISTO PARA PRODUCCIÓN: NO.**

- **Técnico:** falta aceptación autenticada real de A–F, login/logout/recovery, permisos de EDITOR y publicación/revalidación HTTP. La ejecución SQL aislada no la reemplaza.
- **Configuración:** la invitación está sin confirmar; aún no hay `admin_profile` SUPERADMIN activo. Para producción faltan comprobación de origen/redirect/SMTP, variables privadas, Storage, límites del hosting y backups/recuperación.
- **Legal:** `docs/legal/LEGAL-LAUNCH-CHECKLIST.md` declara BORRADOR/NO APROBADO. La aprobación profesional de privacidad/cookies/consentimiento y tratamiento de consultas es requisito separado para el lanzamiento público; no se editó esa área.

**Git add NO · commit NO · push NO · deploy NO.** El working tree existente se conservó. Cambios de esta aceptación: fixture Node, aserción SQL histórica, checklist y este informe. Servidor local disponible en `http://localhost:4004/admin/login`.
