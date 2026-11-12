import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { requireControl, mailEnabled } from '../../lib/control/session';
import { controlMode } from '../../lib/control/store';
import { assemble, makeEditor } from '../../lib/control/workspace.mjs';
import { getVersionedPublicCatalogEntries } from '../../lib/catalog/versioned-public-catalog.mjs';
import { getLegacyExtendedPublishedEntries } from '../../lib/admin/published-extended';
import {namespaceExtended} from '../../lib/control/extended.mjs';
import { chooseCity, cityEditors, createTypes, navigation, venueSections, rememberKey } from './navigation.mjs';
import Workspace from './Workspace';
import {catalogMedia} from './media-options.mjs';
import {loadCommercialInbox} from '../../lib/control/commercial-inbox-server';
import {changeInboxStatus} from './editor-actions';

export default async function Page({searchParams}) {
  const session = await requireControl();
  const {actor,store} = session;
  const [q,jar,records,history,trainings] = await Promise.all([searchParams,cookies(),store.records(actor.id),store.history(actor.id),getLegacyExtendedPublishedEntries(['trainings','events','services'],{fresh:true})]);
  const section = String(q.section || 'inicio');
  if (![...navigation.map(([id])=>id),...venueSections,'maestras'].includes(section) || (section==='usuarios' && actor.role!=='ADMINISTRADOR')) notFound();
  if(section==='consultas'&&!['ADMINISTRADOR','EDITOR'].includes(actor.role))notFound();
  const inbox=section==='consultas'?await loadCommercialInbox(session,{q:typeof q.q==='string'?q.q:'',status:typeof q.status==='string'?q.status:'',page:Number(q.page)||1}):null;
  const work = assemble([...getVersionedPublicCatalogEntries(), ...namespaceExtended(trainings)],records);
  const creation = createTypes.includes(q.new) && actor.role!=='LECTOR' ? q.new : null;
  const city = chooseCity(work.cities,cityEditors.includes(section) ? q.key || q.city : q.city,jar.get(rememberKey)?.value);
  const key = creation ? null : cityEditors.includes(section) ? city?.slug : typeof q.key==='string' ? q.key : null;
  let model = null;
  if(key) {
    try {model = makeEditor(work,key);} catch(error) {if(error.message==='Contenido no disponible.')notFound();throw error;}
  }
  const markDraft=row=>({...row,dirty:work.by.get(row.key)?.draft!=null});
  const brands=work.brands.map(markDraft);
  const masters=work.masters.map(markDraft);
  const labels = Object.fromEntries([...work.cities.map(c=>[c.slug,c.name]),...brands.map(b=>[b.key,b.name]),...masters.map(c=>[c.key,c.name]),...work.venues.map(v=>[v.key,v.name]),...work.offers.map(o=>[o.key,o.name]),...work.editorial.map(e=>[e.key,e.name])]);
  return <Workspace key={[section,key,city?.id,creation,q.tab,q.pick,q.scope,q.brand,q.venue].join(':')}
    actor={actor} mode={controlMode()} section={section} model={model} tab={q.tab} pick={q.pick} inbox={inbox} changeInboxStatus={changeInboxStatus}
    creation={creation} initialBrand={q.brand} initialVenue={q.venue} initialMaster={q.master} cityId={city?.id} cityScope={q.scope==='todas'?'todas':city?.id}
    catalogAssets={section==='medios'?catalogMedia(work.entries):[]}
    cities={work.cities} venues={work.venues} offers={work.offers} brands={brands} masters={masters} editorial={work.editorial}
    drafts={records.filter(r=>r.draft!=null).map(r=>({key:r.key,name:labels[r.key]||'Contenido en preparación'}))}
    careerCount={masters.filter(m=>!m.unpublished).length} history={history.map(row=>({...row,label:labels[row.key]||null}))} allowMail={mailEnabled()}/>;
}
