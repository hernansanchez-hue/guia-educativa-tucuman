import { mailEnabled } from '../../../lib/control/session';
import AuthPanel from '../AuthPanel';
export default function Page() {
  return <AuthPanel mode="recover" enabled={mailEnabled()} />;
}
