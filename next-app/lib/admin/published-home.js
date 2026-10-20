import 'server-only';
import {resolveSupabaseConfiguration} from './environment.mjs';
import {homeContentFromEntries, seedHomeEntry, validateHomePayload} from './home-editorial.mjs';

export async function getPublishedHomeEntry({fresh=false}={}) {
  const {url,key}=resolveSupabaseConfiguration(process.env);
  if(!url || !key) return {...seedHomeEntry(),visibility:'published'};
  const response=await fetch(`${url}/rest/v1/rpc/cms_read_published`,{
    method:'POST',headers:{apikey:key,'Content-Type':'application/json'},
    body:JSON.stringify({p_module:'home',p_entity:'main'}),
    ...(fresh?{cache:'no-store'}:{next:{revalidate:60,tags:['cms:home']}}),
  });
  if(!response.ok)throw new Error('No se pudo consultar la Home publicada.');
  const payload=await response.json();
  if(!payload)throw new Error('La Home todavía no tiene una publicación CMS activa.');
  return {moduleId:'home',key:'main',visibility:'published',payload:validateHomePayload(payload)};
}
export async function getPublishedHome(options){return homeContentFromEntries([await getPublishedHomeEntry(options)]);}
