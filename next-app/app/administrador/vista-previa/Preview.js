'use client';
import { useMemo } from 'react';
import CityFeaturedCareers from '../../[ciudad]/CityFeaturedCareers';
import { InstitutionCard } from '../../[ciudad]/CityInstitutionSections';
import ApprovedProfile from '../../components/approved/ApprovedProfile';
import ApprovedCareer from '../../components/approved/ApprovedCareer';
import EventsPageClient from '../../eventos/EventsPageClient';
import EventDetailClient from '../../eventos/EventDetailClient';
import ServicesPageClient from '../../servicios/ServicesPageClient';
import ServiceDetailClient from '../../servicios/ServiceDetailClient';

function privateAssets(obj) {
  if (typeof obj === 'string')
    return obj.startsWith('/media/control/')
      ? obj.replace('/media/control/', '/administrador/archivo/')
      : obj;
  if (Array.isArray(obj)) return obj.map(privateAssets);
  if (obj && typeof obj === 'object')
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, privateAssets(v)]));
  return obj;
}
export default function Preview({ preview }) {
  const p = useMemo(() => privateAssets(preview), [preview]);
  if (!p || p.error) return <p role="status">{p?.error || 'Preparando vista previa…'}</p>;
  const extendedViews={event:EventDetailClient,'events-page':EventsPageClient,service:ServiceDetailClient,'services-page':ServicesPageClient};
  const ExtendedView=extendedViews[p.kind];
  if(ExtendedView)return <div inert><ExtendedView {...p.props}/></div>;
  if(p.kind==='master'){const career=p.career||p.props?.career||{};return <article className="gc-master-preview"><p className="gc-kicker">CATÁLOGO GENERAL · CARRERA</p><h1>{career.name}</h1>{career.description&&<p>{career.description}</p>}{[['workField','Salida laboral'],['graduateProfile','Perfil profesional']].map(([k,l])=>career[k]?<section key={k}><h2>{l}</h2><p>{career[k]}</p></section>:null)}{career.studyPlan?.length>0&&<section><h2>Plan de estudios</h2>{career.studyPlan.map((x,i)=><p key={i}>{typeof x==='string'?x:[x.label,...(x.subjects||[])].join(' · ')}</p>)}</section>}{career.requirements?.length>0&&<section><h2>Requisitos</h2><ul>{career.requirements.map((r,i)=><li key={i}>{r}</li>)}</ul></section>}{career.faq?.map((f,i)=><section key={i}><h3>{f.question}</h3><p>{f.answer}</p></section>)}</article>;}
  const focus=p.focus;
  const focusedSlide=p.kind==='slider'&&focus?p.city.slides?.find(x=>x.id===focus):null;
  // Validate the canonical public slide before resolving the protected image.
  // Only the preview image request should use the authenticated file endpoint.
  const city=p.kind==='slider' ? {...p.city,slides:preview.city.slides?.map(x=>x.id===focus&&x.active===false?{...x,active:true}:x)} : p.city;
  const focusedPlacement=p.kind==='placements'&&focus?p.city.controlPlacements?.find(x=>x.id===focus):null;
  const base=focusedPlacement?city.institutions.find(i=>i.id===focus):null;
  const shown=base?[{...base,...(focusedPlacement.displayName?{name:focusedPlacement.displayName}:{}),...(focusedPlacement.image?{image:focusedPlacement.image}:{}),...(focusedPlacement.description?{description:focusedPlacement.description}:{})}]:city?.featuredInstitutions;
  return (
    <div inert>
      {(focusedPlacement?.active===false||focusedSlide?.active===false)&&<p className="gc-inactive-preview">Esta pieza está oculta. Solo se muestra aquí para que puedas revisarla.</p>}
      {p.kind === 'institution' ? (
        <ApprovedProfile {...p.props} />
      ) : p.kind === 'career' ? (
        <ApprovedCareer {...p.props} previewOnly previewPaid={p.paid} />
      ) : (
        <div className="get-city-approved">
          <main>
            {p.kind === 'slider' ? (
              <CityFeaturedCareers key={p.focus || 'slider'} city={city} dialogOpen resolvePreviewImage={privateAssets} />
            ) : (
              <section className="wrap">
                <h2>Instituciones destacadas</h2>
                <div className="featured-grid">
                  {shown.map((i) => (
                    <InstitutionCard key={i.id} institution={i} city={p.city} />
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
