'use server';
import {identity,requireControl} from '../../lib/control/session';
import {enrollAuthenticator,verifyAuthenticator,MFA_UNAVAILABLE} from '../../lib/control/mfa.mjs';

export async function startMfa() {
  const session=await requireControl();
  try{return await enrollAuthenticator(session);}catch{return {ok:false,message:MFA_UNAVAILABLE};}
}
export async function confirmMfa(input) {
  const session=await identity(false,{allowMfaChallenge:true});
  try{return await verifyAuthenticator(session,input);}catch{return {ok:false,message:MFA_UNAVAILABLE};}
}
export async function cancelMfa(input) {
  const session=await requireControl();
  try{return await verifyAuthenticator(session,input,{cancel:true});}catch{return {ok:false,message:MFA_UNAVAILABLE};}
}
export async function removeMfa(input) {
  const session=await requireControl();
  try{return await verifyAuthenticator(session,input,{remove:true});}catch{return {ok:false,message:MFA_UNAVAILABLE};}
}
