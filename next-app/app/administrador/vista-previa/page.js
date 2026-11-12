import PreviewMount from './PreviewMount';
import { requireControl } from '../../../lib/control/session';
import '../../[ciudad]/ciudad.css';
import '../../[ciudad]/approved-city.css';
import '../../components/approved/shared.css';
import '../../components/approved/profile.css';
import '../../components/approved/career.css';
import '../../servicios/servicios.css';
import '../../eventos/approved-events.css';
// This private document owns the viewport and public CSS. The authenticated editor
// mounts its React preview here; no state or credentials travel in the URL.
export default async function Page() {
  await requireControl();
  return <PreviewMount />;
}
