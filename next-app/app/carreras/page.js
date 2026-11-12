import CatalogFilters from "../components/CatalogFilters";
import CatalogHeroArt from "../components/approved/CatalogHeroArt";
import EightDesignShell from "../components/approved/EightDesignShell";
import {compactDirectoryCareers} from "../../lib/catalog/directory-projections.mjs";
import { getCareersCatalog } from "../../lib/admin/published-editorial";
import { createPublicMetadata } from "../../lib/seo/public-metadata";

export const revalidate = 60;
export const metadata = createPublicMetadata({ title: "Carreras en Tucumán", path: "/carreras" });
export default async function CareersIndexPage({searchParams}) {
 const [careers,query] = await Promise.all([getCareersCatalog(),searchParams]);
 const read=name=>typeof query?.[name]==='string'?query[name]:'';
 const initialFilters={city:read('ciudad'),institution:read('institucion'),modality:read('modalidad'),page:read('pagina')};
 return <EightDesignShell><main className="careers-page" data-catalog="carreras"><header className="careers-intro"><div className="hero-copy"><span>OFERTA EDUCATIVA</span><h1>Encontrá carreras <em>en Tucumán</em></h1><p>Explorá las carreras disponibles y las instituciones donde podés estudiarlas.</p></div><CatalogHeroArt/></header><CatalogFilters key={JSON.stringify(query)} kind="careers" items={compactDirectoryCareers(careers)} initialQuery={read('buscar')||read('q')} initialFilters={initialFilters}/></main></EightDesignShell>;
}
