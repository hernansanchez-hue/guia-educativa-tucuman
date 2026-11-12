import Link from "next/link";
import EightDesignShell from "../../components/approved/EightDesignShell";
import { getCareerCatalog, getCareersCatalog, resolveEditorialMissing, editorialMetadata } from "../../../lib/admin/published-editorial";
/* eslint-disable @next/next/no-img-element */
export const revalidate = 60;
export async function generateStaticParams(){return (await getCareersCatalog()).map(({slug})=>({slug}));}
export async function generateMetadata({params}){
 const {slug}=await params,career=await getCareerCatalog(slug);
 if(!career)await resolveEditorialMissing(`/carreras/${slug}`);
 return editorialMetadata({title:`${career.name} en Tucumán`,description:career.description||`${career.name}: instituciones y oferta publicada en Tucumán.`,path:`/carreras/${career.slug}`,image:career.offerings[0]?.offering.image},career);
}
const institutionHref=entry=>entry.general?`/instituciones/${entry.institution.slug}`:`/${entry.city.slug}/${entry.institution.slug}`;
export default async function CareerIndexDetail({params}){
 const {slug}=await params,career=await getCareerCatalog(slug);
 if(!career)await resolveEditorialMissing(`/carreras/${slug}`);
 const durations=[...new Set(career.offerings.map(({offering})=>offering.duration).filter(Boolean))].join(" · ");
 const related=(await getCareersCatalog()).filter(item=>item.slug!==career.slug&&item.offerings.some(offering=>career.offerings.some(current=>current.institution.slug===offering.institution.slug))).slice(0,4);
 const image=career.offerings[0]?.offering.image||career.image;
 return <EightDesignShell><main className="careers-page career-detail-page">
  <nav className="career-breadcrumb" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>›</span><Link href="/carreras">Carreras</Link><span>›</span><b>{career.name}</b></nav>
  <section className="career-directory-hero"><div className="hero-copy"><h1>{career.name} <em>en Tucumán</em></h1><p>{career.description}</p><a href="#instituciones" className="career-primary-cta">Ver instituciones <b>→</b></a></div><figure className="hero-art photo">{image?<img src={image} alt="" fetchPriority="high"/>:null}</figure></section>
  <section className="career-fact-grid">{career.description&&<article><b aria-hidden="true">▣</b><h2>De qué se trata</h2><p>{career.description}</p></article>}{durations&&<article><b aria-hidden="true">◷</b><h2>Duración aproximada</h2><p>{durations}</p></article>}{career.workField&&<article><b aria-hidden="true">▥</b><h2>Salida laboral</h2><p>{career.workField}</p></article>}{career.graduateProfile&&<article><b aria-hidden="true">◉</b><h2>Qué vas a aprender</h2><p>{career.graduateProfile}</p></article>}</section>
  <section id="instituciones" className="career-section"><span>INSTITUCIONES</span><h2>Dónde estudiar {career.name} en Tucumán</h2><p>Estas son las instituciones que ofrecen esta carrera.</p><div className="career-offering-grid">{career.offerings.map((entry,index)=><article className="career-offering-card" key={`${entry.city.slug}-${entry.institution.slug}-${index}`}>{entry.institution.image||entry.offering.image?<img src={entry.institution.image||entry.offering.image} alt="" loading="lazy"/>:null}<div><small>{entry.institution.type}</small><h3>{entry.institution.name}</h3><p>{entry.general?"Oferta institucional · Sede a consultar":`⌖ ${entry.city.name}`}</p>{entry.offering.modality&&<i>{entry.offering.modality}</i>}<Link href={institutionHref(entry)}>Ver institución →</Link></div></article>)}</div></section>
  <section className="career-section career-comparison"><span>COMPARATIVA RÁPIDA</span><h2>Opciones para estudiar {career.name}</h2><div className="career-table-wrap" tabIndex={0} role="region" aria-label={`Comparativa de instituciones para ${career.name}`}><table><thead><tr><th scope="col">Institución</th><th scope="col">Ciudad</th><th scope="col">Modalidad</th><th scope="col">Duración aprox.</th><th scope="col" aria-label="Ficha institucional"></th></tr></thead><tbody>{career.offerings.map((entry,index)=><tr key={`${entry.city.slug}-${entry.institution.slug}-${index}`}><td>{entry.institution.name}</td><td>{entry.general?'Sede a consultar':entry.city.name}</td><td>{entry.offering.modality||"—"}</td><td>{entry.offering.duration||"—"}</td><td><Link href={institutionHref(entry)}>Ver institución →</Link></td></tr>)}</tbody></table></div></section>
  {related.length>0&&<section className="career-section"><span>CARRERAS RELACIONADAS</span><h2>También te puede interesar</h2><div className="career-related-grid">{related.map(item=><Link href={`/carreras/${item.slug}`} key={item.slug}>{item.name}<b>→</b></Link>)}</div></section>}
  <section className="career-bottom-cta"><div><span>EXPLORÁ MÁS</span><h2>Conocé todas las carreras e instituciones de Tucumán</h2><p>Buscá por ciudad y encontrá la mejor propuesta para tu futuro.</p></div><Link href="/carreras">Ver todas las carreras →</Link></section>
 </main></EightDesignShell>;
}
