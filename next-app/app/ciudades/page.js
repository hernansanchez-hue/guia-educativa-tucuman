import HomeClient from "../components/HomeClient";
import "../home.css";
import { getCitiesCatalog } from "../../lib/public-catalog/cities-catalog";
import { createPublicMetadata } from "../../lib/seo/public-metadata";

export const revalidate = 60;

export const metadata = createPublicMetadata({
  title: "Ciudades",
  description: "Elegí tu ciudad para explorar la oferta educativa disponible en Tucumán.",
  path: "/ciudades",
});

export default async function CitiesPage() {
  const cities = await getCitiesCatalog();

  return <HomeClient cities={cities} />;
}
