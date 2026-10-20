import InstitutionsIndexClient from "./InstitutionsIndexClient";
import {compactDirectoryInstitutions} from "../../lib/catalog/directory-projections.mjs";
import { getInstitutionsCatalog,getCitiesCatalog,getCareersCatalog } from "../../lib/admin/published-editorial";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
export const revalidate = 60;
export const metadata = createPublicMetadata({ title: "Instituciones en Tucumán", path: "/instituciones" });
export default async function InstitutionsPage({searchParams}) { const [institutions,cities,careers,query]=await Promise.all([getInstitutionsCatalog(),getCitiesCatalog(),getCareersCatalog(),searchParams]);return <InstitutionsIndexClient institutions={compactDirectoryInstitutions(institutions)} cities={cities} careers={careers.map(c=>({name:c.name,slug:c.slug}))} initialQuery={typeof query?.buscar==='string'?query.buscar:''}/>; }
