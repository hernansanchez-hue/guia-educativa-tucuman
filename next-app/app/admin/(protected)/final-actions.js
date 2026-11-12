'use server';
import {requireAdmin} from '../../../lib/admin/auth';
import {saveGlobal,loadVersionDiff,restoreHistory,createRedirect,inviteUser,updateUser,saveSeo} from '../../../lib/admin/final-service';
async function attempt(operation){try{return {ok:true,data:await operation()};}catch(e){return {ok:false,message:e.message||'No se pudo completar la operación.'};}}
export async function globalAction(module,payload,revision,publish){await requireAdmin(module);return attempt(()=>saveGlobal(module,payload,revision,publish));}
export async function versionAction(id,version){await requireAdmin();return attempt(()=>loadVersionDiff(id,version));}
export async function restoreAction(id,version,revision){await requireAdmin('restore');return attempt(()=>restoreHistory(id,version,revision));}
export async function redirectAction(input){await requireAdmin('publish');return attempt(()=>createRedirect(input));}
export async function inviteAction(input){await requireAdmin('users');return attempt(()=>inviteUser(input));}
export async function userAction(input){await requireAdmin('users');return attempt(()=>updateUser(input));}
export async function seoAction(id,seo,revision,publish){await requireAdmin(publish?'publish':'seo');return attempt(()=>saveSeo(id,seo,revision,publish));}
