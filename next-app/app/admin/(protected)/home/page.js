import EntityEditor from '../../ui/EntityEditor';
import {loadHomeEditor} from '../../../../lib/admin/editor-service';

export default async function HomeEditorPage(){return <EntityEditor initial={await loadHomeEditor()}/>;}
