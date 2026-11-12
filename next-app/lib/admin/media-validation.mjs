export const MEDIA_LIMIT=50*1024*1024;
export const IMAGE_LIMIT=5*1024*1024;
export const MEDIA_FORMATS={
 png:['image/png','image'],jpg:['image/jpeg','image'],jpeg:['image/jpeg','image'],webp:['image/webp','image'],
 mp4:['video/mp4','video'],pdf:['application/pdf','pdf'],docx:['application/vnd.openxmlformats-officedocument.wordprocessingml.document','document'],txt:['text/plain','document']
};
export function validateMediaFile({name,type,size,bytes}){
 const ext=String(name).split('.').pop().toLowerCase(),def=MEDIA_FORMATS[ext],b=new Uint8Array(bytes),text=(start,end)=>new TextDecoder().decode(b.slice(start,end));
 if(!def||type!==def[0]||!Number.isSafeInteger(size)||size<1||size>MEDIA_LIMIT||b.length!==size||(def[1]==='image'&&size>IMAGE_LIMIT))throw new Error('Formato o tamaño no permitido. Imágenes hasta 5 MB; videos y documentos hasta 50 MB.');
 const signature=ext==='png'?b.slice(0,8).join(',')==='137,80,78,71,13,10,26,10':ext==='jpg'||ext==='jpeg'?b[0]===255&&b[1]===216&&b[2]===255:ext==='webp'?text(0,4)==='RIFF'&&text(8,12)==='WEBP':ext==='mp4'?text(4,8)==='ftyp':ext==='pdf'?text(0,5)==='%PDF-':ext==='docx'?b[0]===80&&b[1]===75&&b[2]===3&&b[3]===4&&new TextDecoder().decode(b).includes('word/document.xml'):true;
 if(!signature)throw new Error('El contenido del archivo no coincide con su formato.');
 if(ext==='txt'){let value;try{value=new TextDecoder('utf-8',{fatal:true}).decode(b);}catch{throw new Error('El documento debe usar texto UTF-8.');}if(value.includes('\0')||/<(?:script|html|iframe)\b/i.test(value))throw new Error('Documento de texto no permitido.');}
 return {extension:ext==='jpeg'?'jpg':ext,mime:def[0],kind:def[1]};
}
export function mediaDisplayUrl(url){return url?.startsWith('/media/cms/')?url.replace('/media/cms/','/admin/media/'):url;}
export function mediaMatches(asset,filter){return !filter||filter==='all'||filter==='image'&&['image','logo'].includes(asset.kind)||asset.kind===filter;}
