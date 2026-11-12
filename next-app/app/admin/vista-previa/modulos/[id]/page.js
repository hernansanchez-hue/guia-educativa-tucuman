import {notFound} from 'next/navigation';
import {loadEditor} from '../../../../../lib/admin/editor-service';
import {EXTENDED_KINDS} from '../../../../../lib/admin/extended-editorial.mjs';
import ExtendedPreviewHost from '../../../ui/ExtendedPreviewHost';
import '../../../../[ciudad]/ciudad.css';
import '../../../../[ciudad]/[institucion]/institucion.css';
import '../../../../[ciudad]/[institucion]/carreras/[carrera]/carrera.css';
import '../../../../eventos/eventos.css';
import '../../../../servicios/servicios.css';
import '../../../../nosotros/nosotros.css';
import '../../../../nosotros/nosotros-refinement.css';
export default async function ModulePreview({params}){const {id}=await params,loaded=await loadEditor(id);if(!EXTENDED_KINDS[loaded.root.draft._kind])notFound();return <ExtendedPreviewHost id={id} entries={loaded.entries} initialParts={[loaded.root,...loaded.shared?[loaded.shared]:[]].map(d=>({moduleId:d.moduleId,key:d.entityKey,payload:d.draft}))}/>;}
