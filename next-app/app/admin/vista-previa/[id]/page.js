import {notFound} from 'next/navigation';
import {loadEditor} from '../../../../lib/admin/editor-service';
import PreviewHost from '../../ui/PreviewHost';
import '../../../[ciudad]/ciudad.css';
import '../../../[ciudad]/[institucion]/institucion.css';
import '../../../[ciudad]/[institucion]/carreras/[carrera]/carrera.css';
export default async function PreviewPage({params}){const {id}=await params;const loaded=await loadEditor(id);if(!['city','institution','offering'].includes(loaded.root.draft._kind))notFound();const initialParts=[loaded.root,...loaded.shared?[loaded.shared]:[]].map(d=>({moduleId:d.moduleId,key:d.entityKey,payload:d.draft}));return <PreviewHost id={id} initialParts={initialParts} entries={loaded.entries}/>;}
