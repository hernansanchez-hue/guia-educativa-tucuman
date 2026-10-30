import ServicesPageClient from '../components/approved/ApprovedServices';
import {getExtendedCatalog,extendedMetadata} from '../../lib/admin/published-extended';


export const revalidate=60;
export async function generateMetadata(){const c=await getExtendedCatalog(['services']);return extendedMetadata('/servicios',c.servicesPage);}
export default async function ServicesPage(){const c=await getExtendedCatalog(['services']);return <ServicesPageClient content={c.servicesPage} services={c.services}/>;}
