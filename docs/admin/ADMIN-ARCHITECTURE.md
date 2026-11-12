# Arquitectura actual del Administrador GET
13/10/2026. Desarrollo local, aceptación humana pendiente; informes anteriores conservados.

Next16.4.0 App Router + Supabase SSR0.12.7 / JS2.117.3. Proxy refresca cookies /admin; cada loader/action/handler vuelve a verificar getUser, email confirmado, sesión DB y perfil activo. Rol nunca desde user_metadata. DAL server-only; key privilegiada únicamente para bootstrap/invite, no CRUD editorial.

UI compartida: AdminShell, EntityEditor, EditorField, CollectionField, MediaPicker, LivePreview y FinalConsole. 18/22 módulos con pantalla. Sin identidad de test en Next. Harness aislado4015 NODE_ENV=test, sin DB.

editor-service compone dueño/shared, bundle/revision/snapshot/audit; final-service gestiona Diseño, Configuración, SEO, Usuarios, Historial, redirects y búsqueda; media-service biblioteca/upload. cms_private usa SECURITY DEFINER/search_path vacío; wrappers invoker con grants explícitos.

Lectores públicos configurados estrictos: no seed para documento ausente. Tombstones no resucitan. Baseline de presentación de10 sedes importada inmutable a data.presentation; restore viejo la conserva. Legacy sigue para offline/tests, mapa Home, Cursos docentes/Contacto y recetas de capacitación. No se borró.

Diseño/settings safe whitelist; defaults idénticos. Tokens opt-in solo internas, / y /admin excluidas; override local de título inline tiene prioridad. Global configuration bundle es atómico y exige SUPERADMIN. SEO marca/master separado de sede/oferta. Sitemap filtra noindex/canonical distinto; redirects locales sin cadenas y con códigos exactos via proxy, cache60s; / no consulta mapa.

Dashboard agrega una consulta; listados25, búsqueda20; Banners≤100 DTOs sin cargar todos los drafts; medios lazy. Preview real privado conserva iframe y postMessage validado.

Nuevo upload: sign servidor → PUT browser directo a Storage privado UUID sin upsert → validación server MIME/ext/peso/firma/Sharp → registro. Sin50MB pasando por Netlify. Firmas2h scoped-object, no secret. Huérfanos fallidos privados: revisión manual, no borrado automático.

No SUPERADMIN real: Auth/perfiles0, falta clave privada local. SQL/harness no sustituyen aceptación login/mail/upload/publish HTTP. Ver informe y checklist finales.
