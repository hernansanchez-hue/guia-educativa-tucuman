"use server";
import { saveEditorBundle,createEditorEntity,editorArchive,editorDuplicate,editorUnpublish } from '../../../lib/admin/editor-service';
import {uploadMedia} from '../../../lib/admin/media-service';
import { requireAdmin } from '../../../lib/admin/auth';
import { SupabaseContentRepository } from '../../../lib/admin/supabase-content-repository.mjs';
export async function saveEditor(id,parts,publish=false){await requireAdmin(publish?'publish':'edit');try{return {ok:true,data:await saveEditorBundle(id,parts,publish)};}catch(error){return {ok:false,message:error.message};}}
export async function createEntity(type,input){await requireAdmin('edit');try{return {ok:true,data:await createEditorEntity(type,input)};}catch(error){return {ok:false,message:error.message};}}
export async function duplicateEntity(id){return editorDuplicate(id);}
export async function unpublishEntity(id){return editorUnpublish(id);}
export async function archiveEntity(id){await editorArchive(id);return {ok:true};}
export async function restoreEditorVersion(id,version,expectedRevision){const {client,actor}=await requireAdmin('restore'),repo=new SupabaseContentRepository(client,actor),doc=await repo.get(id);if(expectedRevision!=null&&doc.revision!==expectedRevision)throw new Error('El contenido cambió. Actualizá antes de restaurar.');return repo.restore(id,{version,expectedRevision:doc.revision});}
export async function uploadEditorImage(formData){const asset=await uploadMedia(formData.get('file'));return asset.url;}

