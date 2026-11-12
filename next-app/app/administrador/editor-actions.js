'use server';
import { revalidatePath } from 'next/cache';
import { getVersionedPublicCatalogEntries } from '../../lib/catalog/versioned-public-catalog.mjs';
import { requireControl, mailEnabled, origin } from '../../lib/control/session';
import { controlMode } from '../../lib/control/store';
import {
  permit,
  project,
  prepareContentWrite,
  referencedMedia,
  roles,
} from '../../lib/control/domain.mjs';
import { assemble, makeEditor } from '../../lib/control/workspace.mjs';
import { prepareCreation, epoch, CREATED } from '../../lib/control/creation.mjs';
import { isUuid, validateEmail } from '../../lib/admin/auth-contract.mjs';
import { createSupabaseServiceClient } from '../../lib/supabase/service';
import { validateMediaFile } from '../../lib/admin/media-validation.mjs';
import { getLegacyExtendedPublishedEntries } from '../../lib/admin/published-extended';
import {namespaceExtended} from '../../lib/control/extended.mjs';
import {changeCommercialInboxStatus} from '../../lib/control/commercial-inbox-server';
export async function changeInboxStatus(input){
  const session=await requireControl('save');
  try{
    const result=await changeCommercialInboxStatus(session,input);
    revalidatePath('/administrador');
    return result;
  }catch{return {ok:false,message:'No se pudo actualizar la consulta. Recargá y verificá tus permisos.'};}
}
async function base() {
  return [
    ...getVersionedPublicCatalogEntries(),
    ...namespaceExtended(await getLegacyExtendedPublishedEntries(['trainings','events','services'],{fresh:true})),
  ];
}
export async function openEditor(key) {
  const { actor, store } = await requireControl();
  return makeEditor(assemble(await base(), await store.records(actor.id)), key);
}
export async function createDraft(input) {
  const {actor,store}=await requireControl('save');
  try {
    permit(actor,'save');
    const [entries,rows]=await Promise.all([base(),store.records(actor.id)]);
    const {key,draft}=prepareCreation(input,project(entries,rows,true),project(entries,rows));
    await store.write(actor.id,key,'save',0,draft,null,epoch(rows));
    return {ok:true,key};
  } catch(e) { return {ok:false,message:e.message}; }
}
export async function changeContent({ key, op, patch, revision, version }) {
  if (!['save', 'publish', 'discard', 'restore'].includes(op))
    throw Error('Operación desconocida.');
  const { actor, store } = await requireControl(op);
  permit(actor, op);
  try {
    const [entries, rows] = await Promise.all([base(),store.records(actor.id)]);
    const {value:candidate,removed,generation}=prepareContentWrite(entries,rows,actor,{key,op,patch,revision});
    if (op === 'save' || op === 'publish') {
      const refs = referencedMedia(candidate);
      if (refs.size) {
        const ids = new Set((await store.assets(actor.id)).map((a) => a.id));
        if ([...refs].some((id) => !ids.has(id)))
          throw Error('Uno de los archivos no existe en la biblioteca.');
      }
    }
    await store.write(actor.id, key, op, revision, candidate, version,generation);
    if (op === 'publish') revalidatePath('/', 'layout');
    return { ok: true,removed };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}
export async function library() {
  const { actor, store } = await requireControl();
  return store.assets(actor.id);
}
export async function upload(form) {
  const { actor, store } = await requireControl('media');
  try {
    const f = form.get('file');
    if (
      !(f instanceof File) ||
      f.size > 5 * 1024 * 1024 ||
      !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(f.type)
    )
      throw Error('Elegí JPG, PNG, WebP o PDF de hasta 5 MB.');
    const bytes = Buffer.from(await f.arrayBuffer()),
      fmt = validateMediaFile({ name: f.name, type: f.type, size: f.size, bytes });
    if (fmt.kind === 'image') {
      const { default: sharp } = await import('sharp');
      const img = await sharp(bytes, { limitInputPixels: 25000000 }).metadata();
      if (!img.width || !img.height) throw Error('Imagen no válida.');
    }
    const asset = {
      id: crypto.randomUUID() + '.' + fmt.extension,
      name: f.name.slice(0, 180),
      mime: f.type,
      size: f.size,
    };
    await store.upload(actor.id, asset, bytes);
    return { ok: true, asset };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}
export async function activityDetail(id) {
  const { actor, store } = await requireControl();
  if (!Number.isSafeInteger(id) || id < 1) throw Error('Registro inválido.');
  const r = await store.change(actor.id, id);
  if (!['save', 'discard', 'publish', 'restore'].includes(r.operation)) return [];
  const previous =
    (r.operation === 'publish' ? r.before?.published : r.before?.draft) ??
    r.before?.published ??
    {};
  const after =
    (r.operation === 'publish' ? r.after?.published : r.after?.draft) ?? r.after?.published ?? {};
  return [...new Set([...Object.keys(previous), ...Object.keys(after)])]
    .filter((k) => JSON.stringify(previous[k]) !== JSON.stringify(after[k]))
    .map((k) => k===CREATED?{campo:'Alta de contenido',antes:previous[k]?.length?'Registro creado':null,despues:after[k]?.length?'Registro creado':null}:{ campo: k, antes: previous[k] ?? null, despues: after[k] ?? null });
}
export async function recoverMember(id) {
  const { actor, store, client } = await requireControl('users');
  if (!mailEnabled() || controlMode() !== 'supabase')
    return { ok: false, message: 'Envío de correos deshabilitado en este entorno.' };
  if (!isUuid(id) || !(await store.member(id))?.active)
    return { ok: false, message: 'Miembro no activo.' };
  const target = await createSupabaseServiceClient().auth.admin.getUserById(id);
  if (target.error || !target.data.user?.email_confirmed_at)
    return { ok: false, message: 'Identidad no confirmada.' };
  permit(actor, 'users');
  const { error } = await client.auth.resetPasswordForEmail(target.data.user.email, {
    redirectTo: origin() + '/administrador/callback',
  });
  return {
    ok: !error,
    message: error
      ? 'No se pudo solicitar la recuperación.'
      : 'Se solicitó un enlace oficial de recuperación.',
  };
}
export async function users() {
  const { actor, store } = await requireControl('users');
  return store.members(actor.id);
}
export async function changeAccess({ id, name, role, active, email, invite = false }) {
  const { actor, store } = await requireControl('users');
  if (
    !roles.includes(role) ||
    typeof name !== 'string' ||
    !name.trim() ||
    name.length > 160 ||
    typeof active !== 'boolean'
  )
    return { ok: false, message: 'Revisá el perfil.' };
  try {
    if (invite) {
      if (!mailEnabled() || controlMode() !== 'supabase')
        throw Error('Invitaciones deshabilitadas en este entorno. No se envió correo.');
      if (!validateEmail(email)) throw Error('Correo no válido.');
      const svc = createSupabaseServiceClient(),
        r = await svc.auth.admin.inviteUserByEmail(email, {
          redirectTo: origin() + '/administrador/callback',
        });
      if (r.error || !r.data?.user)
        throw Error('No se pudo enviar la invitación. Si ya existe, usá su UUID confirmado.');
      id = r.data.user.id;
    } else if (!isUuid(id)) throw Error('UUID de Auth inválido.');
    else if (!(await store.member(id))) {
      const r = await createSupabaseServiceClient().auth.admin.getUserById(id);
      if (r.error || r.data.user?.id !== id || !r.data.user.email_confirmed_at)
        throw Error('No se pudo comprobar esa identidad confirmada.');
    }
    await store.setMember(actor.id, id, name.trim(), role, active);
    return { ok: true };
  } catch (e) {
    return { ok: false, message: e.message };
  }
}
