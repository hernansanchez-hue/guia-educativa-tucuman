# Configuración y primer SUPERADMIN
13/10/2026. get-definitivo(zomoblpgurchkxvkkutj). http://localhost:4004/admin/login.

## Privado
SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY existentes; aliases anteriores compatibles. GET_ADMIN_ORIGIN origenexacto, local http://localhost:4004. Nunca secret/servicekey enNEXT_PUBLIC, código/docs/screenshots/chat.
Email/nombre previstos en .env.local ignorado: hernan@guiaeducativatuc.com.ar / César Hernán Sánchez. Falta SUPABASE_SECRET_KEY (o service_role legacy). No se recuperó con herramientas remotas ni se creó password/cuenta ficticia.

## Activación segura
1. Agregar claveprivada directamente al entorno local ignorado, no porchat.
2. Verificar redirectsAuth /admin/callback y /admin/confirmar exactos; SMTP/entrega/límites.
3. Plantillas SSR invitación: {{ .RedirectTo }}?token_hash={{ .TokenHash }}&type=invite. Recuperación:type=recovery. Callback acepta PKCEcode, nofragmentimplicit.
4. En next-app: npm run admin:bootstrap -- invite.
5. Persona confirma email y elige contraseña propia≥12caracteres.
6. npm run admin:bootstrap -- promote (identidad exacta/idempotente/protegida).
7. Login/logout/recovery y matriz real del informe.
8. Usuarios invita ADMIN/EDITOR, asignación DBSUPERADMIN, acceso soloemailconfirmado; roles/estado conconfirmación/audit/últimoSAprotegido.
Claveprivada noCRUD editorial; mantener soloenserver siusaráninvitaciones.

## Pruebas
npm run lint / npm run build / node --test tests/admin*.test.mjs / node --test tests/*.test.mjs.
node scripts/check-admin-http.mjs.
SQL cms_* conROLLBACK; noejecutarfixturesbootstrap sobrecuentasreales sinbaseaislada.
NODE_ENV=test node scripts/admin-visual-harness.mjs puerto4015, GET_VISUAL_OUTPUT/Playwright. Test-only/sinDB; cerrar después. Dev4004 queda disponible.

## Media
sign/PUT/complete: Storageprivado directo, verifica bytes antes deregistro, sinbody50MBNetlify.
Imágenes≤5MB, MP4/PDF/DOCX/TXT≤50MB. URLfirmada2h paraUUIDnuevosinupsert, noAuthJWT/secret.
Interrumpidos/invalidos pueden dejarhuérfanoprivado noregistrado: revisiónmanual, nocleanupdestructivo.
Probar uploadreal y capacidadmemoria/timeout de verificación enhosting autorizado antes deproducción.

## Despliegue
Sietemigracionesfinales aditivas/timestampsalineados; cincohistóricas públicas desfaseprevio, nodbpush/reset/reseedciego.
NO gitadd/commit/push/Netlify. Antes de exposición, verificar variablesproducción/origen, Authredirects/SMTP, Storage/backups y aceptaciónhumanareal. No se modificó configuración del sitio remoto.
