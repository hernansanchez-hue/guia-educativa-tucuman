// TEST HARNESS ONLY: no production routes import this module; no database/network writes.
import {documents,entries,load} from './fixtures';
export async function saveEditor(id,parts,publish=false){for(const p of parts){const doc=documents.find(d=>d.id===p.id);doc.draft=structuredClone(p.payload);doc.revision++;doc.state=publish?'published':'pending_changes';if(publish){doc.publishedVersion++;doc.versions.push({version:doc.publishedVersion,payload:structuredClone(p.payload),publishedAt:new Date().toISOString(),publishedBy:null});const index=entries.findIndex(e=>e.key===doc.entityKey);entries[index]={moduleId:doc.moduleId,key:doc.entityKey,payload:structuredClone(p.payload),visibility:'published'};}}return {ok:true,data:{...load(id),message:publish?'Publicado · simulación de prueba':'Borrador guardado · simulación de prueba'}};}
export async function restoreEditorVersion(){throw new Error('Restauración cubierta por los tests SQL, no por esta simulación.');}
export async function archiveEntity(){throw new Error('Archivo cubierto por los tests SQL.');}
export async function unpublishEntity(){throw new Error('Despublicación cubierta por los tests SQL.');}
export async function duplicateEntity(){throw new Error('Duplicación no conectada en el harness.');}
export async function createEntity(){return {ok:false,message:'El wizard visual no crea datos reales.'};}
export async function uploadEditorImage(){throw new Error('La prueba visual no sube archivos reales.');}
export async function logoutAction(){}
export async function globalAction(module,payload,revision,publish){const {globalFixtures}=await import('./final-fixtures');const g=globalFixtures[module];g.document.draft=structuredClone(payload);g.document.revision++;g.document.state=publish?'published':'pending_changes';return {ok:true,data:structuredClone(g)};}
export async function versionAction(id,version){const {diffValues}=await import('../../lib/admin/final-model.mjs');const d=documents.find(d=>d.id===id);return {ok:true,data:{id,version,revision:d.revision,name:d.draft.data.name||d.entityKey,changes:diffValues({},d.draft),compatible:true}};}
export async function restoreAction(){return {ok:true,data:{message:'Restauración simulada · sin escritura remota'}};}
export async function redirectAction(){return {ok:true,data:{message:'Redirección simulada · sin escritura remota'}};}
export async function inviteAction(){return {ok:false,message:'El harness no envía invitaciones.'};}
export async function userAction(){return {ok:true,data:{message:'Perfil simulado · sin escritura remota'}};}
export async function seoAction(){return {ok:true,data:{message:'Borrador SEO simulado · sin escritura remota'}};}
