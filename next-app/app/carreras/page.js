import CatalogFilters from "../components/CatalogFilters";
import {compactDirectoryCareers} from "../../lib/catalog/directory-projections.mjs";
import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";
import { getCareersCatalog } from "../../lib/admin/published-editorial";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
import "../[ciudad]/ciudad.css";
import "./carreras.css";

export const revalidate = 60;
export const metadata = createPublicMetadata({ title: "Carreras en Tucumán", path: "/carreras" });
export default async function CareersIndexPage({searchParams}) { const [careers,query] = await Promise.all([getCareersCatalog(),searchParams]); return <div className="app-shell"><PublicHeader /><main className="careers-page"><header className="careers-intro"><span>OFERTA EDUCATIVA</span><h1>Encontrá carreras en Tucumán</h1><p>Explorá las carreras disponibles y las instituciones donde podés estudiarlas.</p></header><CatalogFilters kind="careers" items={compactDirectoryCareers(careers)} initialQuery={typeof query?.buscar==='string'?query.buscar:''} initialCity={typeof query?.ciudad==='string'?query.ciudad:''}/></main><PublicFooter /></div>; }
