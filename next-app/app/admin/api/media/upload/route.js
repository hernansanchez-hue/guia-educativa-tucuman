import {uploadMedia} from '../../../../../lib/admin/media-service';
import {requireAdmin} from '../../../../../lib/admin/auth';
import {MEDIA_LIMIT} from '../../../../../lib/admin/media-validation.mjs';
export async function POST(request){
 if(request.headers.get('origin')!==process.env.GET_ADMIN_ORIGIN)return new Response(null,{status:403});
 await requireAdmin('media');
 const length=Number(request.headers.get('content-length'));if(!length||length>MEDIA_LIMIT+65536)return Response.json({message:'El archivo excede el límite permitido.'},{status:413});
 try{const form=await request.formData();return Response.json(await uploadMedia(form.get('file'),{kind:form.get('kind'),alt:form.get('alt')}));}catch(e){return Response.json({message:e.message},{status:400});}
}
