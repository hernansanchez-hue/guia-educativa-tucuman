import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { permit, roles, transition } from './domain.mjs';
import { publicSnapshot } from './creation.mjs';

export function openLocalStore(path) {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
 CREATE TABLE IF NOT EXISTS members(id TEXT PRIMARY KEY,name TEXT NOT NULL,role TEXT NOT NULL,active INTEGER NOT NULL);
 CREATE TABLE IF NOT EXISTS docs(key TEXT PRIMARY KEY,revision INTEGER NOT NULL,draft TEXT,published TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS changes(id INTEGER PRIMARY KEY, key TEXT NOT NULL,actor TEXT NOT NULL,name TEXT NOT NULL,operation TEXT NOT NULL,at TEXT NOT NULL,before TEXT NOT NULL);
 CREATE INDEX IF NOT EXISTS changes_key ON changes(key,id DESC);
 CREATE TABLE IF NOT EXISTS assets(id TEXT PRIMARY KEY,name TEXT NOT NULL,mime TEXT NOT NULL,size INTEGER NOT NULL,bytes BLOB NOT NULL);`);
  const tx = (fn) => {
    db.exec('BEGIN IMMEDIATE');
    try {
      const v = fn();
      db.exec('COMMIT');
      return v;
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  };
  const parse = (r) =>
    r && {
      ...r,
      draft: r.draft === null ? null : JSON.parse(r.draft),
      published: JSON.parse(r.published),
    };
  const member = (id) => {
    const r = db.prepare('SELECT * FROM members WHERE id=?').get(id);
    return r && { ...r, active: !!r.active };
  };
  const actor = (id, op) => {
    const a = member(id);
    permit(a, op);
    return a;
  };
  const record = (k) => parse(db.prepare('SELECT * FROM docs WHERE key=?').get(k));
  const audit = (k, a, op, before) =>
    db
      .prepare('INSERT INTO changes(key,actor,name,operation,at,before) VALUES(?,?,?,?,?,?)')
      .run(k, a.id, a.name, op, new Date().toISOString(), JSON.stringify(before));
  return {
    close: () => db.close(),
    member,
    bootstrap(id, name) {
      return tx(() => {
        if (db.prepare('SELECT 1 FROM members LIMIT 1').get()) return false;
        db.prepare('INSERT INTO members VALUES(?,?,?,1)').run(id, name, 'ADMINISTRADOR');
        return true;
      });
    },
    members(id) {
      actor(id, 'users');
      return db
        .prepare('SELECT * FROM members ORDER BY name')
        .all()
        .map((r) => ({ ...r, active: !!r.active }));
    },
    setMember(id, target, name, role, active) {
      return tx(() => {
        const a = actor(id, 'users');
        if (id === target || !roles.includes(role) || typeof active !== 'boolean')
          throw Error('Operación de acceso no permitida.');
        const old = member(target);
        db.prepare(
          'INSERT INTO members VALUES(?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,role=excluded.role,active=excluded.active',
        ).run(target, name, role, +active);
        audit('usuario/' + target, a, 'member', old ?? null);
      });
    },
    records(id) {
      actor(id, 'read');
      return db.prepare("SELECT d.*, EXISTS (SELECT 1 FROM changes h WHERE h.key=d.key AND h.operation='publish') AS hadPublication FROM docs d ORDER BY d.key").all().map(parse);
    },
    published() {
      return db
        .prepare("SELECT key,published FROM docs WHERE published<>'{}'")
        .all()
        .map((r) => ({
          key: r.key,
          published:publicSnapshot(r.key,JSON.parse(r.published)),
        }));
    },
    write(id, key, op, revision, value, historyId, expectedCatalogRevision) {
      return tx(() => {
        const a = actor(id, op),
          old = record(key);
        if(expectedCatalogRevision!==undefined && expectedCatalogRevision!==db.prepare('SELECT coalesce(sum(revision),0) AS value FROM docs').get().value)
          throw Error('Otra persona cambió el catálogo. Actualizá y volvé a intentarlo.');
        if (op === 'restore') {
          const row = db
            .prepare('SELECT before FROM changes WHERE id=? AND key=? AND operation=?')
            .get(historyId, key, 'publish');
          if (!row) throw Error('Versión no disponible.');
          value = JSON.parse(row.before).published;
        }
        const n = transition(a, op, revision, old, value);
        db.prepare(
          'INSERT INTO docs VALUES(?,?,?,?) ON CONFLICT(key) DO UPDATE SET revision=excluded.revision,draft=excluded.draft,published=excluded.published',
        ).run(
          key,
          n.revision,
          n.draft === null ? null : JSON.stringify(n.draft),
          JSON.stringify(n.published),
        );
        audit(key, a, op, old || { published: {}, draft: null, revision: 0 });
        return n;
      });
    },
    history(id) {
      actor(id, 'read');
      return db
        .prepare('SELECT id,key,actor,name,operation,at FROM changes ORDER BY id DESC LIMIT 200')
        .all()
        .map((r) => ({ ...r }));
    },
    change(id, event) {
      actor(id, 'read');
      const r = db.prepare('SELECT id,key,operation,before FROM changes WHERE id=?').get(event);
      if (!r) throw Error('Cambio no disponible.');
      const next = db
        .prepare('SELECT before FROM changes WHERE id>? AND key=? ORDER BY id LIMIT 1')
        .get(event, r.key);
      return {
        ...r,
        before: JSON.parse(r.before),
        after: next ? JSON.parse(next.before) : record(r.key),
      };
    },
    assets(id) {
      actor(id, 'read');
      return db
        .prepare('SELECT id,name,mime,size FROM assets ORDER BY rowid DESC')
        .all()
        .map((r) => ({ ...r }));
    },
    upload(id, asset, bytes) {
      return tx(() => {
        const a = actor(id, 'media');
        db.prepare('INSERT INTO assets VALUES(?,?,?,?,?)').run(
          asset.id,
          asset.name,
          asset.mime,
          bytes.length,
          bytes,
        );
        audit('archivo/' + asset.id, a, 'upload', {});
      });
    },
    file(id) {
      const r = db.prepare('SELECT bytes,mime FROM assets WHERE id=?').get(id);
      return r && new Blob([r.bytes], { type: r.mime });
    },
  };
}
