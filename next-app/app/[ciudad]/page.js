import { notFound } from "next/navigation";
import CityPageClient from "./CityPageClient";
import { getCityPageCatalog } from "../../lib/public-catalog/city-page-catalog";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
import "./ciudad.css";

export const revalidate = 60;

export function generateStaticParams() {
  return [{ ciudad: "concepcion" }, { ciudad: "monteros" }, { ciudad: "aguilares" }];
}

export async function generateMetadata({ params }) {
  const { ciudad } = await params;
  const city = await getCityPageCatalog(ciudad);

  if (!city) notFound();

  return createPublicMetadata({
    title: city.title,
    description: `Instituciones y propuestas educativas de ${city.name} en Guía Educativa Tucumán.`,
    path: `/${city.slug}`,
  });
}

export default async function CityPage({ params }) {
  const { ciudad } = await params;
  const city = await getCityPageCatalog(ciudad);

  if (!city) notFound();

  return <CityPageClient city={city} />;
}
