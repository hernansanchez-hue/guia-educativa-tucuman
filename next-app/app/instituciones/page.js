import InstitutionsIndexClient from "./InstitutionsIndexClient";
import { getInstitutionsCatalog } from "../../lib/public-catalog/institutions-catalog";
import { createPublicMetadata } from "../../lib/seo/public-metadata";
export const revalidate = 60;
export const metadata = createPublicMetadata({ title: "Instituciones en Tucumán", path: "/instituciones" });
export default async function InstitutionsPage() { return <InstitutionsIndexClient institutions={await getInstitutionsCatalog()} />; }
