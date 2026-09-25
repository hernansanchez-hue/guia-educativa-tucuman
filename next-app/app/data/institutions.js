const imageBank = {
  classroom:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  students:
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
  lab:
    "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
  fair:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  video:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  design:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  graduation:
    "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80",
  santa:
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  siglo:
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  ies:
    "https://images.unsplash.com/photo-1568792923760-d70635a89fdc?auto=format&fit=crop&w=1200&q=80",
};

export const institutions = [
  {
    id: "universidad-siglo-21-concepcion",
    citySlug: "concepcion",
    slug: "universidad-siglo-21",
    name: "Universidad Siglo 21",
    logo: "US21",
    type: "Privada",
    cities: ["Concepción", "Monteros", "Aguilares"],
    plan: "Premium",
    slogan: "Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.",
    description: "Educación innovadora, profesional y conectada con el mundo.",
    address: "San Martín 124, Concepción",
    whatsapp: "3865 41 2020",
    image: imageBank.siglo,
    media: "Video institucional",
    gallery: [
      imageBank.siglo,
      imageBank.students,
      imageBank.classroom,
      imageBank.graduation,
    ],
    careers: [
      {
        id: "abogacia",
        slug: "abogacia",
        name: "Abogacía",
        description:
          "Formación jurídica con modalidad flexible y acompañamiento tutorial.",
        image: imageBank.classroom,
        badge: "Inscripciones abiertas",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "contador-publico",
        slug: "contador-publico",
        name: "Contador Público",
        description:
          "Herramientas contables, impositivas y financieras para empresas.",
        image: imageBank.students,
        badge: "Nueva carrera",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "licenciatura-en-administracion",
        slug: "licenciatura-en-administracion",
        name: "Lic. en Administración",
        description:
          "Gestión, liderazgo y estrategia para organizaciones actuales.",
        image: imageBank.design,
        badge: "Próximo ingreso",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "higiene-y-seguridad",
        slug: "higiene-y-seguridad",
        name: "Higiene y Seguridad",
        description:
          "Prevención, normativa y seguridad aplicada al trabajo.",
        image: imageBank.lab,
        badge: "Inscripciones abiertas",
        duration: "3 años",
        modality: "Presencial",
      },
    ],
  },
  {
    id: "universidad-siglo-21-monteros",
    citySlug: "monteros",
    slug: "universidad-siglo-21",
    name: "Universidad Siglo 21",
    logo: "US21",
    type: "Privada",
    cities: ["Concepción", "Monteros", "Aguilares"],
    plan: "Premium",
    slogan: "Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.",
    description: "Educación innovadora, profesional y conectada con el mundo.",
    address: "San Martín 124, Concepción",
    whatsapp: "3865 41 2020",
    image: imageBank.siglo,
    media: "Video institucional",
    gallery: [
      imageBank.siglo,
      imageBank.students,
      imageBank.classroom,
      imageBank.graduation,
    ],
    careers: [
      {
        id: "abogacia",
        slug: "abogacia",
        name: "Abogacía",
        description:
          "Formación jurídica con modalidad flexible y acompañamiento tutorial.",
        image: imageBank.classroom,
        badge: "Inscripciones abiertas",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "contador-publico",
        slug: "contador-publico",
        name: "Contador Público",
        description:
          "Herramientas contables, impositivas y financieras para empresas.",
        image: imageBank.students,
        badge: "Nueva carrera",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "licenciatura-en-administracion",
        slug: "licenciatura-en-administracion",
        name: "Lic. en Administración",
        description:
          "Gestión, liderazgo y estrategia para organizaciones actuales.",
        image: imageBank.design,
        badge: "Próximo ingreso",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "higiene-y-seguridad",
        slug: "higiene-y-seguridad",
        name: "Higiene y Seguridad",
        description:
          "Prevención, normativa y seguridad aplicada al trabajo.",
        image: imageBank.lab,
        badge: "Inscripciones abiertas",
        duration: "3 años",
        modality: "Presencial",
      },
    ],
  },
  {
    id: "instituto-santa-barbara-concepcion",
    citySlug: "concepcion",
    slug: "instituto-santa-barbara",
    name: "Instituto Santa Bárbara",
    logo: "ISB",
    type: "Terciario Privado",
    cities: ["Concepción", "Aguilares"],
    plan: "Premium",
    slogan: "Formación técnica para integrarte rápido al mundo laboral.",
    description: "Formación terciaria con valores, prácticas y salida laboral.",
    address: "Belgrano 810, Aguilares",
    whatsapp: "3865 55 1188",
    image: imageBank.santa,
    media: "Video institucional",
    canonicalDataNotice:
      "inconsistencia canónica conservada temporalmente para mantener fidelidad con la demo",
    gallery: [
      imageBank.santa,
      imageBank.students,
      imageBank.classroom,
      imageBank.graduation,
    ],
    careers: [
      {
        id: "instrumentacion-quirurgica",
        slug: "instrumentacion-quirurgica",
        name: "Instrumentación Quirúrgica",
        description:
          "Capacitación para asistir procedimientos en ámbitos de salud.",
        image: imageBank.lab,
        badge: "Inscripciones abiertas",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "laboratorio-de-analisis-clinicos",
        slug: "laboratorio-de-analisis-clinicos",
        name: "Laboratorio de Análisis Clínicos",
        description:
          "Técnicas de laboratorio, muestras y protocolos de calidad.",
        image: imageBank.classroom,
        badge: "Nueva carrera",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "diagnostico-por-imagenes",
        slug: "diagnostico-por-imagenes",
        name: "Diagnóstico por Imágenes",
        description:
          "Formación en tecnología aplicada a estudios médicos.",
        image: imageBank.students,
        badge: "Próximo ingreso",
        duration: "3 años",
        modality: "Presencial",
      },
    ],
  },
  {
    id: "universidad-siglo-21-aguilares",
    citySlug: "aguilares",
    slug: "universidad-siglo-21",
    name: "Universidad Siglo 21",
    logo: "US21",
    type: "Privada",
    cities: ["Concepción", "Monteros", "Aguilares"],
    plan: "Premium",
    slogan: "Estudiá con flexibilidad y proyectá tu carrera desde Tucumán.",
    description: "Educación innovadora, profesional y conectada con el mundo.",
    address: "San Martín 124, Concepción",
    whatsapp: "3865 41 2020",
    image: imageBank.siglo,
    media: "Video institucional",
    gallery: [imageBank.siglo, imageBank.students, imageBank.classroom, imageBank.graduation],
    careers: [
      { id: "abogacia", slug: "abogacia", name: "Abogacía", description: "Formación jurídica con modalidad flexible y acompañamiento tutorial.", image: imageBank.classroom, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
      { id: "contador-publico", slug: "contador-publico", name: "Contador Público", description: "Herramientas contables, impositivas y financieras para empresas.", image: imageBank.students, badge: "Nueva carrera", duration: "3 años", modality: "Presencial" },
      { id: "licenciatura-en-administracion", slug: "licenciatura-en-administracion", name: "Lic. en Administración", description: "Gestión, liderazgo y estrategia para organizaciones actuales.", image: imageBank.design, badge: "Próximo ingreso", duration: "3 años", modality: "Presencial" },
      { id: "higiene-y-seguridad", slug: "higiene-y-seguridad", name: "Higiene y Seguridad", description: "Prevención, normativa y seguridad aplicada al trabajo.", image: imageBank.lab, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
    ],
  },
  {
    id: "instituto-santa-barbara-aguilares",
    citySlug: "aguilares",
    slug: "instituto-santa-barbara",
    name: "Instituto Santa Bárbara",
    logo: "ISB",
    type: "Terciario Privado",
    cities: ["Concepción", "Aguilares"],
    plan: "Premium",
    slogan: "Formación técnica para integrarte rápido al mundo laboral.",
    description: "Formación terciaria con valores, prácticas y salida laboral.",
    address: "Belgrano 810, Aguilares",
    whatsapp: "3865 55 1188",
    image: imageBank.santa,
    media: "Video institucional",
    gallery: [imageBank.santa, imageBank.students, imageBank.classroom, imageBank.graduation],
    careers: [
      { id: "instrumentacion-quirurgica", slug: "instrumentacion-quirurgica", name: "Instrumentación Quirúrgica", description: "Capacitación para asistir procedimientos en ámbitos de salud.", image: imageBank.lab, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
      { id: "laboratorio-de-analisis-clinicos", slug: "laboratorio-de-analisis-clinicos", name: "Laboratorio de Análisis Clínicos", description: "Técnicas de laboratorio, muestras y protocolos de calidad.", image: imageBank.classroom, badge: "Nueva carrera", duration: "3 años", modality: "Presencial" },
      { id: "diagnostico-por-imagenes", slug: "diagnostico-por-imagenes", name: "Diagnóstico por Imágenes", description: "Formación en tecnología aplicada a estudios médicos.", image: imageBank.students, badge: "Próximo ingreso", duration: "3 años", modality: "Presencial" },
    ],
  },
  {
    id: "academia-profesional-norte-aguilares",
    citySlug: "aguilares",
    slug: "academia-profesional-norte",
    name: "Academia Profesional Norte",
    logo: "APN",
    type: "Academia",
    cities: ["Aguilares"],
    plan: "Básico",
    slogan: "Capacitaciones digitales para empezar a trabajar.",
    description: "Cursos prácticos de diseño, redes sociales, ventas y herramientas digitales.",
    address: "Moreno 575, Aguilares",
    whatsapp: "3865 60 7711",
    image: imageBank.design,
    media: "Video de alumnos",
    gallery: [imageBank.design, imageBank.students, imageBank.classroom, imageBank.graduation],
    careers: [
      { id: "diseno-grafico", slug: "diseno-grafico", name: "Diseño Gráfico", description: "Piezas visuales, identidad y herramientas de diseño.", image: imageBank.design, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
      { id: "community-manager", slug: "community-manager", name: "Community Manager", description: "Planificación de contenido, redes y métricas.", image: imageBank.video, badge: "Nueva carrera", duration: "3 años", modality: "Presencial" },
      { id: "ventas-digitales", slug: "ventas-digitales", name: "Ventas Digitales", description: "Embudo comercial, atención online y cierre de ventas.", image: imageBank.fair, badge: "Próximo ingreso", duration: "3 años", modality: "Presencial" },
    ],
  },
  {
    id: "instituto-del-sur-monteros",
    citySlug: "monteros",
    slug: "instituto-del-sur",
    name: "Instituto del Sur",
    logo: "IDS",
    type: "Terciario",
    cities: ["Monteros"],
    plan: "Profesional",
    slogan: "Tecnicaturas orientadas a una salida laboral concreta.",
    description:
      "Formación técnica y profesional en áreas comerciales, administrativas y digitales.",
    address: "Av. Mitre 420, Concepción",
    whatsapp: "3865 44 8712",
    image: imageBank.students,
    media: "Video de carreras",
    gallery: [imageBank.students, imageBank.students, imageBank.classroom, imageBank.graduation],
    careers: [
      { id: "marketing", slug: "marketing", name: "Marketing", description: "Planificación comercial, comunicación y campañas digitales.", image: imageBank.design, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
      { id: "recursos-humanos", slug: "recursos-humanos", name: "Recursos Humanos", description: "Selección, capacitación y gestión de equipos.", image: imageBank.fair, badge: "Nueva carrera", duration: "3 años", modality: "Presencial" },
      { id: "administracion-de-empresas", slug: "administracion-de-empresas", name: "Administración de Empresas", description: "Organización, procesos y gestión operativa.", image: imageBank.classroom, badge: "Próximo ingreso", duration: "3 años", modality: "Presencial" },
    ],
  },
  {
    id: "centro-de-formacion-tucuman-monteros",
    citySlug: "monteros",
    slug: "centro-de-formacion-tucuman",
    name: "Centro de Formación Tucumán",
    logo: "CFT",
    type: "Capacitación",
    cities: ["Monteros"],
    plan: "Básico",
    slogan: "Cursos cortos para fortalecer tu perfil laboral.",
    description: "Capacitaciones prácticas para jóvenes y adultos que buscan ampliar oportunidades.",
    address: "Rivadavia 295, Monteros",
    whatsapp: "3863 40 2100",
    image: imageBank.fair,
    media: "Imagen superior",
    gallery: [imageBank.fair, imageBank.students, imageBank.classroom, imageBank.graduation],
    careers: [
      { id: "auxiliar-administrativo", slug: "auxiliar-administrativo", name: "Auxiliar Administrativo", description: "Tareas de oficina, atención y documentación comercial.", image: imageBank.classroom, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
      { id: "secretariado", slug: "secretariado", name: "Secretariado", description: "Organización, comunicación y soporte administrativo.", image: imageBank.students, badge: "Nueva carrera", duration: "3 años", modality: "Presencial" },
      { id: "operador-de-pc", slug: "operador-de-pc", name: "Operador de PC", description: "Herramientas digitales esenciales para el trabajo.", image: imageBank.design, badge: "Próximo ingreso", duration: "3 años", modality: "Presencial" },
    ],
  },
  {
    id: "instituto-san-miguel-monteros",
    citySlug: "monteros",
    slug: "instituto-san-miguel",
    name: "Instituto San Miguel",
    logo: "ISM",
    type: "Instituto",
    cities: ["Monteros"],
    plan: "Profesional",
    slogan: "Educación cercana para acompañar vocaciones de servicio.",
    description: "Propuestas presenciales y a distancia vinculadas a educación, salud y comunidad.",
    address: "Laprida 660, Monteros",
    whatsapp: "3863 47 6400",
    image: imageBank.classroom,
    media: "Imagen superior",
    gallery: [imageBank.classroom, imageBank.students, imageBank.classroom, imageBank.graduation],
    careers: [
      { id: "profesorado", slug: "profesorado", name: "Profesorado", description: "Formación pedagógica con prácticas y acompañamiento.", image: imageBank.classroom, badge: "Inscripciones abiertas", duration: "3 años", modality: "Presencial" },
      { id: "gestion-educativa", slug: "gestion-educativa", name: "Gestión Educativa", description: "Herramientas para coordinar proyectos institucionales.", image: imageBank.students, badge: "Nueva carrera", duration: "3 años", modality: "Presencial" },
      { id: "acompanante-terapeutico", slug: "acompanante-terapeutico", name: "Acompañante Terapéutico", description: "Intervención, apoyo y seguimiento en contextos de cuidado.", image: imageBank.lab, badge: "Próximo ingreso", duration: "3 años", modality: "Presencial" },
    ],
  },
  {
    id: "ies-concepcion-concepcion",
    citySlug: "concepcion",
    slug: "ies-concepcion",
    name: "IES Concepción",
    logo: "IES",
    type: "Público",
    cities: ["Concepción"],
    plan: "Básico",
    slogan: "Educación pública, gratuita y de calidad para todos.",
    description: "Educación pública, gratuita y de calidad para todos.",
    address: "España 320, Concepción",
    whatsapp: "3865 50 3300",
    image: imageBank.ies,
    media: "Imagen superior",
    gallery: [
      imageBank.ies,
      imageBank.students,
      imageBank.classroom,
      imageBank.graduation,
    ],
    careers: [
      {
        id: "profesorado-educacion-primaria",
        slug: "profesorado-educacion-primaria",
        name: "Profesorado de Educación Primaria",
        description: "Formación docente para nivel primario.",
        image: imageBank.classroom,
        badge: "Inscripciones abiertas",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "tecnicatura-administracion",
        slug: "tecnicatura-administracion",
        name: "Tecnicatura en Administración",
        description:
          "Gestión administrativa para organizaciones públicas y privadas.",
        image: imageBank.students,
        badge: "Nueva carrera",
        duration: "3 años",
        modality: "Presencial",
      },
      {
        id: "profesorado-ingles",
        slug: "profesorado-ingles",
        name: "Profesorado de Inglés",
        description: "Formación pedagógica y práctica del idioma.",
        image: imageBank.fair,
        badge: "Próximo ingreso",
        duration: "3 años",
        modality: "Presencial",
      },
    ],
  },
];

export const cityPages = {
  concepcion: {
    slug: "concepcion",
    name: "Concepción",
    title: "Instituciones de Concepción",
    institutionIds: [
      "universidad-siglo-21-concepcion",
      "instituto-santa-barbara-concepcion",
      "ies-concepcion-concepcion",
    ],
    featuredInstitutionIds: [
      "universidad-siglo-21-concepcion",
      "instituto-santa-barbara-concepcion",
      "instituto-del-sur-monteros",
    ],
    canonicalDataNotice:
      "inconsistencia canónica conservada temporalmente para mantener fidelidad visual",
  },
  monteros: {
    slug: "monteros",
    name: "Monteros",
    title: "Instituciones de Monteros",
    institutionIds: ["universidad-siglo-21-monteros", "instituto-del-sur-monteros", "centro-de-formacion-tucuman-monteros", "instituto-san-miguel-monteros"],
    featuredInstitutionIds: ["universidad-siglo-21-monteros", "instituto-santa-barbara-concepcion", "instituto-del-sur-monteros"],
  },
  aguilares: {
    slug: "aguilares",
    name: "Aguilares",
    title: "Instituciones de Aguilares",
    institutionIds: [
      "universidad-siglo-21-aguilares",
      "instituto-santa-barbara-aguilares",
      "academia-profesional-norte-aguilares",
    ],
    featuredInstitutionIds: [
      "universidad-siglo-21-aguilares",
      "instituto-santa-barbara-aguilares",
      "instituto-del-sur-monteros",
    ],
    canonicalDataNotice:
      "slider/fallback canónico preservado: incluye Instituto del Sur de Monteros",
  },
};

export function getCityPage(slug) {
  const city = cityPages[slug];
  if (!city) return null;

  const institutionById = new Map(
    institutions.map((institution) => [institution.id, institution]),
  );

  return {
    ...city,
    institutions: city.institutionIds.map((id) => institutionById.get(id)),
    featuredInstitutions: city.featuredInstitutionIds.map((id) =>
      institutionById.get(id),
    ),
  };
}

export function getInstitutionPage(citySlug, institutionSlug) {
  const city = cityPages[citySlug];
  const institution = institutions.find(
    (item) => item.citySlug === citySlug && item.slug === institutionSlug,
  );

  if (!city || !institution || !city.institutionIds.includes(institution.id)) {
    return null;
  }

  return {
    city: { slug: city.slug, name: city.name },
    institution,
  };
}
