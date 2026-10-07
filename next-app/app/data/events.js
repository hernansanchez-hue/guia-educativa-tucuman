const placeholderImages = {
  deportivo: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1500&q=82",
  municipal: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1500&q=82",
  cultural: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1500&q=82",
  educativo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1500&q=82",
  social: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1500&q=82",
  feria: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1500&q=82",
  comunitario: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1500&q=82",
};

// Eventos demostrativos: reemplazar estos datos por fechas y contenidos confirmados.
export const events = [
  { id: "event-01", slug: "encuentro-deportivo-concepcion", name: "Encuentro deportivo", city: "Concepción", category: "Deportivo", date: "Fecha a confirmar", status: "Próximamente", description: "Una jornada para acercar orientación e información a quienes comparten el deporte.", image: placeholderImages.deportivo, gallery: [placeholderImages.deportivo, placeholderImages.social, placeholderImages.comunitario], location: "Ubicación a confirmar", institutions: [] },
  { id: "event-02", slug: "feria-municipal-monteros", name: "Feria municipal", city: "Monteros", category: "Municipal", date: "Fecha a confirmar", status: "Próximamente", description: "Un espacio abierto para conectar propuestas educativas con la comunidad local.", image: placeholderImages.municipal, gallery: [placeholderImages.municipal, placeholderImages.feria, placeholderImages.social], location: "Ubicación a confirmar", institutions: [] },
  { id: "event-03", slug: "festival-cultural-aguilares", name: "Festival cultural", city: "Aguilares", category: "Cultural", date: "Fecha a confirmar", status: "Próximamente", description: "Cultura, comunidad y oportunidades reunidas en una experiencia cercana.", image: placeholderImages.cultural, gallery: [placeholderImages.cultural, placeholderImages.comunitario, placeholderImages.social], location: "Ubicación a confirmar", institutions: [] },
  { id: "event-04", slug: "expo-educativa-concepcion", name: "Expo educativa", city: "Concepción", category: "Educativo", date: "Fecha a confirmar", status: "Próximamente", description: "Un punto de encuentro para descubrir carreras, instituciones y próximos pasos.", image: placeholderImages.educativo, gallery: [placeholderImages.educativo, placeholderImages.comunitario, placeholderImages.feria], location: "Ubicación a confirmar", institutions: [] },
  { id: "event-05", slug: "jornada-juvenil-monteros", name: "Jornada juvenil", city: "Monteros", category: "Social", date: "Fecha a confirmar", description: "Una propuesta pensada para conversar, participar y proyectar el futuro.", image: placeholderImages.social, gallery: [placeholderImages.social, placeholderImages.deportivo, placeholderImages.educativo], location: "Ubicación a confirmar", institutions: [] },
  { id: "event-06", slug: "feria-de-emprendedores-aguilares", name: "Feria de emprendedores", city: "Aguilares", category: "Feria", date: "Fecha a confirmar", status: "Próximamente", description: "Ideas, oficios y formación presentes en una jornada para toda la ciudad.", image: placeholderImages.feria, gallery: [placeholderImages.feria, placeholderImages.municipal, placeholderImages.comunitario], location: "Ubicación a confirmar", institutions: [] },
  { id: "event-07", slug: "encuentro-comunitario-concepcion", name: "Evento comunitario", city: "Concepción", category: "Comunitario", date: "Fecha a confirmar", description: "Un encuentro para que la información llegue a donde ya está la comunidad.", image: placeholderImages.comunitario, gallery: [placeholderImages.comunitario, placeholderImages.cultural, placeholderImages.educativo], location: "Ubicación a confirmar", institutions: [] },
];

export const eventCities = ["Todos", "Concepción", "Monteros", "Aguilares"];
export const eventCategories = ["Todos", "Deportivo", "Municipal", "Cultural", "Educativo", "Social", "Feria", "Comunitario"];
export const getEvent = (slug) => events.find((event) => event.slug === slug);
