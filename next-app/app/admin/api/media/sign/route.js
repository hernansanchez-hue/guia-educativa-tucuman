import {signMediaUpload} from '../../../../../lib/admin/media-service';
import {requireAdmin} from '../../../../../lib/admin/auth';
export async function POST(request){
 if(request.headers.get('origin')!==process.env.GET_ADMIN_ORIGIN)return new Response(null,{status:403});
 await requireAdmin('media');const length=Number(request.headers.get('content-length'));if(!length||length>4096)return Response.json({message:'Solicitud no válida.'},{status:413});
 try{return Response.json(await signMediaUpload(await request.json()));}catch(e){return Response.json({message:e.message||'No se pudo procesar el archivo.'},{status:400});}
}
