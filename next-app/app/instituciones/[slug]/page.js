import Link from "next/link";
import EightDesignShell from "../../components/approved/EightDesignShell";
import { getInstitutionCatalog, getInstitutionsCatalog, getPublishedCatalog, resolveEditorialMissing, editorialMetadata } from "../../../lib/admin/published-editorial";
import {isPublishedContactVenue} from "../../../lib/catalog/published-contact.mjs";
/* eslint-disable @next/next/no-img-element */
export const revalidate = 60;
export async function generateStaticParams(){return (await getInstitutionsCatalog()).map(({slug})=>({slug}));}
export async function generateMetadata({params}){
 const {slug}=await params,item=await getInstitutionCatalog(slug);
 if(!item)await resolveEditorialMissing(`/instituciones/${slug}`);
 const location=item.isMultiVenue?"Tucumán":item.venues[0].city.name;
 return editorialMetadata({title:`${item.name} en ${location}`,description:`Conocé las sedes, carreras y modalidades de ${item.name} en ${location}.`,path:`/instituciones/${item.slug}`,image:item.image},item);
}
function whatsappHref(number){const digits=String(number||'').replace(/\D/g,'');return digits?`https://wa.me/${digits.startsWith('54')?digits:'54'+digits}`:null;}
export default async function InstitutionGeneral({params}){
 const {slug}=await params;
 const [item,all,catalog]=await Promise.all([getInstitutionCatalog(slug),getInstitutionsCatalog(),getPublishedCatalog()]);
 if(!item)await resolveEditorialMissing(`/instituciones/${slug}`);
 const related=all.filter(other=>other.slug!==item.slug).slice(0,3),single=item.venues[0];
 // El contacto pertenece a la sede destacada, no a todas las sedes de la marca.
 const directContact=venue=>isPublishedContactVenue(catalog,catalog.institutions.find(row=>row.id===venue.id));
 const logoImage=/^(https?:\/\/|\/)/.test(item.logo||'');
 return <EightDesignShell><main className="institutions-page institution-general">
  <nav className="institution-breadcrumb" aria-label="Ruta de navegación"><Link href="/">Inicio</Link> › <Link href="/instituciones">Instituciones</Link> › <b>{item.name}</b></nav>
  <section className="institution-hero"><div className="hero-copy"><h1>{item.name} <em>{item.isMultiVenue?"en Tucumán":`en ${single.city.name}`}</em></h1><p>{item.description}</p></div><figure className="hero-art photo">{item.image?<img src={item.image} alt={item.imageAlt||''} fetchPriority="high"/>:null}{item.logo?(logoImage?<img className="real-logo" src={item.logo} alt={item.name}/>:<span className="art-tag">{item.logo}</span>):null}</figure></section>
  <section className="institution-facts"><article><b aria-hidden="true">▣</b><h2>Tipo de institución</h2><p>{item.type}</p></article>{item.modalities.length>0&&<article><b aria-hidden="true">▱</b><h2>Modalidades</h2><p>{item.modalities.join(" · ")}</p></article>}<article><b aria-hidden="true">▤</b><h2>Oferta académica</h2><p>{item.careers.length} propuestas disponibles</p></article></section>
  {item.isMultiVenue?<section className="institution-section"><h2>Sedes de {item.name} en Tucumán</h2><p>Conocé las sedes disponibles y accedé a más información en cada una.</p><div className="venue-grid">{item.venues.map(venue=><article key={venue.id||venue.city.slug}>{venue.image?<img src={venue.image} alt="" loading="lazy"/>:null}<div><h3>{venue.city.name}</h3>{venue.address&&<p>⌖ {venue.address}</p>}{directContact(venue)&&venue.whatsapp&&<p>◌ {venue.whatsapp}</p>}{venue.offerings[0]?.modality&&<i>{venue.offerings[0].modality}</i>}<Link href={`/${venue.city.slug}/${item.slug}`}>Ver sede →</Link></div></article>)}</div></section>:<section className="institution-section institution-contact"><h2>Información de contacto</h2>{single.address&&<a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([item.name,single.address,single.city.name,'Tucumán'].join(', '))}`} target="_blank" rel="noopener noreferrer">⌖ {single.address}<strong>Cómo llegar →</strong></a>}{directContact(single)&&whatsappHref(single.whatsapp)&&<a href={whatsappHref(single.whatsapp)} target="_blank" rel="noopener noreferrer">◌ {single.whatsapp}</a>}<Link href={`/${single.city.slug}/${item.slug}`}>Ver sede →</Link></section>}
  {item.careers.length?<section className="institution-section"><h2>Carreras disponibles {item.isMultiVenue?`en ${item.name}`:""}</h2><div className="institution-career-grid">{item.careers.slice(0,6).map(career=><article key={career.slug}>{career.image?<img src={career.image} alt="" loading="lazy"/>:null}<h3>{career.name}</h3><p>{career.general?"Oferta institucional · Sede a consultar":career.cities.map(city=>city.name).join(" · ")}</p>{career.modality&&<i>{career.modality}</i>}<Link href={`/carreras/${career.slug}`}>Ver carrera →</Link></article>)}</div>{item.careers.length>6&&<Link className="institution-more" href={`/carreras?institucion=${encodeURIComponent(item.slug)}`}>Ver todas las carreras →</Link>}</section>:null}
  {item.description||item.gallery[1]?<section className="institution-section institution-about"><div><h2>Sobre {item.type.toLowerCase().includes("universidad")?"la Universidad":"la institución"}</h2><p>{item.description}</p></div>{item.gallery[1]&&<img src={item.gallery[1]} alt="" loading="lazy"/>}</section>:null}
  <section className="institution-section"><h2>También te puede interesar</h2><div className="related-institutions">{related.map(other=><Link href={`/instituciones/${other.slug}`} key={other.slug}>{other.name}<span>{other.venues.map(venue=>venue.city.name).join(" · ")}</span><b>Ver institución →</b></Link>)}</div></section>
 </main></EightDesignShell>;
}
