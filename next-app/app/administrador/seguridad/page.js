import {requireControl} from '../../../lib/control/session';
import MfaPanel from '../MfaPanel';
export default async function SecurityPage(){
  const session=await requireControl();
  return <MfaPanel factors={session.factors}/>;
}
