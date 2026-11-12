import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {resolveSupabaseConfiguration} from "./lib/admin/environment.mjs";
import {localRoute} from "./lib/admin/final-model.mjs";
import { requireSupabaseConfiguration } from "./lib/admin/environment.mjs";
import { isAdminPath } from "./lib/admin/auth-contract.mjs";
import {contentSecurityPolicy} from './lib/security/headers.mjs';

function privateResponse(response) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  response.headers.set("Referrer-Policy", "same-origin");
  response.headers.set("Content-Security-Policy", contentSecurityPolicy(process.env.NODE_ENV === 'development'));
  return response;
}
let redirectCache={until:0,rows:[]};
async function publicRedirect(request){
 const path=request.nextUrl.pathname;if(path==='/')return null;
 const {url,key}=resolveSupabaseConfiguration(process.env);if(!url||!key)return null;
 if(Date.now()>redirectCache.until){
  try{const r=await fetch(url+'/rest/v1/rpc/cms_redirect_map',{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}',cache:'no-store',signal:AbortSignal.timeout(5000)});if(r.ok)redirectCache={until:Date.now()+60000,rows:await r.json()};else redirectCache.until=Date.now()+10000;}catch{redirectCache.until=Date.now()+10000;}
 }
 const record=redirectCache.rows.find(r=>r.source===path);
 return record&&(localRoute(record.destination)||record.destination==='/')&&[301,302,307,308].includes(record.status)?NextResponse.redirect(new URL(record.destination,request.url),record.status):null;
}
export async function proxy(request) {
 const pathName=request.nextUrl.pathname;
 if(isAdminPath(pathName)){
  // Preserve legacy sources, but never serve a second management interface.
  if(!['GET','HEAD'].includes(request.method))return privateResponse(new NextResponse(null,{status:404}));
  const target=new URL('/administrador',request.url);
  if(['/admin/callback','/admin/confirmar'].includes(pathName)){target.pathname='/administrador/callback';target.search=request.nextUrl.search;}
  return privateResponse(NextResponse.redirect(target));
 }
 if(/^\/administrador(?:\/|$)/.test(pathName)){
  let res=NextResponse.next({request});let config;
  if(pathName==='/administrador/callback'){const guarded=privateResponse(res);guarded.headers.set('Referrer-Policy','no-referrer');return guarded;}
  if(!request.cookies.getAll().some(c=>c.name.startsWith('get-control-session')))return privateResponse(res);
  try{config=requireSupabaseConfiguration(process.env);}catch{return privateResponse(res);}
  const session=createServerClient(config.url,config.key,{cookieOptions:{name:'get-control-session',path:'/administrador',httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production'},cookies:{
   getAll:()=>request.cookies.getAll(),setAll(items){for(const {name,value} of items)request.cookies.set(name,value);res=NextResponse.next({request});for(const {name,value,options} of items)res.cookies.set(name,value,options);}
  }});
  await session.auth.getClaims();
  return privateResponse(res);
 }
 return (await publicRedirect(request))||NextResponse.next();
}
export const config = { matcher: ["/((?!_next/|assets/|media/|api/|favicon.ico|robots.txt|sitemap.xml).*)"] };
