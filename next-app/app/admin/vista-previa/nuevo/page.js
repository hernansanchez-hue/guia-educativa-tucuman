import {notFound} from 'next/navigation';
import {requireAdmin} from '../../../../lib/admin/auth';
import {getPublishedEditorialEntries} from '../../../../lib/admin/published-editorial';
import {editorialCatalog,EDITOR_TYPES} from '../../../../lib/admin/editorial-model.mjs';
import {newEditorialPreview} from '../../../../lib/admin/new-editorial-preview.mjs';
import ExtendedPreviewHost from '../../ui/ExtendedPreviewHost';
import {getExtendedPublishedEntries} from '../../../../lib/admin/published-extended';
import '../../../eventos/eventos.css';
import '../../../servicios/servicios.css';
import '../../../nosotros/nosotros.css';
import PreviewHost from '../../ui/PreviewHost';
import '../../../[ciudad]/ciudad.css';
import '../../../[ciudad]/[institucion]/institucion.css';
import '../../../[ciudad]/[institucion]/carreras/[carrera]/carrera.css';
export default async function NewPreview({searchParams}){await requireAdmin('preview');const {tipo}=await searchParams;if(!EDITOR_TYPES[tipo])notFound();const entries=await getPublishedEditorialEntries({fresh:true});if(['eventos','servicios'].includes(tipo))return <ExtendedPreviewHost id={`nuevo-${tipo}`} entries={[...entries,...await getExtendedPublishedEntries(undefined,{fresh:true})]} initialParts={newEditorialPreview(tipo,{},editorialCatalog(entries))}/>;return <PreviewHost id={`nuevo-${tipo}`} entries={entries} initialParts={newEditorialPreview(tipo,{},editorialCatalog(entries))}/>;}
