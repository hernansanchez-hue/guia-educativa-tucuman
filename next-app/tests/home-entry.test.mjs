import test from 'node:test';
import assert from 'node:assert/strict';
import { getCityEntryCatalog } from '../lib/public-catalog/city-entry.mjs';
import { editorialCatalog, cityPageFromCatalog } from '../lib/admin/editorial-model.mjs';
import { getVersionedPublicCatalogEntries } from '../lib/catalog/versioned-public-catalog.mjs';

test('the Home exposes all 27 usable cities from the canonical public catalog', () => {
  const cities = getCityEntryCatalog();
  const catalog = editorialCatalog(getVersionedPublicCatalogEntries(), { includeLegacy: false });
  assert.equal(cities.length, 27);
  assert.equal(new Set(cities.map(city => city.slug)).size, cities.length);
  assert.deepEqual(new Set(cities.map(city => city.slug)), new Set(catalog.cities.map(city => city.slug)));
  for (const city of cities) {
    const destination = cityPageFromCatalog(catalog, city.slug);
    assert.equal(destination.name, city.name);
    assert.ok(destination.institutions.length > 0, city.slug);
    assert.deepEqual(Object.keys(city).sort(), ['name', 'slug']);
  }
});

test('city destinations have stable Spanish alphabetical order without mutating the source', () => {
  const entries = getVersionedPublicCatalogEntries();
  const before = JSON.stringify(entries);
  const cities = getCityEntryCatalog();
  const order = new Intl.Collator('es', { sensitivity: 'base' });
  for (let i = 1; i < cities.length; i++) assert.ok(order.compare(cities[i - 1].name, cities[i].name) <= 0);
  assert.equal(cities[0].name, 'Aguilares');
  assert.equal(cities.at(-1).name, 'Yerba Buena');
  assert.equal(JSON.stringify(entries), before);
});
