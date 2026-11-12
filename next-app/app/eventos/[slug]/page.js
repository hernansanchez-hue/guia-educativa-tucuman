import {getExtendedCatalog, extendedMetadata} from '../../../lib/admin/published-extended';
import {resolveEditorialMissing, getPublishedCatalog} from '../../../lib/admin/published-editorial';
import {isConfirmedEvent} from '../../../lib/events/public-events.mjs';
import EventDetailClient from '../EventDetailClient';
export const revalidate = 60;
export async function generateStaticParams() {
  return (await getExtendedCatalog(['events'])).events.map(event => ({slug: event.slug}));
}
export async function generateMetadata({params}) {
  const {slug} = await params;
  const event = (await getExtendedCatalog(['events'])).events.find(item => item.slug === slug);
  const metadata = extendedMetadata('/eventos/' + slug, event);
  return isConfirmedEvent(event) ? metadata : {...metadata, robots: {index: false, follow: false}};
}
export default async function EventPage({params}) {
  const {slug} = await params;
  const event = (await getExtendedCatalog(['events'])).events.find(item => item.slug === slug);
  if (!event) await resolveEditorialMissing('/eventos/' + slug);
  const catalog = await getPublishedCatalog();
  return <EventDetailClient event={event} institutionNames={(event.institutions || []).map(id => catalog.institutions.find(item => item.id === id)?.name).filter(Boolean)}/>;
}
