# Checklist de aceptación y producción del CMS GET

14/10/2026. La invitación al primer SUPERADMIN se envió a `hernan@guiaeducativatuc.com.ar`. Al último control, Auth mostraba email sin confirmar y ningún `admin_profile`. No se publicó ni se modificó la configuración de producción. `PASS` técnico no equivale a aceptación humana.

## Identidad y operación real

- **PENDIENTE** — Email confirmado, perfil activo y rol SUPERADMIN del primer usuario. Invitación enviada; promoción bloqueada hasta que la persona confirme su email.
- **PENDIENTE** — Login y logout reales; cierre/revocación y usuario desactivado sin acceso.
- **PENDIENTE** — Recuperación real de contraseña, entrega del correo y cambio con sesión humana.
- **PENDIENTE** — Invitar EDITOR de prueba, comprobar edición y denegación de gestión/escalamiento de roles, desactivar al terminar. No se envió invitación a una dirección ficticia.
- **PENDIENTE** — Institución: teléfono, Live Preview, borrador privado, publicación HTTP sin deploy, restauración e historial con SUPERADMIN real.
- **PENDIENTE** — Carrera: cambio temporal, preview desktop/mobile, descarte y público intacto con sesión real.
- **PENDIENTE** — Home: cambio temporal, preview, borrador, descarte y video/mapa intactos con sesión real.
- **PENDIENTE** — Multimedia: upload real, Storage, MediaPicker, uso, protección de borrado y limpieza controlada.
- **PENDIENTE** — SEO: draft privado, publicación de meta title y restauración por HTTP real.
- **PENDIENTE** — Auth redirects, plantilla de invitación/recuperación, SMTP y origen de producción comprobados con correo real.
- **PASS** — La credencial privada está presente solo en `.env.local` ignorado; el correo, nombre, proyecto y origen local coinciden con los esperados. El valor no se imprimió ni se versionó.
- **PENDIENTE** — Variables y secreto exclusivos del entorno de producción verificados antes de exponer `/admin`.
- **PENDIENTE** — Capacidad de Storage, memoria y timeout de validación multimedia comprobados en el hosting de producción.
- **PENDIENTE** — Backups, retención y ensayo de recuperación de base y medios definidos y verificados.

## Evidencia técnica local

- **PASS** — RLS/roles/guardas mediante 487 controles SQL transaccionales con rollback; no sustituyen una sesión humana.
- **PASS** — Preview privada, `/admin` noindex/nofollow/no-store y 29 rutas privadas redirigiendo a login cuando no hay sesión.
- **PASS** — Analytics y componentes públicos excluidos de `/admin/login`.
- **PASS** — Redirects: validación de rutas, códigos 301/302/307/308, sin cadenas ni bucles, mediante SQL.
- **PENDIENTE** — Prueba HTTP con un redirect publicado real; la tabla tiene 0 registros.
- **PASS** — Sitemap HTTP 200, 103 URLs y ninguna ruta privada `/admin`; filtros noindex/canonical probados.
- **PASS** — La clave privada no está en `NEXT_PUBLIC_*` y `.env.local` está ignorado/no registrado por Git.
- **PASS** — Lint: 0 errores, 9 avisos anteriores de `<img>`.
- **PASS** — Build de Next 16.4.0, 114 páginas estáticas y comprobación TypeScript.
- **PASS** — 73/73 tests CMS y 178/178 de la suite completa. Los 11 fallos de instituciones eran un fixture que omitía el dato existente `national_validity`; corregido sin cambiar datos públicos.
- **PASS** — SQL: 40 Auth + 24 editorial visual + 21 Home + 131 extendido/media + 271 final = 487 checks con rollback. 106 documentos y 119 versiones/auditorías persistentes permanecieron intactos.
- **PASS** — Responsive: 35 vistas del CMS aislado a 1440/1280/1024/768/390 y 21 vistas públicas a 1440/768/390, sin errores JS ni overflow y con paridad exacta del contenido público.
- **PASS** — Se mantuvieron fuera de esta etapa rediseño, leads, legal, commit, push y deploy.

## Revisión legal y configuración de lanzamiento

- **PENDIENTE** — Aprobación profesional de términos, privacidad, cookies y consentimientos del sitio público. `docs/legal/LEGAL-LAUNCH-CHECKLIST.md` sigue en BORRADOR/NO APROBADO; no se modificó aquí.
- **PENDIENTE** — Confirmar los destinatarios/retención de consultas y el consentimiento previo de Analytics antes de declarar listo el lanzamiento público. No se implementaron flujos legales ni de leads en esta aceptación.
- **NO APLICA** — Crear pantallas CMS de Cursos docentes, Contacto, Formularios o Legal en esta tarea. Se clasifican en `ADMIN-CMS-ACCEPTANCE.md` y no se implementan automáticamente.

## Estado

CMS funcional: **81,8 % de cobertura (18/22 módulos)**; uso local por el equipo: **NO**; producción: **NO**. Ver `ADMIN-CMS-ACCEPTANCE.md` para la clasificación de fallos, módulos y casos A–F.
