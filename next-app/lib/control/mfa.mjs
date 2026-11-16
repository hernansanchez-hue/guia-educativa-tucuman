import {isUuid} from '../admin/auth-contract.mjs';

export const MFA_UNAVAILABLE='No se pudo verificar el segundo factor. Volvé a iniciar sesión o intentá más tarde.';
const safeCode=value=>typeof value==='string'&&/^\d{6}$/.test(value);

// Session supplied only by the server DAL. No service key, password, JWT or
// provider diagnostic is returned. QR/secret goes only to its authenticated owner.
export async function enrollAuthenticator(session) {
  if(!session||session.requiresMfa) return {ok:false,message:MFA_UNAVAILABLE};
  const result=await session.client.auth.mfa.enroll({factorType:'totp',issuer:'GET Centro de Control',friendlyName:'GET '+new Date().toISOString()});
  if(result.error||!isUuid(result.data?.id)||!result.data?.totp?.qr_code)return {ok:false,message:'No se pudo preparar el autenticador. Revisá que TOTP esté habilitado e intentá nuevamente.'};
  return {ok:true,id:result.data.id,qr:result.data.totp.qr_code,secret:result.data.totp.secret};
}

export async function verifyAuthenticator(session,input,{remove=false,cancel=false}={}) {
  if(!session||!isUuid(input?.id)||(!cancel&&!safeCode(input?.code)))return {ok:false,message:'Ingresá los seis dígitos de tu aplicación autenticadora.'};
  const {data,error}=await session.client.auth.mfa.listFactors();
  const own=data?.all?.find(f=>f.id===input.id&&f.factor_type==='totp');
  if(error||!own)return {ok:false,message:MFA_UNAVAILABLE};
  if(cancel) {
    // Cancelling is only possible for an unverified factor; never an MFA bypass.
    if(session.requiresMfa||own.status==='verified')return {ok:false,message:MFA_UNAVAILABLE};
    const result=await session.client.auth.mfa.unenroll({factorId:own.id});
    return result.error?{ok:false,message:MFA_UNAVAILABLE}:{ok:true};
  }
  if(session.requiresMfa&&own.status!=='verified')return {ok:false,message:MFA_UNAVAILABLE};
  if(remove&&session.requiresMfa)return {ok:false,message:MFA_UNAVAILABLE};
  const checked=await session.client.auth.mfa.challengeAndVerify({factorId:own.id,code:input.code});
  if(checked.error)return {ok:false,message:'Código no válido o vencido. Revisá el código actual de tu autenticador.'};
  // Verify the new JWT before admitting any protected operation.
  const claims=await session.client.auth.getClaims();
  if(claims.error||claims.data?.claims?.sub!==session.actor.id||claims.data.claims.aal!=='aal2')return {ok:false,message:MFA_UNAVAILABLE};
  if(remove) {
    if((await session.client.auth.mfa.unenroll({factorId:own.id})).error)return {ok:false,message:MFA_UNAVAILABLE};
    if((await session.client.auth.refreshSession()).error)return {ok:false,message:MFA_UNAVAILABLE};
  }
  return {ok:true};
}
