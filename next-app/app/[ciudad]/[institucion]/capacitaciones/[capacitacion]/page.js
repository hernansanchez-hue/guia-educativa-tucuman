import { notFound } from "next/navigation";
import { getTrainingPageCatalog } from "../../../../../lib/public-catalog/training-page-catalog";
import { createPublicMetadata } from "../../../../../lib/seo/public-metadata";
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

  if (!page) notFound();

  const { city, institution, program, offering } = page;
  return createPublicMetadata({
    title: `${program.name} en ${institution.name}, ${city.name}`,
    description: program.description,
    path: `/${city.slug}/${institution.slug}/capacitaciones/${program.slug}`,
    image: offering.image,
  });
}

export default async function TrainingPage({ params }) {
  const { ciudad, institucion, capacitacion } = await params;
  const page = await getTrainingPageCatalog(ciudad, institucion, capacitacion);
  if (!page) notFound();
  return <TrainingPageClient {...page} />;
}
