import EventsPageClient from './EventsPageClient';
import {getExtendedCatalog,extendedMetadata} from '../../lib/admin/published-extended';
import '../[ciudad]/ciudad.css';
import './eventos.css';
export const revalidate=60;
export async function generateMetadata(){const c=await getExtendedCatalog(['events']);return extendedMetadata('/eventos',c.eventsPage);}
export default async function EventsPage(){const c=await getExtendedCatalog(['events']);return <EventsPageClient events={c.events} content={c.eventsPage}/>;}
