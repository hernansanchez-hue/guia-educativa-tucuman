import {loadHomeEditor} from '../../../../lib/admin/editor-service';
import PreviewHost from '../../ui/PreviewHost';
import '../../../home-map.css';

// Isolated public stylesheet: institution/city CSS must not override the special Home.
export default async function HomePreviewPage(){
  const {root,entries,homeMapCatalog}=await loadHomeEditor();
  return <PreviewHost id={root.id} entries={entries} homeMapCatalog={homeMapCatalog} initialParts={[{moduleId:root.moduleId,key:root.entityKey,payload:root.draft}]}/>;
}
