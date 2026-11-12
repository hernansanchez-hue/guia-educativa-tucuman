import { isUuid, getAdminSessionFromClient } from '../admin/auth-contract.mjs';
// Strict server boundary: Auth's verified identity, then a fresh protected membership.
export async function verifiedMember(client, store, localBootstrap = false) {
  const { data, error } = await client.auth.getUser(),
    user = data?.user;
  if (error || !isUuid(user?.id) || !user.email_confirmed_at || user.is_anonymous) return null;
  let actor = store.sessionMember ? await store.sessionMember(client) : await store.member(user.id);
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
    ? actor
    : null;
}
