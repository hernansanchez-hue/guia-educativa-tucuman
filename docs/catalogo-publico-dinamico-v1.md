# Catálogo público dinámico v1

Las cuatro rutas dinámicas públicas (ciudad, institución, carrera y capacitación) antes fijaban `dynamicParams=false`. Se conserva `generateStaticParams` para prerenderizar el catálogo canónico actual, pero se elimina ese bloqueo: parámetros válidos nuevos pueden generarse bajo demanda y los inválidos siguen resolviendo mediante datos y `notFound()`.

Las lecturas REST públicas de Supabase usan ahora `next: { revalidate: 60 }`: ISR compartido, SEO server-side y cambios visibles aproximadamente en un minuto sin redeploy. El futuro admin podrá agregar revalidación inmediata mediante tags o `revalidatePath`; no se implementa aquí.

Una nueva ciudad, institución, carrera u oferta training válida no requiere código ni redeploy; necesita sólo el TTL de hasta 60 segundos. Las listas de `generateStaticParams` ya no son allowlists de runtime. No se modificaron componentes, CSS, Vite ni Supabase remoto.
