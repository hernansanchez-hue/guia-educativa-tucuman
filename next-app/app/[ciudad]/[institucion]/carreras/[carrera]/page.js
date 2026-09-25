import { notFound } from "next/navigation";
import { getCareerPageCatalog } from "../../../../../lib/public-catalog/career-page-catalog";
import { createPublicMetadata } from "../../../../../lib/seo/public-metadata";
import CareerPageClient from "./CareerPageClient";
import "../../../ciudad.css";
import "../../institucion.css";
import "./carrera.css";

export const revalidate = 60;

export function generateStaticParams() {
  return [
    { ciudad:"monteros", institucion:"universidad-siglo-21", carrera:"abogacia" },
    { ciudad:"monteros", institucion:"universidad-siglo-21", carrera:"contador-publico" },
    { ciudad:"monteros", institucion:"universidad-siglo-21", carrera:"lic-en-administracion" },
    { ciudad:"monteros", institucion:"universidad-siglo-21", carrera:"higiene-y-seguridad" },
    { ciudad:"monteros", institucion:"instituto-del-sur", carrera:"marketing" },
    { ciudad:"monteros", institucion:"instituto-del-sur", carrera:"recursos-humanos" },
    { ciudad:"monteros", institucion:"instituto-del-sur", carrera:"administracion-de-empresas" },
    { ciudad:"monteros", institucion:"instituto-san-miguel", carrera:"profesorado" },
    { ciudad:"monteros", institucion:"instituto-san-miguel", carrera:"gestion-educativa" },
    { ciudad:"monteros", institucion:"instituto-san-miguel", carrera:"acompanante-terapeutico" },
    { ciudad:"concepcion", institucion:"instituto-santa-barbara", carrera:"instrumentacion-quirurgica" },
    { ciudad:"concepcion", institucion:"instituto-santa-barbara", carrera:"laboratorio-de-analisis-clinicos" },
    { ciudad:"concepcion", institucion:"instituto-santa-barbara", carrera:"diagnostico-por-imagenes" },
    { ciudad:"concepcion", institucion:"ies-concepcion", carrera:"profesorado-educacion-primaria" },
    { ciudad:"concepcion", institucion:"ies-concepcion", carrera:"tecnicatura-administracion" },
    { ciudad:"concepcion", institucion:"ies-concepcion", carrera:"profesorado-ingles" },
    {
      ciudad: "concepcion",
      institucion: "universidad-siglo-21",
      carrera: "abogacia",
    },
    {
      ciudad: "concepcion",
      institucion: "universidad-siglo-21",
      carrera: "contador-publico",
    },
    {
      ciudad: "concepcion",
      institucion: "universidad-siglo-21",
      carrera: "lic-en-administracion",
    },
    { ciudad: "concepcion", institucion: "universidad-siglo-21", carrera: "higiene-y-seguridad" },
    { ciudad: "aguilares", institucion: "universidad-siglo-21", carrera: "abogacia" },
    { ciudad: "aguilares", institucion: "universidad-siglo-21", carrera: "contador-publico" },
    { ciudad: "aguilares", institucion: "universidad-siglo-21", carrera: "lic-en-administracion" },
    { ciudad: "aguilares", institucion: "universidad-siglo-21", carrera: "higiene-y-seguridad" },
    { ciudad: "aguilares", institucion: "instituto-santa-barbara", carrera: "instrumentacion-quirurgica" },
    { ciudad: "aguilares", institucion: "instituto-santa-barbara", carrera: "laboratorio-de-analisis-clinicos" },
    { ciudad: "aguilares", institucion: "instituto-santa-barbara", carrera: "diagnostico-por-imagenes" },
    { ciudad: "aguilares", institucion: "academia-profesional-norte", carrera: "diseno-grafico" },
    { ciudad: "aguilares", institucion: "academia-profesional-norte", carrera: "community-manager" },
    { ciudad: "aguilares", institucion: "academia-profesional-norte", carrera: "ventas-digitales" },
  ];
}

export async function generateMetadata({ params }) {
  const { ciudad, institucion, carrera } = await params;
  const page = await getCareerPageCatalog(ciudad, institucion, carrera);

  if (!page) notFound();

  const { city, institution, career, offering } = page;
  return createPublicMetadata({
    title: `${career.name} en ${institution.name}, ${city.name}`,
    description: career.description,
    path: `/${city.slug}/${institution.slug}/carreras/${career.slug}`,
    image: offering.image,
  });
}

export default async function CareerPage({ params }) {
  const { ciudad, institucion, carrera } = await params;
  const page = await getCareerPageCatalog(ciudad, institucion, carrera);
  if (!page) notFound();
  return <CareerPageClient {...page} />;
}
