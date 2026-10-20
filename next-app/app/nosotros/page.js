import AboutPageClient from './AboutPageClient';
import {getExtendedCatalog,extendedMetadata} from '../../lib/admin/published-extended';
import '../[ciudad]/ciudad.css';
import './nosotros.css';
import './nosotros-refinement.css';
export const revalidate=60;
export async function generateMetadata(){const content=(await getExtendedCatalog(['about'])).about;return extendedMetadata('/nosotros',content,{title:'Nosotros',description:'Guía Educativa Tucumán nació para reunir en un solo lugar toda la oferta educativa de la provincia y acercar a cada persona a su próximo paso.'});}
export default async function AboutPage(){const content=(await getExtendedCatalog(['about'])).about;return <AboutPageClient content={content}/>;}
