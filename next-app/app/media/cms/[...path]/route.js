import { createClient } from '@supabase/supabase-js';
import { requireSupabaseConfiguration } from '../../../../lib/admin/environment.mjs';
import {CMS_MEDIA_PATH,mediaResponse} from '../../../../lib/admin/media-response.mjs';
export async function GET(request,{params}){
 const {path}=await params;if(path.length!==1||!CMS_MEDIA_PATH.test(path[0]))return new Response(null,{status:404});
 const {url,key}=requireSupabaseConfiguration(process.env),client=createClient(url,key,{auth:{persistSession:false}});
 const {data,error}=await client.storage.from('cms-media').download(path[0]);if(error)return new Response(null,{status:404});
 return mediaResponse(request,data);
}
