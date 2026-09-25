export const trainingOfferings = [
  {
    id: "centro-de-formacion-tucuman-monteros-auxiliar-administrativo",
    institutionId: "centro-de-formacion-tucuman-monteros",
    citySlug: "monteros",
    trainingProgramId: "auxiliar-administrativo",
    modality: "Presencial",
    duration: "3 años",
    certification: "Auxiliar Administrativo",
    campus: "Rivadavia 295, Monteros",
    shifts: "Consultar",
    nationalValidity: "Sí",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    badge: "Inscripciones abiertas",
    formEnabled: true,
    visible: true,
    order: 1,
    publicationStatus: "published",
  },
  {
    id: "centro-de-formacion-tucuman-monteros-secretariado",
    institutionId: "centro-de-formacion-tucuman-monteros",
    citySlug: "monteros",
    trainingProgramId: "secretariado",
    modality: "Presencial",
    duration: "3 años",
    certification: "Secretariado",
    campus: "Rivadavia 295, Monteros",
    shifts: "Consultar",
    nationalValidity: "Sí",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80",
    badge: "Nueva carrera",
    formEnabled: true,
    visible: true,
    order: 2,
    publicationStatus: "published",
  },
  {
    id: "centro-de-formacion-tucuman-monteros-operador-de-pc",
    institutionId: "centro-de-formacion-tucuman-monteros",
    citySlug: "monteros",
    trainingProgramId: "operador-de-pc",
    modality: "Presencial",
    duration: "3 años",
    certification: "Operador de PC",
    campus: "Rivadavia 295, Monteros",
    shifts: "Consultar",
    nationalValidity: "Sí",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    badge: "Próximo ingreso",
    formEnabled: true,
    visible: true,
    order: 3,
    publicationStatus: "published",
  },
];

export function getTrainingOffering({ citySlug, institutionId, trainingProgramId }) {
  return trainingOfferings.find((offering) =>
    offering.citySlug === citySlug &&
    offering.institutionId === institutionId &&
    offering.trainingProgramId === trainingProgramId &&
    offering.visible &&
    offering.publicationStatus === "published"
  ) || null;
}
