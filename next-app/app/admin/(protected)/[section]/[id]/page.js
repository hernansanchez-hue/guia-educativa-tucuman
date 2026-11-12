import {notFound} from 'next/navigation';
import {loadEditor,loadSingletonEditor} from '../../../../../lib/admin/editor-service';
import {EDITOR_TYPES} from '../../../../../lib/admin/editorial-model.mjs';
import EntityEditor from '../../../ui/EntityEditor';
export default async function EditPage({params}){const {section,id}=await params,def=EDITOR_TYPES[section];if(!def)notFound();if(id==='pagina'&&['eventos','servicios'].includes(section))return <EntityEditor initial={await loadSingletonEditor(def.module)}/>;const initial=await loadEditor(id);if(initial.root.draft._kind!==def.kind)notFound();return <EntityEditor initial={initial}/>;}
