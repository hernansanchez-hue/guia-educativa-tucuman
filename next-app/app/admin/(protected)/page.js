import { requireAdmin } from "../../../lib/admin/auth";
import {consoleQuery} from '../../../lib/admin/final-service';
import Dashboard from '../ui/Dashboard';
export default async function AdminPage() {
  const { actor,client } = await requireAdmin();
  const summary=await consoleQuery('summary');
  const metrics=[];
  for(const [kind,label,icon]of [['city','Ciudades','city'],['institution','Sedes institucionales','building'],['offering','Ofertas de carrera','book'],['event','Eventos','clock'],['service','Servicios','grid'],['training-offering','Capacitaciones','book']]){
   metrics.push({label,icon,value:summary.kinds[kind]||0,note:'Contenido administrable'});
  }
  for(const [state,label]of [['draft','Borradores'],['pending_changes','Cambios pendientes']]){metrics.push({label,icon:'clock',value:summary.states[state]||0,note:'Sin publicar'});}
  metrics.push({label:'Multimedia',icon:'grid',value:summary.media||0,note:'Recursos reutilizables'});
  const {data:activity,error:activityError}=await client.from('cms_audit_logs').select('id,action,entity_type,created_at').order('created_at',{ascending:false}).limit(7);
  if(activityError)throw new Error('No se pudo cargar la actividad.');
  const cityResult=await client.from('cms_documents').select('id,draft').eq('module_id','cities').eq('draft->>_kind','city').neq('state','archived');
  if(cityResult.error)throw new Error('No se pudieron cargar las ciudades.');
  return <Dashboard cities={(cityResult.data||[]).map(row=>({id:row.id,name:row.draft.data.name}))} metrics={metrics} activity={(activity||[]).map(a=>({...a,label:({home:'Home',cities:'Ciudades',institutions:'Instituciones',careers:'Carreras',events:'Eventos',services:'Servicios',trainings:'Capacitaciones',about:'Nosotros',orientation:'Orientación',navigation:'Menús',footer:'Footer',media:'Multimedia'})[a.entity_type]||'Equipo GET'}))} actor={actor}/>;
}
