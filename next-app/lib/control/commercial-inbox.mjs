import {createHash, randomUUID} from 'node:crypto';
import {validateCommercialContact} from '../integration/commercial-contact.mjs';

export const CONTACT_STATUSES = Object.freeze({nueva:'Nueva',en_seguimiento:'En seguimiento',contactada:'Contactada',cerrada:'Cerrada'});
export const INBOX_PAGE_SIZE = 20;
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export function permitCommercialInbox(actor) {
  if (!uuid(actor?.id) || actor.active !== true || !['ADMINISTRADOR','EDITOR'].includes(actor.role)) throw Error('No tenés permiso para acceder a las consultas comerciales.');
}
export function contactFingerprint(payload) {
  const clean = validateCommercialContact(payload);
  if (!clean) throw Error('Consulta inválida.');
  return createHash('sha256').update(JSON.stringify(clean)).digest('hex');
}
export function inboxQuery(input = {}) {
  const q = typeof input.q === 'string' ? input.q.trim().slice(0,120) : '';
  const status = Object.hasOwn(CONTACT_STATUSES,input.status) ? input.status : '';
  const number = Number(input.page);
  const page = Number.isSafeInteger(number) && number > 0 && number <= 50000 ? number : 1;
  return {q,status,page,pageSize:INBOX_PAGE_SIZE,offset:(page-1)*INBOX_PAGE_SIZE};
}
export function validateStatusChange(value) {
  if (!uuid(value?.id) || !Object.hasOwn(CONTACT_STATUSES,value.status) || !Number.isSafeInteger(value.expectedRevision) || value.expectedRevision < 0) throw Error('Cambio de estado inválido.');
  return {id:value.id,status:value.status,expectedRevision:value.expectedRevision};
}
export function contactStoreMode(env = process.env) {
  if (env.GET_CONTACT_STORE === 'supabase') return 'supabase';
  if (env.GET_CONTACT_STORE === 'local' && env.NODE_ENV === 'development' && !env.NETLIFY && !env.AWS_LAMBDA_FUNCTION_NAME) return 'local';
  return 'off';
}

// Genuine durable local persistence, only explicitly enabled in development.
// Tests can supply a temporary path; production can never select this adapter.
export async function openLocalCommercialInbox(path, {now = Date.now} = {}) {
  const {DatabaseSync} = await import('node:sqlite');
  if (path !== ':memory:') {
    const {mkdirSync} = await import('node:fs');
    const {dirname} = await import('node:path');
    mkdirSync(dirname(path),{recursive:true,mode:0o700});
  }
  const db = new DatabaseSync(path);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS commercial_contacts (
      id TEXT PRIMARY KEY,idempotency_key TEXT NOT NULL UNIQUE,fingerprint TEXT NOT NULL,
      institution_name TEXT NOT NULL,contact_name TEXT NOT NULL,phone TEXT NOT NULL,email TEXT NOT NULL,plan TEXT NOT NULL,message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'nueva',revision INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL,updated_at TEXT NOT NULL,
      source_path TEXT NOT NULL DEFAULT '/contacto' CHECK(source_path='/contacto'));
    CREATE INDEX IF NOT EXISTS commercial_contacts_date ON commercial_contacts(created_at DESC,id DESC);
    CREATE INDEX IF NOT EXISTS commercial_contacts_status_date ON commercial_contacts(status,created_at DESC,id DESC);
    CREATE TABLE IF NOT EXISTS commercial_contact_audit (id INTEGER PRIMARY KEY,contact_id TEXT NOT NULL,actor_id TEXT NOT NULL,previous_status TEXT NOT NULL,next_status TEXT NOT NULL,at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS commercial_contact_audit_contact ON commercial_contact_audit(contact_id,id);
    CREATE TABLE IF NOT EXISTS commercial_contact_rates (rate_key TEXT PRIMARY KEY,window_start INTEGER NOT NULL,count INTEGER NOT NULL);`);
  // Additive compatibility for a local inbox created earlier in this task. All
  // existing records came exclusively through /contacto, never a free URL field.
  if (!db.prepare('PRAGMA table_info(commercial_contacts)').all().some(column=>column.name==='source_path')) db.exec("ALTER TABLE commercial_contacts ADD COLUMN source_path TEXT NOT NULL DEFAULT '/contacto' CHECK(source_path='/contacto')");
  const transact = fn => {
    db.exec('BEGIN IMMEDIATE');
    try {const result=fn();db.exec('COMMIT');return result;} catch(error) {db.exec('ROLLBACK');throw error;}
  };
  return {
    close(){db.close();},
    receive(key,input,rateKey) {
      const payload=validateCommercialContact(input);
      if (!uuid(key)||!payload||!/^[a-f0-9]{64}$/.test(rateKey||'')) throw Error('Consulta inválida.');
      return transact(() => {
        const fingerprint=contactFingerprint(payload);
        const existing=db.prepare('SELECT id,fingerprint FROM commercial_contacts WHERE idempotency_key=?').get(key);
        if (existing) {
          if (existing.fingerprint !== fingerprint) return {status:409};
          return {status:201,receiptId:existing.id};
        }
        const time=now(), windowMs=600000;
        db.prepare('DELETE FROM commercial_contact_rates WHERE window_start<?').run(time-windowMs);
        const rate=db.prepare('SELECT count FROM commercial_contact_rates WHERE rate_key=?').get(rateKey);
        if (rate?.count >= 5) return {status:429};
        db.prepare('INSERT INTO commercial_contact_rates VALUES(?,?,1) ON CONFLICT(rate_key) DO UPDATE SET count=count+1').run(rateKey,time);
        const id=randomUUID(),at=new Date(time).toISOString();
        db.prepare("INSERT INTO commercial_contacts(id,idempotency_key,fingerprint,institution_name,contact_name,phone,email,plan,message,created_at,updated_at,source_path) VALUES(?,?,?,?,?,?,?,?,?,?,?,'/contacto')").run(id,key,fingerprint,payload.institutionName,payload.name,payload.phone,payload.email,payload.plan,payload.message,at,at);
        return {status:201,receiptId:id};
      });
    },
    list(actor,query={}) {
      permitCommercialInbox(actor);
      const opts=inboxQuery(query),needle=opts.q.toLocaleLowerCase('es');
      const where="(?='' OR status=?) AND (?='' OR instr(lower(institution_name||' '||contact_name||' '||email||' '||phone||' '||message),?)>0)";
      const args=[opts.status,opts.status,needle,needle];
      const total=db.prepare('SELECT count(*) AS total FROM commercial_contacts WHERE '+where).get(...args).total;
      const rows=db.prepare('SELECT id,institution_name,contact_name,phone,email,plan,message,status,revision,created_at,updated_at,source_path FROM commercial_contacts WHERE '+where+' ORDER BY created_at DESC,id DESC LIMIT ? OFFSET ?').all(...args,opts.pageSize,opts.offset);
      return {available:true,rows,total,...opts};
    },
    change(actor,request) {
      permitCommercialInbox(actor);const {id,status,expectedRevision}=validateStatusChange(request);
      return transact(() => {
        const row=db.prepare('SELECT status,revision FROM commercial_contacts WHERE id=?').get(id);
        if (!row||row.revision!==expectedRevision) throw Error('La consulta cambió. Recargá antes de guardar.');
        if (row.status===status) return {ok:true,id,status,revision:row.revision};
        const at=new Date(now()).toISOString();
        db.prepare('UPDATE commercial_contacts SET status=?,revision=revision+1,updated_at=? WHERE id=?').run(status,at,id);
        db.prepare('INSERT INTO commercial_contact_audit(contact_id,actor_id,previous_status,next_status,at) VALUES(?,?,?,?,?)').run(id,actor.id,row.status,status,at);
        return {ok:true,id,status,revision:row.revision+1};
      });
    },
    history(actor,id) {permitCommercialInbox(actor);return db.prepare('SELECT contact_id,actor_id,previous_status,next_status,at FROM commercial_contact_audit WHERE contact_id=? ORDER BY id').all(id);},
  };
}
