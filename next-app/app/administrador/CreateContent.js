'use client';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import SearchPicker from './SearchPicker';
import {href,norm} from './navigation.mjs';
import {createDraft} from './editor-actions';
import useInteractive from './useInteractive';
const settings = {
  evento:['Nuevo evento','Creá una ficha privada. Completá fecha y lugar reales antes de confirmarla.','event','eventos'],
  institucion: ['Nueva institución','Vas a crear la institución y su primera sede juntas. El alta no concede beneficios pagos.','institution','sedes'],
  sede: ['Nueva sede','Sumá una sede a una institución ya existente. Los datos de contacto serán propios de esta sede.','venue','sedes'],
  carrera: ['Nueva carrera general','Esta ficha identifica una carrera en GET. Después podés asociarla a una o más sedes.','career','ofertas'],
  oferta: ['Nueva oferta académica','Vinculá una carrera de GET a la sede que la dicta. La duración y la modalidad pertenecen solo a esa oferta.','offering','ofertas'],
};
export default function CreateContent({creation,cities,venues,brands,masters,initialBrand,initialVenue,initialMaster,cityId}){
  const router=useRouter(), interactive=useInteractive(), [title,intro,kind,section]=settings[creation];
  const [data,set]=useState(()=>({name:'',type:'',cityId,brandId:initialBrand||'',campusName:'',address:'',institutionId:initialVenue||'',careerId:initialMaster||'',degree:'',duration:'',modality:'',description:'',category:''}));
  const [busy,wait]=useState(false),[message,tell]=useState(''),[touched,touch]=useState(false);
  const [leaving,setLeaving]=useState(false);
  const setField=(k,v)=>{touch(true);set(old=>({...old,[k]:v}));tell('');};
  const isVenue=creation==='sede',isBrand=creation==='institucion',isMaster=creation==='carrera';
  const hasCampus=isVenue||isBrand;
  const brand=brands.find(b=>b.id===data.brandId),venue=venues.find(v=>v.id===data.institutionId),master=masters.find(c=>c.id===data.careerId);
  const duplicate=isBrand?brands.find(b=>norm(b.name)===norm(data.name)):isMaster?masters.find(c=>norm(c.name)===norm(data.name)):null;
  useEffect(()=>{
    if(!touched||leaving)return;
    const unload=e=>{e.preventDefault();e.returnValue='';};
    const ask=e=>{if(e.target.closest?.('a[href]')&&!e.target.closest('a[target="_blank"]')&&!confirm('¿Salir sin guardar este contenido?')){e.preventDefault();e.stopPropagation();}};
    window.addEventListener('beforeunload',unload);document.addEventListener('click',ask,true);
    return ()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',ask,true);};
  },[touched,leaving]);
  async function save(e){
    e.preventDefault();if(busy||leaving)return;
    if(hasCampus&&!data.cityId||isVenue&&!data.brandId||kind==='offering'&&(!data.institutionId||!data.careerId)){tell('Completá las selecciones obligatorias antes de guardar.');return;}
    if(duplicate){tell('Ya hay una ficha con ese nombre. Seleccionala en lugar de crear otra.');return;}
    const inputs={
      institution:['name','cityId','type','address'],venue:['brandId','cityId','type','campusName','address'],
      career:['name','description'],offering:['institutionId','careerId','degree','duration','modality'],event:['name','cityId','category']
    };
    const input=Object.fromEntries(inputs[kind].filter(k=>data[k]?.trim()).map(k=>[k,data[k].trim()]));
    wait(true);
    try{const res=await createDraft({kind,...input});if(!res.ok)throw Error(res.message||'No se pudo guardar el borrador.');
      touch(false);setLeaving(true);tell('Borrador guardado. Abriendo el editor…');router.push(href({section,key:res.key}));
    }catch(err){tell(err.message||'No se pudo guardar el borrador.');}finally{wait(false);}
  }
  function field(k,label,required=false,long=false){return <label>{label}{required?' *':''}{long?<textarea value={data[k]} required={required} maxLength={5000} onChange={e=>setField(k,e.target.value)}/>:<input value={data[k]} required={required} maxLength={k==='address'?300:140} onChange={e=>setField(k,e.target.value)}/>}</label>;}
  const city=cities.find(c=>c.id===data.cityId);
  const pick=(label,items,k)=> <SearchPicker label={label} placeholder="Elegí una opción" items={items} value={data[k]} onSelect={id=>setField(k,id)}/>;
  const mainName=(isMaster||isBrand||kind==='event'?data.name:isVenue?data.campusName||brand?.name:master?.name)||'Nombre pendiente';
  const contextualName=hasCampus?city?.name:kind==='offering'?[venue?.name,venue?.city].filter(Boolean).join(' · '):'Catálogo general de GET';
  return <section data-unsaved={touched&&!leaving?'true':'false'}><Link className="gc-back" href={href({section})}>← Volver al listado</Link>
    <p className="gc-kicker">NUEVO CONTENIDO</p><h1>{title}</h1><p className="gc-lead">{intro}</p>
    <div className="gc-create-layout"><form className="gc-panel gc-create-form" onSubmit={save}><h2>Datos iniciales</h2><p>Los campos con * son obligatorios.</p><fieldset disabled={!interactive||busy||leaving} className="gc-fields">
      {(isBrand||isMaster)&&field('name',isMaster?'Nombre de la carrera':'Nombre oficial de la institución',true)}
      {kind==='event'&&<>{field('name','Nombre del evento',true)}{pick('Ciudad *',cities,'cityId')}{field('category','Tipo de evento',true)}</>}
      {duplicate&&<p role="status" className="gc-notice">Ya existe una ficha con ese nombre. {duplicate.unpublished?<Link href={href({section:'borradores'})}>Ver borradores</Link>:<Link href={href(isBrand?{section:'sucursales',new:'sede',brand:duplicate.id}:{section:'ofertas',new:'oferta',master:duplicate.id})}>{isBrand?'Agregar una sede':'Crear una oferta para esa carrera'} →</Link>}</p>}
      {isVenue&&pick('Institución existente *',brands.filter(b=>!b.unpublished),'brandId')}
      {hasCampus&&<>{pick('Ciudad de la sede *',cities,'cityId')}{isVenue&&field('campusName','Nombre de la sede, si es diferente')}{field('type','Tipo de institución',true)}{field('address','Dirección de la sede')}</>}
      {isMaster&&field('description','Descripción',false,true)}
      {kind==='offering'&&<>
        {pick('Institución y sede *',venues.filter(v=>!v.unpublished&&v.visible).map(v=>({...v,detail:v.city})),'institutionId')}
        {pick('Carrera registrada *',masters.filter(m=>!m.unpublished),'careerId')}
        <p className="gc-help">¿La carrera todavía no está en GET? <Link href={href({section:'ofertas',new:'carrera'})}>Crear la carrera general</Link> antes de vincularla.</p>
        {field('degree','Título otorgado',true)}<div className="gc-two-fields">{field('duration','Duración')}{field('modality','Modalidad')}</div>
      </>}
      <div className="gc-tools"><button className="gold" disabled={busy||leaving||!!duplicate}>{busy?'Guardando…':'Guardar borrador'}</button><Link href={href({section})}>Cancelar</Link></div>
    </fieldset><p role="status">{message}</p></form>
    <aside className="gc-create-summary"><p className="gc-kicker">REVISIÓN DEL ALTA</p><span className="gc-state draft">Borrador</span><h2>{mainName}</h2><p>{contextualName}</p>
      <dl>{[[isMaster?'Descripción':'',data.description],['Título',data.degree],['Tipo',data.type],['Duración',data.duration],['Modalidad',data.modality],['Dirección',data.address]].filter(([k,v])=>k&&v).map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <small>Al guardar vas a poder completar los detalles y revisar la vista previa. Este contenido todavía no estará en la web pública.</small>
    </aside></div>
  </section>;
}
