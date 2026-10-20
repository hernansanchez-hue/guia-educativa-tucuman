/** Pure policy only. The caller must obtain this profile from verified server Auth + database.
 * Never authorize from browser input or user_metadata. Auth/RLS are implemented in phase 2.
 */
export const ADMIN_ACTIONS = Object.freeze([
  "read", "edit", "preview", "media", "seo", "publish", "archive", "restore",
  "delete", "users", "design", "settings",
]);

const permissions = Object.freeze({
  SUPERADMIN: ADMIN_ACTIONS,
  ADMIN: Object.freeze(["read", "edit", "preview", "media", "seo", "publish", "archive", "restore"]),
  EDITOR: Object.freeze(["read", "edit", "preview", "media", "seo"]),
});

export function canAdmin(actor, action) {
  if (!actor || typeof actor.id !== "string" || !actor.id.trim() || actor.isActive !== true) return false;
  if (!Object.hasOwn(permissions, actor.role) || !ADMIN_ACTIONS.includes(action)) return false;
  // This override must be loaded from a protected database profile, never from a JWT user claim.
  if (actor.role === "EDITOR" && action === "publish") return actor.canPublish === true;
  return permissions[actor.role].includes(action);
}

export function requireAdminPermission(actor, action) {
  if (!canAdmin(actor, action)) throw new Error("No tenés permiso para realizar esta acción.");
}
