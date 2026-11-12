import {notFound} from 'next/navigation';
import {requireAdmin} from '../../../../lib/admin/auth';
import {listEditorDocuments,loadSingletonEditor} from '../../../../lib/admin/editor-service';
import {EDITOR_TYPES} from '../../../../lib/admin/editorial-model.mjs';
import {EXTENDED_TYPES} from '../../../../lib/admin/extended-editorial.mjs';
import {consoleQuery,loadGlobal,consoleOptions} from '../../../../lib/admin/final-service';
import FinalConsole from '../../ui/FinalConsole';
import EntityList from '../../ui/EntityList';
import ExtendedEntityList from '../../ui/ExtendedEntityList';
import EntityEditor from '../../ui/EntityEditor';
export default async function AdminList({params,searchParams}){const {section}=await params,query=await searchParams,singletons={nosotros:'about','orientacion-vocacional':'orientation',menus:'navigation',footer:'footer'};const finalModes={diseno:'design',configuracion:'settings',usuarios:'users',historial:'history',seo:'seo',buscar:'search'};if(finalModes[section]){const mode=finalModes[section],{actor}=await requireAdmin(['design','settings','users'].includes(mode)?mode:mode==='seo'?'seo':'read');return <FinalConsole options={mode==='seo'?await consoleOptions():undefined} mode={mode} actor={actor} query={query} global={['design','settings'].includes(mode)?await loadGlobal(mode):null} rows={['design','settings'].includes(mode)?[]:await consoleQuery(mode,query)} metrics={mode==='seo'?await consoleQuery('seo-metrics'):null} canInvite={Boolean(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY)}/>;}if(singletons[section])return <EntityEditor initial={await loadSingletonEditor(singletons[section])}/>;if(!EDITOR_TYPES[section])notFound();const {actor}=await requireAdmin();const result=await listEditorDocuments(section,query);if(EXTENDED_TYPES[section])return <ExtendedEntityList type={section} result={result} actor={actor} {...query}/>;return <EntityList type={section} rows={result.data} count={result.count} catalog={result.catalog} actor={actor} {...query} page={Number(query.page)||1}/>;}
