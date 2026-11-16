import 'server-only';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { requireSupabaseConfiguration } from '../admin/environment.mjs';
import { createSupabaseServiceClient } from '../supabase/service';
import { roles } from './domain.mjs';

export function controlMode() {
  const local =
    process.env.NODE_ENV === 'development' &&
    !process.env.NETLIFY &&
    !process.env.AWS_LAMBDA_FUNCTION_NAME;
  const mode = process.env.GET_CONTROL_STORE || (local ? 'local' : 'off');
  if (mode === 'off' || (mode === 'local' && local) || mode === 'supabase') return mode;
  throw Error('Almacenamiento del Centro de Control no válido para este entorno.');
}
let localStore;
const check = (r) => {
  if (r.error) {
    if (r.error.code === '40001') throw Error('El registro cambió. Recargá antes de guardar.');
    throw Error('El almacén del Centro no respondió. Verificá la instalación y los permisos.');
  }
  return r.data;
};
const adminDb = () => createSupabaseServiceClient();
const all = async (factory) => {
  const rows = [];
  for (let i = 0; ; i += 500) {
    const page = check(await factory().range(i, i + 499));
    rows.push(...page);
    if (page.length < 500) return rows;
  }
};
function publicDb() {
  const { url, key } = requireSupabaseConfiguration(process.env);
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
const remote = {
  async sessionMember(client,challengeOnly=false) {
    return check(await client.rpc(challengeOnly?'get_control_mfa_context':'get_control_me'));
  },
  async member(id) {
    return check(
      await adminDb()
        .from('get_control_members')
        .select('id,name,role,active')
        .eq('id', id)
        .maybeSingle(),
    );
  },
  async members() {
    return all(() =>
      adminDb().from('get_control_members').select('id,name,role,active').order('id'),
    );
  },
  async setMember(id, target, name, role, active) {
    if (!roles.includes(role)) throw Error('Rol inválido.');
    check(
      await adminDb().rpc('get_control_access', {
        actor: id,
        target,
        display_name: name,
        new_role: role,
        enabled: active,
      }),
    );
  },
  async published() {
    return all(() =>
      publicDb().from('get_control_publications').select('key,published').order('key'),
    );
  },
  async records() {
    const rows=await all(() =>
      adminDb().from('get_control_docs').select('key,revision,draft,published').order('key'),
    );
    // Only prospective new venues need to distinguish a first draft from an
    // archived-then-restored identity. An existing CRM/route cannot be relocated.
    const candidates=rows.filter(r=>!r.published?._created&&r.draft?._created?.some(e=>e.key===r.key&&e.payload?._kind==='institution'));
    for(let start=0;start<candidates.length;start+=100){
      const chunk=candidates.slice(start,start+100),keys=chunk.map(r=>r.key);
      const seen=new Set((await all(()=>adminDb().from('get_control_changes').select('id,key').eq('operation','publish').in('key',keys).order('id'))).map(e=>e.key));
      for(const r of chunk)r.hadPublication=seen.has(r.key);
    }
    return rows;
  },
  async history() {
    return check(
      await adminDb()
        .from('get_control_changes')
        .select('id,key,actor,name,operation,at')
        .order('id', { ascending: false })
        .limit(200),
    );
  },
  async write(id, key, op, revision, value, historyId, expectedCatalogRevision) {
    const guarded=expectedCatalogRevision!==undefined;
    return check(
      await adminDb().rpc(guarded?'get_control_write_checked':'get_control_write', {
        actor: id,
        entity: key,
        operation: op,
        expected_revision: revision,
        changes: value ?? null,
        history_id: historyId ?? null,
        ...(guarded?{expected_catalog_revision:expectedCatalogRevision}:{}),
      }),
    );
  },
  async change(_actor, event) {
    const db = adminDb(),
      r = check(
        await db
          .from('get_control_changes')
          .select('id,key,operation,before')
          .eq('id', event)
          .single(),
      );
    const next = check(
      await db
        .from('get_control_changes')
        .select('before')
        .eq('key', r.key)
        .gt('id', event)
        .order('id')
        .limit(1),
    );
    return {
      ...r,
      after:
        next[0]?.before ??
        check(
          await db
            .from('get_control_docs')
            .select('draft,published,revision')
            .eq('key', r.key)
            .maybeSingle(),
        ),
    };
  },
  async assets() {
    return all(() => adminDb().from('get_control_assets').select('id,name,mime,size').order('id'));
  },
  async upload(id, asset, bytes) {
    const db = adminDb();
    check(
      await db.storage
        .from('get-control-media')
        .upload(asset.id, bytes, { contentType: asset.mime, upsert: false }),
    );
    check(
      await db.rpc('get_control_register_asset', {
        actor: id,
        file_id: asset.id,
        file_name: asset.name,
        file_mime: asset.mime,
        file_size: bytes.length,
      }),
    );
  },
  async file(id) {
    const r = await adminDb().storage.from('get-control-media').download(id);
    return r.error ? null : r.data;
  },
};
export const localPath = () =>
  join(process.env.LOCALAPPDATA || homedir(), 'GET', 'centro-control', 'editorial.sqlite');
export function hasLocalContent() {
  return existsSync(localPath());
}
export async function controlStore() {
  const mode = controlMode();
  if (mode === 'supabase') return remote;
  if (mode !== 'local') throw Error('El Centro de Control no tiene almacenamiento habilitado.');
  if (!localStore) {
    const { openLocalStore } = await import('./local-store.mjs');
    localStore ??= openLocalStore(localPath());
  }
  return localStore;
}
