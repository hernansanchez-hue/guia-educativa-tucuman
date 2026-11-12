"use server";
import { getContentRepository } from "../../../lib/admin/repositories";
import { listAdminProfiles, manageAdminProfile, inviteAdminIdentity } from "../../../lib/admin/users";

export async function createDraft(input) { return (await getContentRepository("edit")).create(input); }
export async function saveDraft(id, input) { return (await getContentRepository("edit")).save(id, input); }
export async function publishDraft(id, input) { return (await getContentRepository("publish")).publish(id, input); }
export async function restoreVersion(id, input) { return (await getContentRepository("restore")).restore(id, input); }
export async function archiveDocument(id, input) { return (await getContentRepository("archive")).archive(id, input); }
export async function unpublishDocument(id, input) { return (await getContentRepository("publish")).unpublish(id, input); }
export async function getPreviewData(id, payload) { return (await getContentRepository("preview")).preview(id, payload); }
export async function getAdmins() { return listAdminProfiles(); }
export async function saveAdminProfile(input) { return manageAdminProfile(input); }
export async function inviteAdmin(email) { return inviteAdminIdentity(email); }
