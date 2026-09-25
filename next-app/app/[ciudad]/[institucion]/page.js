import { notFound } from "next/navigation";
import { getInstitutionPageCatalog } from "../../../lib/public-catalog/institution-page-catalog";
import { createPublicMetadata } from "../../../lib/seo/public-metadata";
import InstitutionPageClient from "./InstitutionPageClient";
import "../ciudad.css";
import "./institucion.css";

export const revalidate = 60;

export function generateStaticParams() {
  return [
    { ciudad: "concepcion", institucion: "universidad-siglo-21" },
    { ciudad: "concepcion", institucion: "instituto-santa-barbara" },
    { ciudad: "concepcion", institucion: "ies-concepcion" },
    { ciudad: "monteros", institucion: "universidad-siglo-21" },
    { ciudad: "monteros", institucion: "instituto-del-sur" },
    { ciudad: "monteros", institucion: "centro-de-formacion-tucuman" },
    { ciudad: "monteros", institucion: "instituto-san-miguel" },
    { ciudad: "aguilares", institucion: "universidad-siglo-21" },
    { ciudad: "aguilares", institucion: "instituto-santa-barbara" },
    { ciudad: "aguilares", institucion: "academia-profesional-norte" },
  ];
}

export async function generateMetadata({ params }) {
  const { ciudad, institucion } = await params;
  const page = await getInstitutionPageCatalog(ciudad, institucion);

  if (!page) notFound();

  const { city, institution } = page;
  return createPublicMetadata({
    title: `${institution.name} en ${city.name}`,
    description: institution.description || institution.slogan,
    path: `/${city.slug}/${institution.slug}`,
    image: institution.image,
  });
}

export default async function InstitutionPage({ params }) {
  const { ciudad, institucion } = await params;
  const page = await getInstitutionPageCatalog(ciudad, institucion);

  if (!page) notFound();

  return <InstitutionPageClient {...page} />;
}
