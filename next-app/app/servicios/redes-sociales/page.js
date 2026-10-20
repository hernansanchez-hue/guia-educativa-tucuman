import {getExtendedCatalog,extendedMetadata} from '../../../lib/admin/published-extended';
import {resolveEditorialMissing} from '../../../lib/admin/published-editorial';
import ServiceDetailClient from '../ServiceDetailClient';
import '../../[ciudad]/ciudad.css';
import '../servicios.css';
export const revalidate=60;

export async function generateMetadata(){const slug='redes-sociales',s=(await getExtendedCatalog(['services'])).services.find(s=>s.slug===slug);return extendedMetadata('/servicios/'+slug,s);}
export default async function ServicePage(){const slug='redes-sociales',s=(await getExtendedCatalog(['services'])).services.find(s=>s.slug===slug);if(!s)await resolveEditorialMissing('/servicios/'+slug);return <ServiceDetailClient service={s}/>;}
