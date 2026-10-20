import { getTrainingPageCatalog,resolveEditorialMissing,editorialMetadata } from "../../../../../lib/admin/published-editorial";
import TrainingPageClient from "./TrainingPageClient";
import "../../../ciudad.css";
import "../../institucion.css";
import "../../carreras/[carrera]/carrera.css";

export const revalidate = 60;

export function generateStaticParams() {
  return [
    { ciudad: "monteros", institucion: "centro-de-formacion-tucuman", capacitacion: "auxiliar-administrativo" },
    { ciudad: "monteros", institucion: "centro-de-formacion-tucuman", capacitacion: "secretariado" },
    { ciudad: "monteros", institucion: "centro-de-formacion-tucuman", capacitacion: "operador-de-pc" },
  ];
}

export async function generateMetadata({ params }) {
  const { ciudad, institucion, capacitacion } = await params;
  const page = await getTrainingPageCatalog(ciudad, institucion, capacitacion);

  if (!page) await resolveEditorialMissing(`/${ciudad}/${institucion}/capacitaciones/${capacitacion}`);

  const { city, institution, program, offering } = page;
  return editorialMetadata({
    title: `${program.name} en ${institution.name}, ${city.name}`,
    description: program.description,
    path: `/${city.slug}/${institution.slug}/capacitaciones/${program.slug}`,
    image: offering.image,
  },page);
}

export default async function TrainingPage({ params }) {
  const { ciudad, institucion, capacitacion } = await params;
  const page = await getTrainingPageCatalog(ciudad, institucion, capacitacion);
  if (!page) await resolveEditorialMissing(`/${ciudad}/${institucion}/capacitaciones/${capacitacion}`);
  return <TrainingPageClient {...page} />;
}
