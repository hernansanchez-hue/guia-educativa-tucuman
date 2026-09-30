import Link from "next/link";
import PublicFooter from "../components/PublicFooter";
import PublicHeader from "../components/PublicHeader";
import { getCareersCatalog } from "../../lib/public-catalog/careers-catalog";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
import "../[ciudad]/ciudad.css";
import "./carreras.css";

export const revalidate = 60;
export const metadata = createPublicMetadata({ title: "Carreras en Tucumán", path: "/carreras" });
export default async function CareersIndexPage() { const careers = await getCareersCatalog(); return <div className="app-shell"><PublicHeader /><main className="careers-page"><header className="careers-intro"><span>OFERTA EDUCATIVA</span><h1>Encontrá carreras en Tucumán</h1><p>Explorá las carreras disponibles y las instituciones donde podés estudiarlas.</p></header><section className="careers-index-grid">{careers.map((career) => <Link className="career-index-card" href={`/carreras/${career.slug}`} key={career.slug}><span>{career.offerings.length} {career.offerings.length === 1 ? "institución" : "instituciones"}</span><h2>{career.name}</h2><p>{career.description}</p><strong>Ver carrera <b>→</b></strong></Link>)}</section></main><PublicFooter /></div>; }
