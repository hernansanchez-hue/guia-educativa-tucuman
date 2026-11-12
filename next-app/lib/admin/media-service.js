import 'server-only';
import sharp from 'sharp';
import {requireAdmin} from './auth';
import {MEDIA_FORMATS,MEDIA_LIMIT,IMAGE_LIMIT,validateMediaFile} from './media-validation.mjs';
import {isUuid} from './auth-contract.mjs';
import {editorHref} from './final-model.mjs';
export async function mediaUsage(id){
 if(!isUuid(id))throw Error('Archivo no válido.');
 const {client}=await requireAdmin('media'),assets=await listMedia(),asset=assets.find(a=>a.id===id);
 if(!asset)throw Error('Archivo no disponible.');
 const contains=value=>typeof value==='string'?value===asset.url:Array.isArray(value)?value.some(contains):value&&typeof value==='object'?Object.values(value).some(contains):false;
 async function all(table,columns){const rows=[];for(let from=0;;from+=1000){const result=await client.from(table).select(columns).order(table==='cms_documents'?'id':'document_id').range(from,from+999);if(result.error)throw Error('No se pudieron cargar los usos del archivo.');rows.push(...result.data);if(result.data.length<1000)return rows;}}
 const [documents,versions]=await Promise.all([all('cms_documents','id,module_id,entity_key,draft'),all('cms_versions','document_id,version_number,snapshot')]);
 return documents.flatMap(doc=>{const draft=contains(doc.draft),history=versions.filter(v=>v.document_id===doc.id&&contains(v.snapshot));return draft||history.length?[{name:doc.draft.data?.name||doc.draft.data?.degree||({home:'Home',footer:'Footer',navigation:'Navegación'})[doc.module_id]||'Contenido de GET',href:editorHref((['brand','career','training'].includes(doc.draft._kind)?documents.find(item=>item.draft.data?.[doc.draft._kind==='brand'?'brandId':doc.draft._kind==='career'?'careerId':'trainingProgramId']===doc.draft.data.id):doc)||doc),draft,versions:history.length}]:[];});
}
export async function listMedia(){const {client}=await requireAdmin('media');const {data,error}=await client.rpc('cms_media_list');if(error)throw new Error('No se pudo cargar la biblioteca.');return data||[];}
export async function uploadMedia(file,{kind,alt=''}={}){
 const {client}=await requireAdmin('media');
 if(!(file instanceof File))throw new Error('Elegí un archivo.');
 const bytes=await file.arrayBuffer(),format=validateMediaFile({name:file.name,type:file.type,size:file.size,bytes});
 let dimensions={};if(format.kind==='image'){const metadata=await sharp(Buffer.from(bytes),{limitInputPixels:25000000}).metadata();if(!metadata.width||!metadata.height)throw new Error('Imagen no válida.');dimensions={width:metadata.width,height:metadata.height};}
 const path=`${crypto.randomUUID()}.${format.extension}`,asset={url:`/media/cms/${path}`,name:file.name.slice(0,200),kind:kind==='logo'&&format.kind==='image'?'logo':format.kind,origin:'supabase',alt:String(alt).slice(0,500),mime:format.mime,size_bytes:file.size,storage_path:path,...dimensions};
 const upload=await client.storage.from('cms-media').upload(path,bytes,{contentType:format.mime,upsert:false});if(upload.error)throw new Error('No se pudo subir el archivo.');
 const registered=await client.rpc('cms_media_mutate',{p_operation:'register',p_asset:asset});
 if(registered.error)throw new Error('El archivo se subió pero no pudo registrarse. No se borró; avisá al administrador.');
 return registered.data;
}
export async function updateMediaAlt(id,alt){const {client}=await requireAdmin('media');const {data,error}=await client.rpc('cms_media_mutate',{p_operation:'alt',p_id:id,p_asset:{alt:String(alt).slice(0,500)}});if(error)throw new Error('No se pudo guardar el texto alternativo.');return data;}
export async function deleteMedia(id){
 const {client}=await requireAdmin('delete');
 const begin=await client.rpc('cms_media_mutate',{p_operation:'begin_delete',p_id:id});if(begin.error)throw new Error('No se puede eliminar: revisá sus usos en borradores, publicaciones e historial.');
 const a=begin.data;
 if(a.storage_path){const removal=await client.storage.from('cms-media').remove([a.storage_path]);if(removal.error){await client.rpc('cms_media_mutate',{p_operation:'cancel_delete',p_id:id});throw new Error('No se pudo eliminar el archivo. Se conservó su registro.');}}
 const done=await client.rpc('cms_media_mutate',{p_operation:'finish_delete',p_id:id});if(done.error)throw new Error('La eliminación no pudo completarse. El registro quedó protegido para revisión.');
 return true;
}
/** Direct private-bucket transport; the signed capability is scoped to one new object, never a service key. */
export async function signMediaUpload(input){
 const {client}=await requireAdmin('media'),extension=String(input.name).split('.').pop().toLowerCase(),format=MEDIA_FORMATS[extension];
 if(!format||format[0]!==input.type||!Number.isSafeInteger(input.size)||input.size<1||input.size>MEDIA_LIMIT||format[1]==='image'&&input.size>IMAGE_LIMIT)throw Error('Formato o tamaño no permitido.');
 const path=crypto.randomUUID()+'.'+(extension==='jpeg'?'jpg':extension);
 const signed=await client.storage.from('cms-media').createSignedUploadUrl(path,{upsert:false});
 if(signed.error)throw Error('No se pudo autorizar la subida.');
 return {path,signedUrl:signed.data.signedUrl};
}
export async function completeMediaUpload({path,name,kind,alt=''}){
 const {client}=await requireAdmin('media');
 if(typeof path!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:jpg|png|webp|mp4|pdf|docx|txt)$/.test(path)||typeof name!=='string'||name.length>200||/<[a-z]/i.test(name))throw Error('Archivo no válido.');
 const response=await client.storage.from('cms-media').download(path);
 if(response.error)throw Error('No se pudo verificar el archivo subido.');
 const file=response.data;if(file.size>MEDIA_LIMIT)throw Error('El archivo excede el límite.');
 const bytes=await file.arrayBuffer(),format=validateMediaFile({name,type:file.type,size:file.size,bytes});
 if(path.split('.').pop()!==format.extension)throw Error('La extensión no coincide con el archivo.');
 let dimensions={};if(format.kind==='image'){const m=await sharp(Buffer.from(bytes),{limitInputPixels:25000000}).metadata();if(!m.width||!m.height)throw Error('Imagen no válida.');dimensions={width:m.width,height:m.height};}
 const {data,error}=await client.rpc('cms_media_mutate',{p_operation:'register',p_asset:{url:'/media/cms/'+path,storage_path:path,name,kind:kind==='logo'&&format.kind==='image'?'logo':format.kind,origin:'supabase',alt:String(alt).slice(0,500),mime:format.mime,size_bytes:file.size,...dimensions}});
 if(error)throw Error('No se pudo registrar. El archivo permanece privado para revisión.');return data;
}
