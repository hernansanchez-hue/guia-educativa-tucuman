import { isUuid, getAdminSessionFromClient } from '../admin/auth-contract.mjs';
// Strict server boundary: Auth's verified identity, then a fresh protected membership.
export async function verifiedControlSession(client, store, {localBootstrap = false, allowMfaChallenge = false} = {}) {
  const { data, error } = await client.auth.getUser(),
    user = data?.user;
  if (error || !isUuid(user?.id) || !user.email_confirmed_at || user.is_anonymous) return null;
  const factors=(user.factors||[]).filter(f=>f.status==='verified');
  let level='aal1';
  if(factors.length) {
    const verified=await client.auth.getClaims();
    if(verified.error||verified.data?.claims?.sub!==user.id) return null;
    level=verified.data.claims.aal;
  }
  const requiresMfa=factors.length>0&&level!=='aal2';
  if(requiresMfa&&!allowMfaChallenge)return null;
  // The challenge context validates the same active database session/membership,
  // but exposes no content. It never falls back to a service-role membership lookup.
  let actor = store.sessionMember ? await store.sessionMember(client,requiresMfa) : await store.member(user.id);
  if (!actor && localBootstrap) {
    const previous = await getAdminSessionFromClient(client);
    if (
      previous.status === 'active' &&
      previous.actor.id === user.id &&
      previous.actor.role === 'SUPERADMIN'
    ) {
      await store.bootstrap(user.id, previous.actor.displayName || user.email);
      actor = await store.member(user.id);
    }
  }
  return actor?.id === user.id &&
    actor.active &&
    ['ADMINISTRADOR', 'EDITOR', 'LECTOR'].includes(actor.role)
    ? {actor,requiresMfa,level,factors:factors.map(f=>({id:f.id,type:f.factor_type,name:f.friendly_name||'Autenticador'}))}
    : null;
}
export async function verifiedMember(client,store,localBootstrap=false) {
  return (await verifiedControlSession(client,store,{localBootstrap}))?.actor||null;
}
