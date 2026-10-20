/** CMS roadmap registry. Availability here does not enable a public route or editor. */
const definitions = [
  ["home", "Home", "pages", ["/"], ["app/components/HomeMapClient.js", "lib/public-catalog/home-map-catalog.js"]],
  ["cities", "Ciudades", "pages", ["/ciudades", "/[ciudad]"], ["app/data/institutions.js", "lib/public-catalog/city-page-catalog.js"]],
  ["institutions", "Instituciones", "pages", ["/instituciones", "/instituciones/[slug]", "/[ciudad]/[institucion]"], ["app/data/institutions.js", "lib/public-catalog/institution-page-catalog.js", "lib/public-catalog/institutions-catalog.js"]],
  ["careers", "Carreras", "pages", ["/carreras", "/carreras/[slug]", "/[ciudad]/[institucion]/carreras/[carrera]"], ["app/data/careers.js", "app/data/offerings.js", "lib/public-catalog/career-page-catalog.js"]],
  ["trainings", "Capacitaciones", "pages", ["/[ciudad]/[institucion]/capacitaciones/[capacitacion]"], ["app/data/trainingPrograms.js", "app/data/trainingOfferings.js", "lib/public-catalog/training-page-catalog.js"]],
  ["teacher-courses", "Cursos docentes", "pages", ["/cursos-docentes"], ["app/data/teacherCourses.js", "lib/public-catalog/teacher-courses-catalog.js"]],
  ["events", "Eventos", "pages", ["/eventos", "/eventos/[slug]"], ["app/data/events.js", "app/eventos/page.js"]],
  ["services", "Servicios", "pages", ["/servicios", "/servicios/[slug]", "/servicios/redes-sociales"], ["app/data/services.js", "app/components/ServiceHero.js", "app/servicios/redes-sociales/page.js"]],
  ["orientation", "Orientación Vocacional", "pages", [], ["app/[ciudad]/CityInstitutionSections.js"]],
  ["about", "Nosotros", "pages", ["/nosotros"], ["app/nosotros/page.js"]],
  ["contact", "Contacto comercial", "pages", ["/contacto"], ["app/contacto/page.js", "app/contacto/ContactForm.js"]],
  ["banners", "Banners", "content", [], ["app/components/ServiceHero.js", "app/[ciudad]/CityPageClient.js"]],
  ["media", "Multimedia", "content", [], ["public/assets"]],
  ["navigation", "Menús", "content", [], ["app/components/PublicHeader.js", "app/components/PublicFloatingHeader.js"]],
  ["footer", "Footer", "content", [], ["app/components/PublicFooter.js"]],
  ["design", "Diseño", "configuration", [], ["app/globals.css"]],
  ["seo", "SEO", "configuration", [], ["lib/seo/public-metadata.js", "app/sitemap.js", "app/robots.js"]],
  ["forms", "Formularios", "configuration", [], ["lib/public-leads.js", "app/contacto/ContactForm.js"]],
  ["legal", "Legal", "configuration", [], ["lib/legal-config.js"]],
  ["users", "Usuarios", "system", [], []],
  ["history", "Historial", "system", [], []],
  ["settings", "Configuración", "system", [], []],
];

export const ADMIN_BRANDING = Object.freeze({
  logo: "/assets/get-city-footer-logo.png",
  sourceComponent: "app/components/PublicFooter.js",
  name: "Administrador GET",
});

export const ADMIN_MODULES = Object.freeze(definitions.map(([id, label, group, routes, sources]) => Object.freeze({
  id, label, group,
  routes: Object.freeze(routes),
  sources: Object.freeze(sources),
  implementationStatus: ["forms","legal"].includes(id)?"review_pending":["teacher-courses","contact"].includes(id)?"legacy":"implemented",
  requiresLegalReview: ["forms", "legal"].includes(id),
})));

export function getAdminModule(id) {
  return ADMIN_MODULES.find((module) => module.id === id) ?? null;
}

export const PREVIEW_TARGETS = Object.freeze({
  institutions: Object.freeze({
    component: "app/[ciudad]/[institucion]/InstitutionPageClient.js",
    props: Object.freeze(["city", "institution"]),
    fieldGroups: Object.freeze(["general", "hero", "contact", "careers", "gallery", "seo"]),
  }),
  cities: Object.freeze({
    component: "app/[ciudad]/CityPageClient.js",
    props: Object.freeze(["city"]),
    fieldGroups: Object.freeze(["general", "hero", "orientation", "expo", "institutions", "seo"]),
  }),
});
