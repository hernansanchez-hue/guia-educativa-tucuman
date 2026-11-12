'use client';
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useDeferredValue,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fields } from '../../lib/control/domain.mjs';
import { changeContent, openEditor } from './editor-actions';
import { previewData } from '../../lib/control/workspace.mjs';
import { createPortal } from 'react-dom';
import Preview from './vista-previa/Preview';
import {MediaControl, MediaDialog} from './MediaControl';
import CityComposer from './CityComposer';
import InstitutionCareers from './InstitutionCareers';
import {catalogMedia} from './media-options.mjs';
import EditorialIcon from './EditorialIcon';
import {controlExtendedKinds,extendedGroups} from '../../lib/control/extended.mjs';
import ExtendedFields from './ExtendedFields';

const noSubscription = () => () => {};
const viewportSizes = ['(max-width: 650px)','(max-width: 1100px)'];
function watchViewport(callback) {
  const queries = viewportSizes.map(query => window.matchMedia(query));
  queries.forEach(m => m.addEventListener('change', callback));
  return () => queries.forEach(m => m.removeEventListener('change', callback));
}
function suggestedPreviewWidth() {
  return window.matchMedia(viewportSizes[0]).matches ? 390 : window.matchMedia(viewportSizes[1]).matches ? 768 : 1280;
}
const url = (section, key, tab) =>
  '/administrador?' + new URLSearchParams({ section, key, ...(tab ? { tab } : {}) });
const tabs = {
  institution: {
    General: ['campusName','description','type','additionalInfo','visible'],
    Sedes: ['address','openingHours','phone','whatsapp','email','website','socialLinks','modalities'],
    Carreras: [], Destacadas: [], Medios: ['logoUrl','image','gallery'], SEO:['seo'],
  },
  offering: {
    General:['name','description','degree','titleType','duration','modality','visible'],
    Académica:['fullDescription','learning','studyPlan','requirements','workField','graduateProfile','additionalInfo','faq'],
    Medios:['image','gallery','video','studyPlanPdf'],
    Botones:['infoLabel','consultLabel','pdfLabel','whatsapp','enrollmentUrl'],
    SEO:['seo'],
  },
  career: {General:['name','description'],Académica:['studyPlan','requirements','workField','graduateProfile','faq'],SEO:['seo']},
  brand:{General:['name','description','logoUrl']},
  city:{Slider:[],Destacadas:[]}
};
const labels={General:'Información general',Sedes:'Sedes y contacto',Carreras:'Carreras',Destacadas:'Carreras destacadas',Medios:'Imágenes y archivos',SEO:'En buscadores',Académica:'Información académica',Botones:'Botones y enlaces'};
const move = (a, i, n) => {
  const r = a.slice();
  [r[i], r[n]] = [r[n], r[i]];
  return r;
};
function Order({ i, rows, change, remove = true }) {
  return (
    <div className="gc-tools">
      <button
        className="secondary"
        aria-label="Subir posición"
        disabled={!i}
        onClick={() => change(move(rows, i, i - 1))}
      >
        ↑
      </button>
      <button
        className="secondary"
        aria-label="Bajar posición"
        disabled={i >= rows.length - 1}
        onClick={() => change(move(rows, i, i + 1))}
      >
        ↓
      </button>
      {remove && (
        <button className="secondary" onClick={() => change(rows.filter((_, n) => n !== i))}>
          Retirar
        </button>
      )}
    </div>
  );
}
function Field({ k, label, value, set, pick }) {
  const v = value ?? '';
  if (k === 'visible')
    return (
      <label className="gc-check">
        <input type="checkbox" checked={value !== false} onChange={(e) => set(e.target.checked)} />{' '}
        Visible al publicar
      </label>
    );
  if (k === 'seo') {
    const seo = value || {};
    return (
      <>
        <p>Solo afecta a esta ficha.</p>
        {[
          ['title', 'Título SEO'],
          ['description', 'Descripción SEO'],
          ['canonical', 'Dirección principal en GET (opcional)'],
          ['image', 'Imagen al compartir'],
        ].map(([n, l]) => (
          <Field
            key={n}
            k={n}
            label={l}
            value={seo[n]}
            set={(x) => set({ ...seo, [n]: x })}
            pick={pick}
          />
        ))}
        <div className="gc-snippet">
          <small>guiaeducativatuc.com.ar</small>
          <h3>{seo.title || 'Título automático de la ficha'}</h3>
          <p>{seo.description || 'Descripción automática de la ficha'}</p>
        </div>
      </>
    );
  }
  if (k === 'faq' || k === 'studyPlan') {
    const rows = value || [],
      plan = k === 'studyPlan';
    return (
      <fieldset>
        <legend>{label}</legend>
        {rows.map((r, i) => {
          const obj = typeof r === 'string' ? { label: r, subjects: [] } : r;
          const upd = (n, x) => set(rows.map((old, j) => (j === i ? { ...obj, [n]: x } : old)));
          return (
            <div className="gc-item" key={i}>
              <label>
                {plan ? 'Año o etapa' : 'Pregunta'}
                <input
                  value={(plan ? obj.label : obj.question) || ''}
                  onChange={(e) => upd(plan ? 'label' : 'question', e.target.value)}
                />
              </label>
              <label>
                {plan ? 'Materias (una por línea)' : 'Respuesta'}
                <textarea
                  value={plan ? (obj.subjects || []).join('\n') : obj.answer || ''}
                  onChange={(e) =>
                    upd(
                      plan ? 'subjects' : 'answer',
                      plan ? e.target.value.split('\n') : e.target.value,
                    )
                  }
                />
              </label>
              <Order rows={rows} i={i} change={set} />
            </div>
          );
        })}
        <button
          className="secondary"
          onClick={() =>
            set([...rows, plan ? { label: '', subjects: [] } : { question: '', answer: '' }])
          }
        >
          Agregar {plan ? 'etapa' : 'pregunta'}
        </button>
      </fieldset>
    );
  }
  if(['image','logoUrl','gallery','studyPlanPdf'].includes(k))return <MediaControl field={k} label={label} value={value} onChange={set} onChoose={pick}/>;
  const isList = ['requirements', 'socialLinks', 'modalities'].includes(k);
  return (
    <div>
      <label>
        {label}
        {isList ? ' (una por línea)' : ''}
        {isList ||
        [
          'description',
          'fullDescription',
          'learning',
          'workField',
          'graduateProfile',
          'additionalInfo',
        ].includes(k) ? (
          <textarea
            rows={isList ? 3 : 4}
            value={isList ? (value || []).join('\n') : v}
            onChange={(e) =>
              set(isList ? (e.target.value ? e.target.value.split('\n') : []) : e.target.value)
            }
          />
        ) : (
          <input value={v} onChange={(e) => set(e.target.value)} />
        )}
      </label>
    </div>
  );
}
export default function Editor({
  model,
  actor,
  section,
  tab: initial,
  pick: initialPick,
  readOnly,
  history,
}) {
  const router = useRouter(),
    [m, modelSet] = useState(model),
    [draft, edit] = useState(model.patch),
    [dirty, mark] = useState(false),
    [message, notice] = useState(''),
    [busy, wait] = useState(false),
    [picker, setPicker] = useState(null),
    [focus, setFocus] = useState(''),
    [requestedWidth, size] = useState(null);
  const adaptiveWidth = useSyncExternalStore(watchViewport, suggestedPreviewWidth, () => 1280);
  const width = requestedWidth ?? adaptiveWidth;
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const lib = useRef();
  const previewSection=useRef();
  const [cityActionTarget, setCityActionTarget] = useState(null);
  function goPreview(){previewSection.current?.scrollIntoView({behavior:'auto',block:'start'});previewSection.current?.focus({preventScroll:true});}
  const isExtended=controlExtendedKinds.includes(m.kind),groups=isExtended?extendedGroups(m.kind):null;
  const sections = groups || tabs[m.kind],
    names = Object.keys(sections),
    [tab, select] = useState(
      names.includes(initial) ? initial : section === 'destacadas' ? 'Destacadas' : names[0],
    );
  const values = { ...m.values, ...draft };
  const publishedAssets=useMemo(()=>catalogMedia(m.previewSource),[m.previewSource]);
  useEffect(()=>{if(initial==='Vista previa'&&hydrated)goPreview();},[initial,hydrated]);
  function set(k, v) {
    edit((old) => ({ ...old, [k]: v }));
    mark(true);
    notice('');
  }
  useEffect(() => {
    const f = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const click = (e) => {
      if (
        dirty &&
        e.target.closest?.('a[href]') &&
        !e.target.closest('a[target="_blank"]') &&
        !confirm('¿Salir sin guardar los cambios?')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener('beforeunload', f);
    document.addEventListener('click', click, true);
    return () => {
      window.removeEventListener('beforeunload', f);
      document.removeEventListener('click', click, true);
    };
  }, [dirty]);
  const previewType = m.kind === 'city' && tab === 'Destacadas' ? 'placements' : 'normal';
  const deferred = useDeferredValue(draft);
  const preview = useMemo(() => {
    if(m.restoringAbsence)return {error:'Al publicar esta versión, la ficha dejará de estar disponible. Podés descartar el borrador para conservarla.'};
    try {
      return (
        previewData(m.previewSource, [], m.key, deferred, previewType, focus, !!m.cityOptions?.length) || {
          error: 'Esta sede no está visible en la vista previa.',
        }
      );
    } catch (e) {
      return { error: e.message };
    }
  }, [m.previewSource, m.key, m.restoringAbsence, m.cityOptions, deferred, previewType, focus]);
  const showPicker = (kind, callback) => {
    lib.current = callback;
    setPicker(kind);
  };
  async function act(op, version) {
    if (
      op !== 'save' &&
      !confirm(
        {
          publish: m.restoringAbsence?'¿Retirar la ficha pública al restaurar su estado anterior a la creación?':'¿Publicar el borrador guardado en el sitio de este entorno?',
          discard: '¿Descartar el borrador y volver a la última publicación?',
          restore: '¿Recuperar el estado anterior a esa publicación como borrador?',
        }[op],
      )
    )
      return;
    wait(true);
    try {
      const r = await changeContent({
        key: m.key,
        op,
        revision: m.revision,
        patch: draft,
        version,
      });
      if (!r.ok) throw Error(r.message);
      if(r.removed){mark(false);router.replace('/administrador?section='+encodeURIComponent(section));router.refresh();return;}
      const fresh = await openEditor(m.key);
      modelSet(fresh);
      edit(fresh.patch);
      mark(false);
      notice(
        {
          save: 'Borrador guardado. El público no cambió.',
          publish: 'Publicación guardada. La caché del sitio se invalidó.',
          discard: 'Borrador descartado.',
          restore: 'Versión recuperada como borrador.',
        }[op],
      );
      router.refresh();
    } catch (e) {
      notice(e.message);
    } finally {
      wait(false);
    }
  }
  const fieldList=(group)=>(sections[group]||[]).filter(k=>m.paid||!['whatsapp','enrollmentUrl'].includes(k));
  const draw=k=><Field key={k} k={k} label={(fields[m.kind]?.[k]||k)+(m.kind==='institution'&&['gallery','image'].includes(k)?' (foto verificada)':'')} value={values[k]} set={v=>set(k,v)} pick={showPicker}/>;
  const isCareer=['offering','career'].includes(m.kind),isCity=m.kind==='city',slider=section!=='destacadas'&&tab!=='Destacadas';
  const dedicatedCity=isCity&&['slider','destacadas'].includes(section);
  const editorName=isCity?(slider?'Slider de la ciudad':'Instituciones destacadas'):m.title;
  const state=m.dirty||m.unpublished?'BORRADOR':m.values.visible===false?'OCULTO':'PUBLICADO';
  const canOperate=!readOnly&&hydrated&&!busy;
  const usable=canOperate&&!m.restoringAbsence;
  const historical=history.filter(r=>r.key===m.key&&r.operation==='publish').slice(0,5);
  const editTab=tab==='Vista previa'?names[0]:tab;
  return <div className="gc-editor-studio" data-unsaved={dirty?'true':undefined}>
    <header className={dedicatedCity?'gc-editor-title gc-city-context':'gc-editor-title'}><div>{!dedicatedCity&&<><span className="gc-kicker">{isCity?m.title.toLocaleUpperCase('es'):isExtended?'CONTENIDO EDITORIAL':m.kind==='career'?'CARRERA DEL CATÁLOGO':m.kind==='offering'?'PÁGINA DE CARRERA':m.kind==='brand'?'INSTITUCIÓN · TODAS SUS SEDES':'FICHA DE INSTITUCIÓN'}</span>
      <h1>{editorName}</h1></>}
      <p>{isCity?(slider?'Componé las diapositivas en el orden en que se mostrarán.':'Elegí qué sedes aparecen en el bloque destacado, sin cambiar sus planes.') : isExtended ? 'Prepará un borrador y revisá la vista previa antes de publicar.' : m.kind==='offering' ? m.venue?.name+' · '+m.venue?.city : m.kind==='career'?'Identidad compartida de esta carrera; la duración y modalidad se editan por sede.':m.venue?.city||'Información institucional compartida.'}</p>
    </div><div className="gc-editor-meta">{isCity&&<span ref={setCityActionTarget}/>}<span className={'gc-state-badge state-'+state.toLowerCase()}>{state}</span>{m.url&&!m.unpublished&&values.visible!==false&&<a href={m.url} target="_blank" rel="noreferrer">Ver ficha pública ↗</a>}</div></header>
    <div className="gc-editor-commands"><span className="gc-save-status"><i className={dirty?'changed':''}/>{dirty?'Cambios sin guardar':m.dirty?'Borrador guardado':'Sin cambios pendientes'}</span>
      <div className="gc-command-buttons"><button className="secondary" onClick={()=>{setFocus('');goPreview();}}><EditorialIcon name="preview"/>Vista previa</button>{!readOnly&&<><button type="button" disabled={!usable||!dirty} onClick={()=>act('save')}><EditorialIcon name="save"/>Guardar borrador</button>{actor.role==='ADMINISTRADOR'&&<button type="button" className="gold" disabled={!canOperate||dirty||!m.dirty} onClick={()=>act('publish')}><EditorialIcon name="publish"/>Publicar</button>}</>}</div></div>
    <p className="gc-operation-notice" role="status">{message}</p>
    {m.restoringAbsence&&<p className="gc-inactive-preview">Se restauró la versión anterior a la creación. Publicarla retirará la ficha; descartá el borrador si querés conservarla.</p>}
    {m.kind==='institution'&&<nav className="gc-editor-tabs" aria-label="Secciones de la institución">{names.map(n=><button key={n} aria-pressed={n===editTab} onClick={()=>select(n)}>{labels[n]||n}</button>)}</nav>}
    {isCity&&!['slider','destacadas'].includes(section)&&<div className="gc-editor-tabs"><button aria-pressed={slider} onClick={()=>select('Slider')}>Diapositivas</button><button aria-pressed={!slider} onClick={()=>select('Destacadas')}>Instituciones destacadas</button></div>}
    <div className={'gc-split gc-studio-split'+(isCity?' gc-city-split':'')}><section className="gc-panel gc-edit-pane">
      {isCity?<CityComposer actionTarget={cityActionTarget} key={m.key+slider} m={m} slider={slider} values={values} set={set} pick={showPicker} initial={initialPick} focus={setFocus} Field={Field} goPreview={goPreview} canEdit={usable}/>:
      isExtended?<><div className="gc-pane-heading"><span className="gc-kicker">CONTENIDO EDITORIAL</span><h2>Editar {m.kind.startsWith('event')?'evento / agenda':'servicio'}</h2></div>{m.kind==='event'&&<p className="gc-help">La agenda pública solo muestra eventos confirmados con fecha válida y lugar real. El borrador y la vista previa son privados.</p>}{names.map((n,i)=><details key={n} className="gc-chapter" open={tab===n||(!names.includes(tab)&&!i)} onToggle={e=>{if(e.currentTarget.open&&tab!==n)select(n);}}><summary><span>{String(i+1).padStart(2,'0')}</span>{labels[n]||n}</summary><fieldset disabled={!usable} className="gc-fields"><ExtendedFields definitions={groups[n]} values={values} set={set} pick={showPicker} model={m}/></fieldset></details>)}</>:
      isCareer?<><div className="gc-pane-heading"><span className="gc-kicker">CONTENIDO DE LA PÁGINA</span><h2>{m.kind==='offering'?'Editar oferta académica':'Editar carrera'}</h2></div>{names.map((n,i)=><details key={n} className="gc-chapter" open={tab===n||(!names.includes(tab)&&!i)} onToggle={e=>{if(e.currentTarget.open&&tab!==n)select(n);}}><summary><span>{String(i+1).padStart(2,'0')}</span>{labels[n]||n}</summary><fieldset disabled={!usable} className="gc-fields">{fieldList(n).map(draw)}</fieldset></details>)}</>:
      <><div className="gc-pane-heading"><span className="gc-kicker">{m.kind==='brand'?'IDENTIDAD COMPARTIDA':'EDITOR DE SEDE'}</span><h2>{labels[editTab]||editTab}</h2></div>
      {m.kind==='institution'&&editTab==='Sedes'&&<>{!!m.cityOptions?.length?<label className="gc-draft-city">Ciudad de la sede<select disabled={!usable} value={values.cityId||''} onChange={e=>set('cityId',e.target.value)}>{(m.cityOptions||[]).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select><small>Podés cambiarla antes de la primera publicación.</small></label>:<p>Estás editando los datos de la sede de <strong>{m.venue?.city}</strong>. Para mantener sus enlaces, la ciudad de una sede publicada no se modifica.</p>}<div className="gc-inline-links">{m.brandKey&&<Link href={url('sedes',m.brandKey)}>Editar identidad institucional</Link>}{!readOnly&&!m.unpublished&&<Link href={'/administrador?'+new URLSearchParams({section:'sedes',new:'sede',brand:m.venue?.brandId||''})}>+ Nueva sede en otra ciudad</Link>}</div>
      {m.siblings?.length>1&&<details className="gc-siblings"><summary>Otras sedes de esta institución</summary>{m.siblings.filter(i=>i.id!==m.id).map(i=><p key={i.id}><Link href={url('sedes',i.key,'Sedes')}>{i.name} · {i.city}</Link></p>)}</details>}</>}
      {m.kind==='institution'&&['Carreras','Destacadas'].includes(editTab)?<InstitutionCareers model={m} selected={values.featuredCareerIds||[]} change={r=>set('featuredCareerIds',r)} onlyFeatured={editTab==='Destacadas'} canEdit={usable}/>:<fieldset disabled={!usable} className="gc-fields">{fieldList(editTab).map(draw)}</fieldset>}</>}
      {readOnly?<p>Estás en modo de lectura.</p>:<div className="gc-draft-actions">{dirty&&<button className="gc-text" disabled={busy} onClick={()=>{if(confirm('¿Volver al último estado guardado? El borrador guardado se conserva.')){edit(m.patch);mark(false);notice('Cambios sin guardar descartados.');}}}>No guardar cambios</button>}{m.dirty&&!dirty&&<button className="gc-text" disabled={busy} onClick={()=>act('discard')}>Descartar borrador guardado</button>}</div>}
      {actor.role==='ADMINISTRADOR'&&historical.length>0&&<details className="gc-version-list"><summary>Versiones anteriores</summary>{historical.map(r=><p key={r.id}><button className="gc-text" disabled={busy||dirty} onClick={()=>act('restore',r.id)}>Recuperar versión anterior al {new Date(r.at).toLocaleDateString('es-AR',{timeZone:'America/Argentina/Tucuman'})}</button></p>)}</details>}
      </section>
      <section className="gc-panel gc-preview" ref={previewSection} tabIndex={-1} aria-label="Vista previa privada"><div className="gc-preview-heading"><div><p className="gc-kicker">VISTA PREVIA · PRIVADA</p><h2>{isCity?(slider?'Tu slider':'Tarjetas destacadas'):'Así se verá'}</h2></div><div className="gc-preview-sizes">{[[1280,'PC'],[768,'Tablet'],[390,'Celular']].map(([n,l])=><button key={n} aria-pressed={n===width} onClick={()=>size(n)}>{l}</button>)}</div></div><PreviewFrame width={width} preview={preview}/></section>
    </div>
    {picker&&<MediaDialog kind={picker} catalogAssets={publishedAssets} onClose={()=>setPicker(null)} onPick={src=>{lib.current(src);setPicker(null);}}/>}
  </div>;
}
function PreviewFrame({ width, preview }) {
  const frame = useRef(null),
    [mount, setMount] = useState(null);
  useEffect(() => {
    const el = frame.current;
    const sync = () => {
      const root = el?.contentDocument?.getElementById('gc-preview-root');
      if (root) setMount((old) => (old === root ? old : root));
    };
    sync();
    const ready = (event) => {
      if(event.source===el?.contentWindow && event.origin===window.location.origin && event.data==='get:private-preview-ready') sync();
    };
    window.addEventListener('message', ready);
    el?.addEventListener('load', sync);
    return () => {
      window.removeEventListener('message', ready);
      el?.removeEventListener('load', sync);
    };
  }, []);
  const wrap = useRef(),
    [available, setWidth] = useState(370);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const obs = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const scale = Math.min(1, available / width);
  return (
    <div ref={wrap} className="gc-frame-box" style={{ height: Math.ceil(780 * scale) }}>
      <iframe
        ref={frame}
        title="Vista privada del borrador"
        src="/administrador/vista-previa"
        style={{
          width,
          height: 780,
          transform: 'scale(' + scale + ')',
          transformOrigin: 'top left',
        }}
      />
      {mount && createPortal(<Preview preview={preview} />, mount)}
    </div>
  );
}
