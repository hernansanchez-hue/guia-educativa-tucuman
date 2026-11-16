import 'server-only';
import {createHmac} from 'node:crypto';
import {join,dirname} from 'node:path';
import {createSupabaseServiceClient} from '../supabase/service';
import {inspectAdminEnvironment} from '../admin/environment.mjs';
import {localPath} from './store';
import {validCommercialEvidence} from '../privacy/commercial-consent.mjs';
import {contactStoreMode,permitCommercialInbox,inboxQuery,validateStatusChange,openLocalCommercialInbox,contactFingerprint} from './commercial-inbox.mjs';

let localInbox;
const local = () => localInbox ??= openLocalCommercialInbox(join(dirname(localPath()),'commercial-inbox.sqlite')).catch(error=>{localInbox=null;throw error;});
const unavailable = () => ({available:false,rows:[],total:0,page:1,pageSize:20,message:'La bandeja comercial todavía no está habilitada en este entorno.'});
function remoteConfigured() {
  // Existing project guard pins this to get-definitivo, never GET Instituciones.
  return inspectAdminEnvironment(process.env).configured;
}
export function commercialContactPersistence() {
  const mode=contactStoreMode();
  if (mode==='off' || (mode==='supabase' && (!remoteConfigured() || !(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY)))) return null;
  return {
    async receive(key,payload,address,evidence) {
      if (!validCommercialEvidence(evidence)) return {status:400};
      // Salted daily fingerprint: no raw IP is persisted or returned.
      const salt=mode==='supabase' ? (process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY) : 'local-development-inbox';
      const rateKey=createHmac('sha256',salt).update(new Date().toISOString().slice(0,10)+'|'+address).digest('hex');
      if(mode==='local')return (await local()).receive(key,payload,rateKey,evidence);
      const {data,error}=await createSupabaseServiceClient().rpc('get_commercial_contact_receive',{
        p_key:key,p_fingerprint:contactFingerprint(payload),p_payload:payload,p_rate_key:rateKey,p_consent:evidence,
      });
      if (error) return {status:503};
      return data?.status===201 && typeof data.receiptId==='string' ? {status:201,receiptId:data.receiptId} : {status:[409,429].includes(data?.status)?data.status:503};
    },
  };
}

export async function loadCommercialInbox(session,query={}) {
  permitCommercialInbox(session?.actor);
  const mode=contactStoreMode(),opts=inboxQuery(query);
  if(mode==='off')return unavailable();
  if(mode==='local')return (await local()).list(session.actor,opts);
  if(!remoteConfigured())return unavailable();
  // Use the human session here: RLS and get_control_private.me() remain decisive.
  const {data,error}=await session.client.rpc('get_commercial_contact_list',{p_query:opts.q,p_status:opts.status,p_page:opts.page});
  if(error||!data||!Array.isArray(data.rows))return {...unavailable(),message:'No se pudo abrir la bandeja. Verificá su instalación y los permisos.'};
  return {available:true,rows:data.rows,total:data.total,page:opts.page,pageSize:opts.pageSize,q:opts.q,status:opts.status};
}

export async function changeCommercialInboxStatus(session,input) {
  permitCommercialInbox(session?.actor);
  const request=validateStatusChange(input),mode=contactStoreMode();
  if(mode==='local')return (await local()).change(session.actor,request);
  if(mode!=='supabase'||!remoteConfigured()||process.env.GET_CONTROL_WRITES_ENABLED!=='true')throw Error('Las escrituras de la bandeja no están habilitadas.');
  const {data,error}=await session.client.rpc('get_commercial_contact_status',{p_id:request.id,p_status:request.status,p_expected_revision:request.expectedRevision});
  if(error)throw Error(error.code==='40001'?'La consulta cambió. Recargá antes de guardar.':'No se pudo confirmar el cambio de estado.');
  if(data?.ok!==true)throw Error('No se pudo confirmar el cambio de estado.');
  return data;
}
