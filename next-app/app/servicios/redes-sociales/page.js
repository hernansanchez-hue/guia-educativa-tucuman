import {getExtendedCatalog, extendedMetadata} from '../../../lib/admin/published-extended';
import {resolveEditorialMissing} from '../../../lib/admin/published-editorial';
import SocialServicePage from './SocialServicePage';
export const revalidate = 60;

export async function generateMetadata() {
  const service = (await getExtendedCatalog(['services'])).services.find(item => item.slug === 'redes-sociales');
  return extendedMetadata('/servicios/redes-sociales', service);
}
export default async function ServicePage() {
  const service = (await getExtendedCatalog(['services'])).services.find(item => item.slug === 'redes-sociales');
  if (!service) await resolveEditorialMissing('/servicios/redes-sociales');
  return <SocialServicePage service={service}/>;
}
