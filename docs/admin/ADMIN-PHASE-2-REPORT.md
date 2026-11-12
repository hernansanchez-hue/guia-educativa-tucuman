# Informe fase 2 — Supabase/Auth/RLS CMS GET

12/10/2026. Infraestructura implementada y aplicada en get-definitivo. Pendiente activar el primer superadmin real y comprobar correo/login/logout con esa identidad. Trabajo detenido antes de fase 3.

## Respuestas a los 54 puntos solicitados

1. **AGENTS:** análisis previo, anuncio de archivos, conservación visual/datos, validación y cierre por fase. La solicitud explícita de fase 2 autoriza conectar la infraestructura Supabase; no se migró el catálogo público.
2. **Supabase existente:** proyecto activo, Postgres 17.6.1.155, siete tablas con siete políticas SELECT y public.set_updated_at. Se revisaron columnas, claves/relaciones, índices, triggers y funciones.
3. **Proyecto:** get-definitivo, ref zomoblpgurchkxvkkutj, sa-east-1; no se creó otro.
4. **Variables detectadas:** antes de fase 2 no había configuración local; se recuperó la publishable key existente mediante conector y se configuraron SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, PUBLIC_CATALOG_SOURCE=local y GET_ADMIN_ORIGIN en .env.local ignorado.
5. **Faltantes:** email/nombre inicial y credencial privada server-only para bootstrap/invitaciones. No faltan URL/publicable para Auth ordinario.
6. **Tablas anteriores:** cities, institutions, career_masters, academic_offerings, training_programs, training_offerings, teacher_courses.
7. **Tablas creadas:** admin_profiles, cms_documents, cms_versions, cms_audit_logs.
8. **Tablas existentes modificadas:** ninguna de las siete anteriores. La segunda migración ajustó policies e índice de las tablas CMS recién creadas.
9. **Migraciones:** 20261012144333_cms_editorial_auth_v1.sql y 20261012145607_cms_editorial_policy_indexes_v1.sql y 20261012151953_cms_bootstrap_identity_guard_v1.sql, creadas con CLI y alineadas con los timestamps realmente registrados por MCP.
10. **Aplicadas:** sí, las tres; lista remota y catálogos Postgres confirmados. No ejecutar de nuevo desde CLI sin conciliar las cinco versiones históricas preexistentes.
11. **Roles:** SUPERADMIN, ADMIN, EDITOR restringidos por CHECK; status active/disabled y can_publish protegido.
12. **Permisos:** dominio de fase 1 conservado y verificación real en servidor/SQL, denegación por defecto, diseño/settings/usuarios exclusivos de SUPERADMIN.
13. **RLS:** habilitado en las cuatro tablas; cuatro políticas SELECT authenticated; sin grants de tabla a anon ni escritura directa authenticated.
14. **Policies:** profiles=propio activo o SUPERADMIN; documents=equipo activo y restricción design/settings; versions=solo documentos autorizados; audit=equipo activo, EDITOR solo actor propio y ADMIN/SUPERADMIN historial.
15. **SQL:** diez funciones privadas (current_profile, can_perform, can_content, valid_json, immutable_history, mutate_content, read_published, manage_profile, auth_event, bootstrap), cinco wrappers públicos SECURITY INVOKER; implementación privilegiada en cms_private con search_path vacío y grants específicos.
16. **Índices:** PRIMARY/UNIQUE de las cuatro tablas y siete índices explícitos: profiles_role_status, documents_module_updated/created_by/updated_by/published_fk, audit_actor_created/entity_created. Los nombres completos están en ADMIN-DATA-MODEL.
17. **Auth servidor:** cliente SSR por request, cookies async, getUser para identidad actual y perfil DB/RLS; requireAdmin/requireRole, proxy getClaims para refresh; auth.sessions vigente y email confirmado en DB.
18. **Auth browser:** factory oficial createBrowserClient preparada con URL/publicable, cookies /admin; UI mínima usa Server Actions. Sin tokens manuales localStorage ni service key en bundle.
19. **Protección /admin:** anónimo → login; cuenta sin perfil activo/verificado → acceso denegado; guard de proxy, layout protegido, páginas y cada acción, más RLS/RPC.
20. **/admin/login:** formulario mínimo real y limpio; HTTP 200, sin presentación pública, noindex; disponible en localhost:4004.
21. **Logout:** signOut real, POST Server Action, audit si actor activo, funciona también para perfil desactivado. Recorrido con cuenta real pendiente de alta inicial.
22. **Recuperación:** resetPasswordForEmail, PKCE/token_hash callback, updateUser de sesión verificada, contraseña mínima 12 y cierre global; no enumeración de cuentas. Correo real requiere confirmar URLs/plantillas/entrega en Auth.
23. **Email verification:** obligatoria; mailer_autoconfirm=false confirmado mediante endpoint Auth; RLS rechaza identidad no verificada.
24. **Bootstrap:** npm run admin:bootstrap -- invite/promote; email explícito confirmado con una única identidad, service credential solo local, idempotente para mismo perfil activo; sin endpoint Next de promoción. RPC probado realmente con fixtures revertidos.
25. **Dato humano necesario:** email y nombre reales del primer SUPERADMIN. La credencial privada se configura únicamente en .env.local/entorno, nunca en el chat/repositorio.
26. **Repositorios:** SupabaseContentRepository, factory servidor getContentRepository, lectura publicada aislada, backend de list/manage/invite perfiles. Mutaciones por RPC transaccional.
27. **Memoria preservada:** content-document.mjs y permissions/module-registry de fase 1 permanecen; transformaciones usadas por el repositorio. No había una clase persistente en memoria separada: no se inventa que existía. Sin fallback automático administrativo.
28. **Draft persistible:** sí, escrituras/lecturas reales probadas en transacción rollback. Guardar no cambia publicado.
29. **Published persistible:** sí, snapshot/puntero; publicación editorial aún no modifica páginas públicas.
30. **Versiones persistibles:** sí, UNIQUE y triggers inmutables; restore genera nuevo draft y republicar agrega versión.
31. **Audit persistible:** sí, actor derivado Auth y metadata mínima; triggers bloquean modificación/borrado.
32. **Preview data:** Server Action protegida, payload validado/clonado; usuario público no puede leer tabla privada. No preview visual en esta fase.
33. **Escalada:** ni ADMIN ni EDITOR pueden escribir rol directamente o usar gestión SUPERADMIN; metadata editable ignorada, bootstrap restringido, protección del último SUPERADMIN y denegación de sesión revocada/desactivada.
34. **SUPERADMIN:** edición/publicación/archivo/restauración, perfiles/roles, diseño/settings; eliminación definitiva solo contrato, sin endpoint de borrado.
35. **ADMIN:** edición/publicación/archivo/restauración, SEO/media preparados; sin roles/configuración sensible.
36. **EDITOR:** drafts/preview/SEO/media preparados; publicar solo por can_publish concedido desde DB por SUPERADMIN; sin archivo/restauración/gestión de usuarios.
37. **Nuevos tests:** 9 unitarios de Auth/repositorio; 40 comprobaciones SQL; scripts de conexión REST y HTTP guard/regresión pública. Expectativa authImplemented de un test de fase 1 se actualizó a true.
38. **Resultados nuevos:** 9/9; junto con fase 1 20/20; 40/40 SQL, todo rollback; conexión REST y checks HTTP pasaron.
39. **Suite completa:** 125 tests, 112 pasan, 13 fallos preexistentes, 0 fallos nuevos.
40. **Fallos anteriores:** 11 institution-page-catalog por nationalValidity de fixtures; 2 public-routes-catalog por 51 versus 79 URLs/SEO. No se corrigieron fuera de alcance.
41. **Fallos nuevos:** ninguno al cierre; incompatibilidad de import named CJS @next/env en scripts se corrigió durante validación.
42. **Lint:** 0 errores, 9 warnings preexistentes img de cursos-docentes/nosotros/servicios.
43. **Build:** Next.js/TypeScript correctos, 110 páginas generadas; admin dinámico. Compilación final repetida tras ajustes de callback/robots.
44. **Creados:** listado completo abajo, más .env.local ignorado con clave exclusivamente publicable.
45. **Modificados:** listado completo abajo. No se reemplazaron textos, estilos ni datos públicos.
46. **Preexistentes preservados:** hashes de 572 archivos anteriores; 558 intactos, 14 modificaciones de fase 2 previstas. Legales, CSS institucional/global/servicios, banners previos y dominio CMS permanecen. Scripts previos no se atribuyen a fase 2.
47. **Supabase remoto modificado:** sí, schema CMS con tres migraciones; catálogo preservado, sin cuentas/editorial de prueba persistentes al finalizar.
48. **Sitio publicado:** NO; ninguna operación Netlify/DNS/producción.
49. **Commit:** NO; índice Git sin staging.
50. **Push:** NO.
51. **Manual:** activar primer admin; configurar credencial local, comprobar redirects/plantillas SMTP y verificar email. Instrucciones precisas en ADMIN-SETUP.
52. **Riesgos/pendientes:** recorrido Auth/correo con persona real; validadores/proyecciones/revalidación de cada editor; timestamps históricos CLI; npm audit 12 avisos preexistentes (11 altos, 1 crítico, Next incluido). No actualizar framework a ciegas ni exponer admin en producción sin resolverlos. Advisors Supabase seguridad sin avisos; performance solo índices no usados, sin warnings tras segunda migración.
53. **Porcentaje real:** infraestructura de las 21 capacidades de fase 2 implementada; activación/pruebas de usuario real pendientes. Cobertura de edición visual del CMS: 0/22 módulos, 0%. No confundir base Auth/editorial con CMS completo.
54. **Próxima fase:** FASE 3 — shell visual Admin sobre guards/repositorios reales, después de revisar Auth. No iniciada; trabajo detenido.

## Archivos creados en fase 2

```text
docs/admin/ADMIN-PHASE-2-REPORT.md
next-app/.env.local (ignorado; no versionar)
next-app/.env.local.example
next-app/app/admin/(protected)/content-actions.js
next-app/app/admin/(protected)/layout.js
next-app/app/admin/(protected)/page.js
next-app/app/admin/AuthForm.js
next-app/app/admin/acceso-denegado/page.js
next-app/app/admin/actions.js
next-app/app/admin/admin.module.css
next-app/app/admin/callback/route.js
next-app/app/admin/confirmar/route.js
next-app/app/admin/layout.js
next-app/app/admin/login/page.js
next-app/app/admin/recuperar/page.js
next-app/app/admin/restablecer/page.js
next-app/app/components/PublicAnalytics.js
next-app/lib/admin/auth-callback.js
next-app/lib/admin/auth-contract.mjs
next-app/lib/admin/auth.js
next-app/lib/admin/repositories.js
next-app/lib/admin/supabase-content-repository.mjs
next-app/lib/admin/users.js
next-app/lib/supabase/client.js
next-app/lib/supabase/server.js
next-app/lib/supabase/service.js
next-app/proxy.js
next-app/scripts/bootstrap-admin.mjs
next-app/scripts/check-admin-connection.mjs
next-app/scripts/check-admin-http.mjs
next-app/tests/admin-auth-persistence.test.mjs
supabase/migrations/20261012144333_cms_editorial_auth_v1.sql
supabase/migrations/20261012145607_cms_editorial_policy_indexes_v1.sql
supabase/migrations/20261012151953_cms_bootstrap_identity_guard_v1.sql
supabase/tests/cms_editorial_auth_v1.sql
```

## Archivos modificados en fase 2

```text
docs/admin/ADMIN-ARCHITECTURE.md
docs/admin/ADMIN-DATA-MODEL.md
docs/admin/ADMIN-MIGRATION-STATUS.md
docs/admin/ADMIN-PERMISSIONS.md
docs/admin/ADMIN-PUBLISHING-FLOW.md
docs/admin/ADMIN-SETUP.md
next-app/.gitignore
next-app/app/components/PublicSiteBackground.js
next-app/app/layout.js
next-app/app/robots.js
next-app/lib/admin/environment.mjs
next-app/package-lock.json
next-app/package.json
next-app/tests/admin-foundation.test.mjs
```

La búsqueda de bypasses no encontró atajos activos. git diff --check sin errores; avisos LF/CRLF ya habituales. El índice está vacío. El working tree conserva todos los cambios previos y los de CMS fases 1/2.

## Evidencia reproducible y límites

SQL: supabase/tests/cms_editorial_auth_v1.sql, 40 aserciones de roles/RLS, draft, publicación/restauración, audit, bootstrap, estado y sesión. Los sujetos Auth son exclusivamente fixtures dentro de BEGIN/ROLLBACK. No se crearon cuentas personales ni contraseñas ficticias persistentes.

Conexión: scripts/check-admin-connection.mjs consultó get-definitivo con publicable real, anon read/write rechazados, lectura publicada sin draft y Auth disponible. HTTP: /admin, /admin/preview/private y /admin/users redirigen anónimo a login; /admin/login sin GA/footer/fondo, noindex/cache privada; reset anónimo denegado, sitemap sin admin.

Rutas públicas respondieron 200: /, /concepcion, /monteros, /aguilares, /concepcion/universidad-siglo-21, /concepcion/universidad-siglo-21/carreras/abogacia, /carreras, /instituciones. Home conserva video. Estas comprobaciones HTTP/hashes no sustituyen revisión de usuario real, correo ni editor visual.

Documentación oficial Auth: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs.
Advisors de índices no usados: https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index. No se borran índices nuevos por no haber tráfico todavía.

Local al finalizar: http://localhost:4004/admin/login. Para entrar falta activar la identidad real; la pantalla mínima no es el shell visual completo.
