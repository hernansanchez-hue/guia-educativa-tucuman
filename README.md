# Guía Educativa Tucumán

La aplicación pública está en `next-app/` y utiliza Next.js App Router. Este candidato de producción parte del historial del sitio Vite existente en Netlify, pero ya no construye la demo de la raíz.

## Desarrollo local

```bash
cd next-app
npm ci
npm run dev
```

## Publicación en Netlify

El `netlify.toml` de la raíz establece:

- Base directory: `next-app`
- Build command: `npm run build`
- Publish directory: `.next` (relativo a `next-app`)

Antes de publicar, configurar en el mismo sitio de Netlify y para el contexto de producción:

- `PUBLIC_CATALOG_SOURCE=supabase`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

No guardar las claves en Git ni usar una clave `service_role` en el catálogo público.
