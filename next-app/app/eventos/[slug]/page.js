import {getExtendedCatalog,extendedMetadata} from '../../../lib/admin/published-extended';
import {resolveEditorialMissing} from '../../../lib/admin/published-editorial';
import {getPublishedCatalog} from '../../../lib/admin/published-editorial';
import EventDetailClient from '../EventDetailClient';
import '../../[ciudad]/ciudad.css';
import '../eventos.css';
export const revalidate=60;
export async function generateStaticParams(){return (await getExtendedCatalog(['events'])).events.map(e=>({slug:e.slug}));}
export async function generateMetadata({params}){const {slug}=await params,event=(await getExtendedCatalog(['events'])).events.find(e=>e.slug===slug);return extendedMetadata('/eventos/'+slug,event);}
export default async function EventPage({params}){const {slug}=await params,event=(await getExtendedCatalog(['events'])).events.find(e=>e.slug===slug);if(!event)await resolveEditorialMissing('/eventos/'+slug);const catalog=await getPublishedCatalog();return <EventDetailClient event={event} institutionNames={(event.institutions||[]).map(id=>catalog.institutions.find(i=>i.id===id)?.name).filter(Boolean)}/>;}
