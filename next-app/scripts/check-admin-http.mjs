// Checks the actual running Next server, without a fabricated login or any writes.
const origin = process.env.GET_ADMIN_TEST_ORIGIN || "http://localhost:4004";
const checks = [];
for (const route of ["/admin/diseno","/admin/configuracion","/admin/usuarios","/admin/historial","/admin/seo","/admin/seo/redirects","/admin/buscar","/admin/api/media/sign","/admin/api/media/complete","/admin", "/admin/eventos", "/admin/servicios", "/admin/capacitaciones", "/admin/nosotros", "/admin/orientacion-vocacional", "/admin/banners", "/admin/multimedia", "/admin/menus", "/admin/footer", "/admin/api/media", "/admin/vista-previa/modulos/private", "/admin/preview/private", "/admin/users", "/admin/ciudades", "/admin/instituciones", "/admin/carreras", "/admin/vista-previa/nuevo?tipo=ciudades", "/admin/vista-previa/private", "/admin/media/private.png"]) {
  const response = await fetch(`${origin}${route}`, { redirect: "manual" });
  if (![303, 307, 308].includes(response.status) || new URL(response.headers.get("location"), origin).pathname !== "/admin/login") throw new Error(`Anonymous guard failed: ${route}`);
  if (!response.headers.get("cache-control")?.includes("no-store") || !response.headers.get("x-robots-tag")?.includes("noindex")) throw new Error("Private headers missing.");
  checks.push(`${route}: login redirect`);
}
const login = await fetch(`${origin}/admin/login`);
const html = await login.text();
if (login.status !== 200 || !html.includes('name="email"') || !html.includes('name="password"') || !html.includes("noindex")) throw new Error("Login form/noindex missing.");
if (html.includes('id="siteFooter"') || html.includes('class="public-site-background"') || html.includes("googletagmanager.com/gtag/js")) throw new Error("Public presentation or Analytics reached admin.");
const recovery = await fetch(`${origin}/admin/recuperar`);
if (recovery.status !== 200) throw new Error("Recovery page unavailable.");
const reset = await fetch(`${origin}/admin/restablecer`, { redirect: "manual" });
if (![303, 307, 308].includes(reset.status) || new URL(reset.headers.get("location"), origin).pathname !== "/admin/recuperar") throw new Error("Anonymous password reset allowed.");
for (const route of ["/", "/concepcion", "/monteros", "/aguilares", "/concepcion/universidad-siglo-21", "/concepcion/universidad-siglo-21/carreras/abogacia", "/carreras", "/instituciones"]) {
  const response = await fetch(`${origin}${route}`); const page = await response.text();
  if (response.status !== 200) throw new Error(`Public regression: ${route}`);
  if (route === "/" && !page.includes("<video")) throw new Error("Home video missing.");
  checks.push(`${route}: 200`);
}
const sitemap = await (await fetch(`${origin}/sitemap.xml`)).text();
if (/<loc>[^<]*\/admin(?:\/|<)/.test(sitemap)) throw new Error("Admin exposed in sitemap.");
console.log(JSON.stringify({ checks, login: "functional form, noindex, no public background/footer/GA", recovery: "available", anonymousReset: "denied", sitemap: "admin excluded" }));
