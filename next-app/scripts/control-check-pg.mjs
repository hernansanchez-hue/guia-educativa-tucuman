/** Optional isolated SQL acceptance: pass the path to PGlite's dist/index.js.
 * There is no database connection string and this script cannot modify Supabase.
 */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const mod = process.argv[2];
if (!mod) throw Error('Indicá el módulo PGlite temporal.');
const { PGlite } = await import(pathToFileURL(mod)),
  db = new PGlite();
const a = '00000000-0000-4000-a000-000000000001',
  e = '00000000-0000-4000-a000-000000000002',
  l = '00000000-0000-4000-a000-000000000003',
  session = '00000000-0000-4000-a000-000000000004';
try {
  await db.exec(`create role anon;create role authenticated;create role service_role bypassrls;
 create schema auth;create schema storage;
 create table auth.users(id uuid primary key,email_confirmed_at timestamptz,is_anonymous boolean,banned_until timestamptz);
 create table auth.sessions(id uuid,user_id uuid,not_after timestamptz);
 create function auth.jwt() returns jsonb language sql stable as $$select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb$$;
 create function auth.uid() returns uuid language sql stable as $$select (auth.jwt()->>'sub')::uuid$$;
 create table storage.buckets(id text primary key,name text,public boolean,file_size_limit int,allowed_mime_types text[]);
 grant usage on schema public to anon,authenticated,service_role;
 `);
  await db.exec(
    await readFile(new URL('../../docs/control/instalar-en-staging.sql', import.meta.url), 'utf8'),
  );
  await db.query(
    'insert into auth.users values($1,now(),false,null),($2,now(),false,null),($3,now(),false,null)',
    [a, e, l],
  );
  await db.query('insert into auth.sessions values($1,$2,null)', [session, e]);
  await db.query(
    "insert into public.get_control_members values($1,'Admin','ADMINISTRADOR',true),($2,'Edición','EDITOR',true),($3,'Lectura','LECTOR',true)",
    [a, e, l],
  );
  const write = (actor, op, revision, patch = null, version = null) =>
    db.query('select public.get_control_write($1,$2,$3,$4,$5,$6)', [
      actor,
      'oferta/aislada',
      op,
      revision,
      patch === null ? null : JSON.stringify(patch),
      version,
    ]);
  await db.exec('set role anon');
  await assert.rejects(db.query('select * from public.get_control_docs'));
  await assert.rejects(write(a, 'save', 0, {}));
  await assert.rejects(db.query('select public.get_control_me()'));
  await db.exec('set role authenticated');
  await assert.rejects(db.query('select * from public.get_control_members'));
  await assert.rejects(write(a, 'save', 0, {}));
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: e, session_id: session, user_metadata: { role: 'ADMINISTRADOR' } }),
  ]);
  assert.equal((await db.query('select public.get_control_me() as m')).rows[0].m.role, 'EDITOR');
  await db.query("select set_config('request.jwt.claims',$1,false)", [
    JSON.stringify({ sub: e, session_id: a }),
  ]);
  assert.equal((await db.query('select public.get_control_me() as m')).rows[0].m, null);
  await db.exec('set role service_role');
  await assert.rejects(write(l, 'save', 0, {}));
  await write(e, 'save', 0, { degree: 'Prueba' });
  assert.equal((await db.query('select * from public.get_control_publications')).rows.length, 0);
  await assert.rejects(write(e, 'publish', 1));
  await assert.rejects(write(a, 'publish', 0));
  await write(a, 'publish', 1);
  await db.exec('set role anon');
  assert.deepEqual(
    (await db.query('select published from public.get_control_publications')).rows[0].published,
    { degree: 'Prueba' },
  );
  await db.exec('set role service_role');
  await write(e, 'save', 2, { degree: 'Oculta', visible: false });
  await write(a, 'publish', 3);
  assert.deepEqual(
    (await db.query('select published from public.get_control_publications')).rows[0].published,
    { visible: false },
  );
  const event = (
    await db.query(
      "select id from public.get_control_changes where operation='publish' order by id desc limit 1",
    )
  ).rows[0].id;
  await write(a, 'restore', 4, null, event);
  assert.equal(
    (await db.query('select draft from public.get_control_docs')).rows[0].draft.degree,
    'Prueba',
  );
  await write(a, 'discard', 5);
  await assert.rejects(
    db.query("select public.get_control_access($1,$2,'Editor','ADMINISTRADOR',true)", [e, e]),
  );
  await db.query("select public.get_control_access($1,$2,'Editor','EDITOR',false)", [a, e]);
  await assert.rejects(write(e, 'save', 6, {}));
  await db.query(
    "select public.get_control_register_asset($1,'prueba.pdf','Ensayo','application/pdf',10)",
    [a],
  );
  await assert.rejects(
    db.query(
      "select public.get_control_register_asset($1,'denegado.pdf','Ensayo','application/pdf',10)",
      [l],
    ),
  );
  console.log(
    'PASS SQL: instalación atómica, acceso anon/authenticated, sesión revocada, roles, CAS, borrador, publicación, ocultación, historial, restore, descarte, acceso y medios.',
  );
} finally {
  await db.close();
}
