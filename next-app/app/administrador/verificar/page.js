import {redirect} from 'next/navigation';
import {identity} from '../../../lib/control/session';
import MfaPanel from '../MfaPanel';
export default async function ChallengePage(){
  const session=await identity(false,{allowMfaChallenge:true});
  if(!session)redirect('/administrador/login');
  if(!session.requiresMfa)redirect('/administrador/seguridad');
  return <MfaPanel challenge factors={session.factors}/>;
}
