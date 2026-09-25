export const trainingPrograms = [
  {
    id: "auxiliar-administrativo",
    slug: "auxiliar-administrativo",
    name: "Auxiliar Administrativo",
    description: "Tareas de oficina, atención y documentación comercial.",
    profile: "Profesional preparado para aplicar conocimientos y desarrollarse en su área.",
    workField: "Ámbitos públicos y privados relacionados con la formación profesional.",
    contents: ["Primer año", "Segundo año", "Tercer año"],
    requirements: ["DNI", "Título secundario", "Formulario de inscripción"],
    faq: [
      { question: "¿Cuándo comienzan las inscripciones?", answer: "Consultá con la institución para conocer las próximas fechas." },
      { question: "¿Cómo solicito más información?", answer: "Podés utilizar WhatsApp o el formulario de esta página." },
    ],
    status: "published",
  },
  {
    id: "secretariado",
    slug: "secretariado",
    name: "Secretariado",
    description: "Organización, comunicación y soporte administrativo.",
    profile: "Profesional preparado para aplicar conocimientos y desarrollarse en su área.",
    workField: "Ámbitos públicos y privados relacionados con la formación profesional.",
    contents: ["Primer año", "Segundo año", "Tercer año"],
    requirements: ["DNI", "Título secundario", "Formulario de inscripción"],
    faq: [
      { question: "¿Cuándo comienzan las inscripciones?", answer: "Consultá con la institución para conocer las próximas fechas." },
      { question: "¿Cómo solicito más información?", answer: "Podés utilizar WhatsApp o el formulario de esta página." },
    ],
    status: "published",
  },
  {
    id: "operador-de-pc",
    slug: "operador-de-pc",
    name: "Operador de PC",
    description: "Herramientas digitales esenciales para el trabajo.",
    profile: "Profesional preparado para aplicar conocimientos y desarrollarse en su área.",
    workField: "Ámbitos públicos y privados relacionados con la formación profesional.",
    contents: ["Primer año", "Segundo año", "Tercer año"],
    requirements: ["DNI", "Título secundario", "Formulario de inscripción"],
    faq: [
      { question: "¿Cuándo comienzan las inscripciones?", answer: "Consultá con la institución para conocer las próximas fechas." },
      { question: "¿Cómo solicito más información?", answer: "Podés utilizar WhatsApp o el formulario de esta página." },
    ],
    status: "published",
  },
];

export function getTrainingProgramBySlug(slug) {
  return trainingPrograms.find((program) => program.slug === slug) || null;
}
