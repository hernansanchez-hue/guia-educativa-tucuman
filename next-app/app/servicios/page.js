import ServicesPageClient from './ServicesPageClient';
import {getExtendedCatalog,extendedMetadata} from '../../lib/admin/published-extended';
import '../[ciudad]/ciudad.css';
import './servicios.css';
export const revalidate=60;
export async function generateMetadata(){const c=await getExtendedCatalog(['services']);return extendedMetadata('/servicios',c.servicesPage);}
export default async function ServicesPage(){const c=await getExtendedCatalog(['services']);return <ServicesPageClient content={c.servicesPage} services={c.services}/>;}
