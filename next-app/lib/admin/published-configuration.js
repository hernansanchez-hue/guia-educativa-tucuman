import 'server-only';
import {resolveSupabaseConfiguration} from './environment.mjs';
import {validateFinalPayload,SETTINGS_DEFAULTS} from './final-model.mjs';
export async function getSiteConfiguration(){
 const {url,key}=resolveSupabaseConfiguration(process.env);
 if(!url||!key)return {design:{},settings:SETTINGS_DEFAULTS};
 const r=await fetch(url+'/rest/v1/rpc/cms_site_configuration',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}',next:{revalidate:60,tags:['cms:site-configuration']}});
 if(!r.ok)throw Error('No se pudo consultar la configuración publicada.');
 const data=await r.json();return {design:validateFinalPayload('design',{data:data.design||{}}).data,settings:validateFinalPayload('settings',{data:data.settings||SETTINGS_DEFAULTS}).data};
}
