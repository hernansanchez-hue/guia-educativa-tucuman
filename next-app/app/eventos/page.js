import EventsPageClient from './EventsPageClient';
import {getExtendedCatalog, extendedMetadata} from '../../lib/admin/published-extended';
export const revalidate = 60;
export async function generateMetadata() {
  const catalog = await getExtendedCatalog(['events']);
  return extendedMetadata('/eventos', catalog.eventsPage);
}
export default async function EventsPage() {
  const catalog = await getExtendedCatalog(['events']);
  return <EventsPageClient events={catalog.events} content={catalog.eventsPage}/>;
}
