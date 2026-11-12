import {requireAdmin} from '../../../../lib/admin/auth';
import {CMS_MEDIA_PATH,mediaResponse} from '../../../../lib/admin/media-response.mjs';
export async function GET(request,{params}){
 const {client}=await requireAdmin('media'),{path}=await params;
 if(path.length!==1||!CMS_MEDIA_PATH.test(path[0]))return new Response(null,{status:404});
 const {data,error}=await client.storage.from('cms-media').download(path[0]);if(error)return new Response(null,{status:404});
 return mediaResponse(request,data,true);
}
