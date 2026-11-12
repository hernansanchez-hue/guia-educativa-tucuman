import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openLocalStore } from '../lib/control/local-store.mjs';
import {
  applyPatch,
  permit,
  project,
  transition,
  validatePatch,
  referencedMedia,
} from '../lib/control/domain.mjs';
import { assemble, makeEditor, previewData } from '../lib/control/workspace.mjs';
import { verifiedMember } from '../lib/control/identity.mjs';
import { getVersionedPublicCatalogEntries } from '../lib/catalog/versioned-public-catalog.mjs';

const owner = '00000000-0000-4000-a000-000000000001',
  staff = '00000000-0000-4000-a000-000000000002',
  reader = '00000000-0000-4000-a000-000000000003';
const row = (key, kind, data) => ({
  key,
  moduleId:
    kind === 'city'
      ? 'cities'
      : ['brand', 'institution'].includes(kind)
        ? 'institutions'
        : 'careers',
  payload: { _kind: kind, data },
  visibility: 'published',
});
const makeFixture = () => [
  row('localidad', 'city', {
    id: 'localidad',
    slug: 'localidad',
    name: 'Localidad de prueba',
    institutionIds: ['s1', 's2'],
    featuredInstitutionIds: [],
  }),
  row('marca/m', 'brand', { id: 'm', name: 'Marca de prueba', slug: 'm' }),
  ...['s1', 's2'].map((id, i) =>
    row('sede/' + id, 'institution', {
      id,
      slug: id,
      brandId: 'm',
      cityId: 'localidad',
      type: 'Instituto',
      gallery: [],
      plan: i ? 'Básico' : 'Profesional',
      featuredCareerIds: i ? [] : ['c'],
      address: 'Calle inicial',
    }),
  ),
  row('carrera/c', 'career', {
    id: 'c',
    name: 'Carrera de prueba',
    slug: 'c',
    studyPlan: [],
    requirements: [],
    faq: [],
  }),
  ...['s1', 's2'].map((id) =>
    row('oferta/' + id, 'offering', {
      id,
      institutionId: id,
      careerId: 'c',
      degree: 'Título',
      duration: 'Inicial',
      image: '/assets/catalog/clinical.webp',
    }),
  ),
];
test('Auth confirmado y perfil activo: no se aceptan roles en metadatos, usuarios sin sesión ni lectores deshabilitados', async () => {
  const db = openLocalStore(':memory:');
  try {
    db.bootstrap(owner, 'Equipo');
    const resolve = (user, error = null) =>
      verifiedMember({ auth: { getUser: async () => ({ data: { user }, error }) } }, db);
    for (const u of [
      null,
      { id: owner },
      { id: owner, email_confirmed_at: '2026', is_anonymous: true },
      { id: staff, email_confirmed_at: '2026', user_metadata: { role: 'ADMINISTRADOR' } },
    ])
      assert.equal(await resolve(u), null);
    assert.equal((await resolve({ id: owner, email_confirmed_at: '2026' })).role, 'ADMINISTRADOR');
    db.setMember(owner, reader, 'Lectura', 'LECTOR', false);
    assert.equal(await resolve({ id: reader, email_confirmed_at: '2026' }), null);
  } finally {
    db.close();
  }
});
test('permisos en escrituras, CAS, descarte, persistencia después de cerrar, historial y restore sin mutar el catálogo', () => {
  const dir = mkdtempSync(join(tmpdir(), 'get-centro-test-')),
    path = join(dir, 'private.sqlite');
  let db = openLocalStore(path);
  const base = makeFixture(),
    original = JSON.stringify(base),
    key = 'sede/s1',
    read = () => project(base, db.published())[2].payload.data.address;
  try {
    assert.ok(db.bootstrap(owner, 'Responsable'));
    assert.equal(db.bootstrap(staff, 'Segundo'), false);
    db.setMember(owner, staff, 'Redacción', 'EDITOR', true);
    db.setMember(owner, reader, 'Lectura', 'LECTOR', true);
    assert.throws(() => db.setMember(staff, staff, 'x', 'ADMINISTRADOR', true));
    assert.throws(() => db.setMember(owner, owner, 'x', 'LECTOR', false));
    assert.throws(() => db.write(reader, key, 'save', 0, {}));
    assert.throws(() => db.records('intruso'));
    db.write(staff, key, 'save', 0, { address: 'Dirección de ensayo' });
    assert.equal(read(), 'Calle inicial');
    assert.throws(() => db.write(owner, key, 'publish', 0));
    assert.throws(() => db.write(staff, key, 'publish', 1));
    const preview = previewData(base, db.records(owner), key, { address: 'Dirección de ensayo' });
    assert.equal(preview.props.institution.address, 'Dirección de ensayo');
    db.close();
    db = openLocalStore(path);
    assert.equal(db.records(reader)[0].draft.address, 'Dirección de ensayo');
    db.write(owner, key, 'publish', 1);
    assert.equal(read(), 'Dirección de ensayo');
    db.write(staff, key, 'save', 2, { address: 'No publicar' });
    db.write(staff, key, 'discard', 3);
    assert.equal(read(), 'Dirección de ensayo');
    const event = db.history(owner).find((e) => e.operation === 'publish');
    db.write(owner, key, 'restore', 4, null, event.id);
    assert.equal(read(), 'Dirección de ensayo');
    db.write(owner, key, 'publish', 5);
    assert.equal(read(), 'Calle inicial');
    assert.equal(db.history(owner).filter((e) => e.operation === 'publish').length, 2);
    assert.equal(JSON.stringify(base), original);
    db.setMember(owner, staff, 'Redacción', 'EDITOR', false);
    assert.throws(() => db.write(staff, key, 'save', 6, {}));
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test('campos permitidos, URLs, referencias por sede, límite de cinco y separación del plan', () => {
  const base = makeFixture(),
    city = base[0],
    paid = base[2],
    free = base[3],
    offer = base[5];
  for (const p of [
    { plan: 'Premium' },
    { id: 'otro' },
    { slug: 'otra' },
    { website: 'javascript:alert(1)' },
    { image: '//evil.example/x' },
    { featuredCareerIds: ['fantasma'] },
    { featuredCareerIds: ['c', 's1'] },
  ])
    assert.throws(() => validatePatch(paid, p, base));
  assert.throws(() => validatePatch(free, { featuredCareerIds: ['c'] }, base));
  assert.throws(() => validatePatch(paid, { featuredCareerIds: Array(6).fill('c') }, base));
  assert.throws(() => validatePatch(city, { placements: [{ id: 'foránea', active: true }] }, base));
  const p = validatePatch(city, { placements: [{ id: 's2', active: true }] }, base),
    w = assemble(base, [{ key: city.key, published: p }]);
  assert.equal(w.venues.find((i) => i.id === 's2').featured, true);
  assert.equal(w.venues.find((i) => i.id === 's2').paid, false);
  assert.throws(() => validatePatch(offer, { institutionId: 's2' }, base));
  assert.throws(() => validatePatch(base[6], { whatsapp: '123456789' }, base));
  const edit = previewData(base, [], offer.key, {
    name: 'Nombre propio',
    workField: 'Ejemplo',
    duration: 'Otro',
  });
  assert.equal(edit.props.career.name, 'Nombre propio');
  assert.equal(edit.props.career.workField, 'Ejemplo');
  assert.equal(base[4].payload.data.name, 'Carrera de prueba');
  assert.equal(base[6].payload.data.duration, 'Inicial');
  assert.throws(() =>
    validatePatch(
      city,
      {
        slides: [
          {
            id: 's',
            active: true,
            title: 'x',
            ctaLabel: 'Ver',
            institutionId: 's2',
            careerId: 'nada',
            href: '/incorrecta',
            image: '/a.jpg',
          },
        ],
      },
      base,
    ),
  );
  assert.equal(applyPatch(paid, {}), paid);
  assert.throws(() =>
    transition({ id: owner, role: 'ADMINISTRADOR', active: true }, 'publish', 0, null),
  );
  assert.throws(() => permit({ id: reader, role: 'LECTOR', active: true }, 'media'));
});
test('medios privados son persistentes, reutilizables y no se destruyen al retirar una asociación', async () => {
  const db = openLocalStore(':memory:');
  try {
    db.bootstrap(owner, 'Equipo');
    db.setMember(owner, reader, 'Lectura', 'LECTOR', true);
    const id = owner + '.pdf',
      asset = { id, name: 'Ensayo.pdf', mime: 'application/pdf' },
      bytes = Buffer.from('%PDF-1.4 test');
    assert.throws(() => db.upload(reader, asset, bytes));
    db.upload(owner, asset, bytes);
    assert.equal(await db.file(id).text(), bytes.toString());
    assert.equal(db.assets(owner).length, 1);
    const patch = { studyPlanPdf: '/media/control/' + id };
    assert.ok(referencedMedia(patch).has(id));
    assert.equal(db.published().length, 0);
    db.write(owner, 'oferta/test', 'save', 0, patch);
    db.write(owner, 'oferta/test', 'publish', 1);
    assert.ok(referencedMedia(db.published()[0].published).has(id));
    db.write(owner, 'oferta/test', 'save', 2, {});
    db.write(owner, 'oferta/test', 'publish', 3);
    assert.equal(db.assets(owner).length, 1);
  } finally {
    db.close();
  }
});
test('catálogo real: abrir las cuatro herramientas no escribe ni cambia datos, relaciones o URLs', () => {
  const base = getVersionedPublicCatalogEntries(),
    before = JSON.stringify(base),
    w = assemble(base, []);
  const c = makeEditor(w, 'concepcion');
  assert.ok(c.slideOptions.length);
  const s = makeEditor(w, 'sede/universidad-siglo-21-concepcion');
  assert.ok(s.offers.length);
  assert.ok(s.siblings.length > 1);
  const o = makeEditor(w, 'oferta/universidad-siglo-21-concepcion-abogacia');
  assert.equal(o.url, '/concepcion/universidad-siglo-21/carreras/abogacia');
  assert.ok(w.venues.length >= 125);
  assert.equal(JSON.stringify(project(base, [])), before);
  assert.equal(JSON.stringify(base), before);
});
