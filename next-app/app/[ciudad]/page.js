import CityPageClient from "./CityPageClient";
import { getCityEntryCatalog } from "../../lib/public-catalog/city-entry.mjs";
import { getCitiesCatalog, getCityPageCatalog, editorialMetadata, resolveEditorialMissing } from "../../lib/admin/published-editorial";
import "./ciudad.css";
import "./approved-city.css";

export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCitiesCatalog()).map((city) => ({ ciudad: city.slug }));
}

export async function generateMetadata({ params }) {
  const { ciudad } = await params;
  const city = await getCityPageCatalog(ciudad);

  if (!city) await resolveEditorialMissing(`/${ciudad}`);

  return editorialMetadata({
    title: city.title,
    description: `Instituciones y propuestas educativas de ${city.name} en Guía Educativa Tucumán.`,
    path: `/${city.slug}`,
  }, city);
}

export default async function CityPage({ params }) {
  const { ciudad } = await params;
  const sourceCity = await getCityPageCatalog(ciudad);
  const city = sourceCity ? { ...sourceCity, entryCities: getCityEntryCatalog() } : null;

  if (!city) await resolveEditorialMissing(`/${ciudad}`);

  return <CityPageClient city={city} />;
}
