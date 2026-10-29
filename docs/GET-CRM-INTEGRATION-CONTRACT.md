# Contrato pendiente: GET público → GET Instituciones

Estado: preparado en GET público; **no habilitar en producción** hasta validar mapeo, endpoint CRM y pruebas de entrega.

## Mapeo

`node next-app/scripts/check-crm-mapping.mjs <ruta-privada-del-json>` valida un JSON con esta estructura:

```json
{
  "venues": {"<id-sede-publica>": {"institutionId": "<uuid-crm>"}},
  "offerings": {"<id-oferta-territorial>": {"institutionId": "<uuid-crm>", "programId": "<uuid-crm>"}}
}
```

La fuente es el catálogo público versionado. No se infieren UUIDs por nombre. Cada oferta debe pertenecer al mismo tenant que su sede. El archivo con UUIDs aprobados debe permanecer fuera del repositorio y apuntarse con `GET_CRM_MAPPING_PATH`. Las 125 sedes y 198 ofertas siguen pendientes de vinculación hasta contrastarlas con datos reales del CRM; eso incluye detectar sedes ambiguas de una misma marca. No incluir instituciones de QA en el catálogo público.

## Recepción requerida en GET Instituciones

Implementar un endpoint HTTPS privado `POST` que admita `Authorization: Bearer <secreto compartido>`; el secreto nunca pasa al navegador. Solicitud JSON desde el servidor público:

```json
{
  "institutionId": "<uuid-crm>", "programId": "<uuid-crm-o-null>",
  "publicInstitutionId": "<id-sede-publica>", "publicOfferingId": "<id-oferta-o-null>",
  "name": "<nombre>", "phone": "<teléfono>", "email": "<email>",
  "query": "<texto>", "origin": "website", "receivedAt": "<ISO-8601>",
  "idempotencyKey": "<uuid-de-solicitud>"
}
```

Respuesta de aceptación real: HTTP 201 con `{"accepted":true,"receiptId":"<id>"}`. El CRM debe verificar secreto en tiempo constante, validar UUIDs/tenant, estado habilitado de institución y programa, limitar tasa, deduplicar atómicamente por `idempotencyKey`, y persistir lead + inquiry en una transacción. El cliente no puede fijar `management_scope`; el CRM lo decide según sus políticas. Para consulta general por institución, `programId` es `null`: definir ese modelo en el CRM sin inventar un programa. Errores no deben devolver datos personales.

Netlify requerirá `GET_CRM_MAPPING_PATH`, `GET_CRM_INGEST_URL` y `GET_CRM_INGEST_SECRET` **solo en servidor**, además de verificar la fuente efectiva `PUBLIC_CATALOG_SOURCE`. No usar `NEXT_PUBLIC_*` para secretos. No desplegar hasta que el archivo privado esté disponible en el runtime de Netlify y el endpoint CRM pase pruebas de extremo a extremo.

`/contacto` es un mensaje comercial general, no un lead académico. Dejarlo separado; el CRM central necesita un contrato propio para mensajes sin institución/programa. El formulario actual de esa ruta no se modificó.
