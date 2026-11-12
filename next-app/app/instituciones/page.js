import InstitutionsIndexClient from "./InstitutionsIndexClient";
import {compactDirectoryInstitutions} from "../../lib/catalog/directory-projections.mjs";
import { getInstitutionsCatalog,getCitiesCatalog,getCareersCatalog } from "../../lib/admin/published-editorial";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
export const revalidate = 60;
export const metadata = createPublicMetadata({ title: "Instituciones en Tucumán", path: "/instituciones" });
export default async function InstitutionsPage({searchParams}) {
 const [institutions,cities,careers,query]=await Promise.all([getInstitutionsCatalog(),getCitiesCatalog(),getCareersCatalog(),searchParams]);
 const read=name=>typeof query?.[name]==='string'?query[name]:'';
 return <InstitutionsIndexClient key={JSON.stringify(query)} institutions={compactDirectoryInstitutions(institutions)} cities={cities} careers={careers.map(c=>({name:c.name,slug:c.slug}))} initialQuery={read('buscar')||read('q')} initialFilters={{city:read('ciudad'),type:read('tipo'),ownership:read('gestion'),page:read('pagina')}}/>;
}
