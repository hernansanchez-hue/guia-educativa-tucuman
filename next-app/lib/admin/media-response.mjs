export const CMS_MEDIA_PATH=/^[a-f0-9-]+\.(jpg|png|webp|mp4|pdf|docx|txt)$/;
export function mediaResponse(request,data,privateMedia=false){
 const download=!data.type.startsWith('image/')&&!data.type.startsWith('video/');
 const headers={'Content-Type':data.type||'application/octet-stream','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox",'Cache-Control':privateMedia?'private, no-store':'public, max-age=60','Accept-Ranges':'bytes'};
 if(download)headers['Content-Disposition']='attachment';
 const range=request.headers.get('range');if(range){const found=/^bytes=(\d+)-(\d*)$/.exec(range);if(!found)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.size}`}});
 const start=Number(found[1]),end=Math.min(found[2]?Number(found[2]):data.size-1,data.size-1);if(start> end||start>=data.size)return new Response(null,{status:416,headers:{'Content-Range':`bytes */${data.size}`}});return new Response(data.slice(start,end+1),{status:206,headers:{...headers,'Content-Range':`bytes ${start}-${end}/${data.size}`,'Content-Length':String(end-start+1)}});}
 return new Response(data,{headers:{...headers,'Content-Length':String(data.size)}});
}
