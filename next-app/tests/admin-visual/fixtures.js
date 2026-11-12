import {seedExtendedEntries} from '../../lib/admin/extended-editorial.mjs';
import {seedHomeEntry} from '../../lib/admin/home-editorial.mjs';
import {getLocalHomeMapCatalog} from '../../lib/public-catalog/home-map-catalog.js';
import {seedEditorialEntries,editorialCatalog} from '../../lib/admin/editorial-model.mjs';
export const actor={id:'00000000-0000-4000-8000-000000000001',displayName:'Equipo GET · Prueba visual',role:'SUPERADMIN',isActive:true,canPublish:false};
export const entries=[...seedEditorialEntries(),seedHomeEntry(),...seedExtendedEntries()];
export const documents=entries.map((e,n)=>({id:`00000000-0000-4000-8000-${String(n+10).padStart(12,'0')}`,moduleId:e.moduleId,entityKey:e.key,draft:structuredClone(e.payload),state:'published',revision:1,publishedVersion:1,updatedAt:'2026-10-12T15:00:00Z',versions:[{version:1,payload:structuredClone(e.payload),publishedAt:'2026-10-12T15:00:00Z',publishedBy:null}]}));
export function load(id){const root=documents.find(d=>d.id===id),p=root.draft;const key=p._kind==='institution'?`marca/${p.data.brandId}`:p._kind==='offering'?`carrera/${p.data.careerId}`:p._kind==='training-offering'?`training/${p.data.trainingProgramId}`:null;return structuredClone({root,shared:documents.find(d=>d.entityKey===key)||null,entries,actor,relatedDocuments:p._kind==='institution'?documents.filter(d=>d.draft._kind==='offering'&&d.draft.data.institutionId===p.data.id):[],...(p._kind==='home'?{homeMapCatalog:getLocalHomeMapCatalog()}:{})});}
export const catalog=()=>editorialCatalog(entries);
