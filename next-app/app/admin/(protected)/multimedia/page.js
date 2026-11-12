import {requireAdmin} from '../../../../lib/admin/auth';
import {listMedia} from '../../../../lib/admin/media-service';
import MediaLibrary from '../../ui/MediaLibrary';
import {canAdmin} from '../../../../lib/admin/permissions.mjs';
import s from '../../workspace.module.css';
export default async function MediaPage(){const {actor}=await requireAdmin('media');return <section><div className={s.pageHeading}><div><span className={s.eyebrow}>CONTENIDO</span><h1>Biblioteca multimedia</h1><p>Buscá, subí y elegí imágenes, videos o documentos.</p></div></div><MediaLibrary initial={await listMedia()} canDelete={canAdmin(actor,'delete')}/></section>;}
