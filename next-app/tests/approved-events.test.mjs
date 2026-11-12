import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {isConfirmedEvent, eventStartDate, eventDateLabel, filterPublicEvents} from '../lib/events/public-events.mjs';
import {events} from '../app/data/events.js';

const realFixture = {id: 'test-only', name: 'Encuentro educativo', city: 'Concepción', category: 'Educativo', description: 'Orientación para estudiantes', status: 'Confirmado', startDate: '2027-03-12', location: 'Salón municipal'};

test('legacy demonstration events are never treated as confirmed public agenda records', () => {
  assert.equal(events.length, 7);
  assert.equal(events.filter(isConfirmedEvent).length, 0);
  assert.deepEqual(filterPublicEvents(events), []);
});

test('editorial confirmation requires real date, explicit status and a concrete location', () => {
  assert.equal(isConfirmedEvent(realFixture), true);
  for (const overrides of [{status: 'Próximamente'}, {startDate: ''}, {startDate: '2027-02-30'}, {location: 'Ubicación a confirmar'}, {visible: false}]) {
    assert.equal(isConfirmedEvent({...realFixture, ...overrides}), false);
  }
  assert.equal(eventStartDate({...realFixture, startDate: '2027-03-12T09:00:00-03:00'}), '2027-03-12');
  assert.equal(eventDateLabel({...realFixture, date: 'Fecha a confirmar'}), '12 de marzo de 2027');
});

test('agenda combines accent-insensitive search, city, type and month filters', () => {
  const rows = [realFixture, {...realFixture, id: 'second', city: 'Monteros', startDate: '2027-04-15'}];
  assert.equal(filterPublicEvents(rows, {query: 'ORIENTACION', city: 'Concepción', category: 'Educativo', month: '2027-03'}).length, 1);
  assert.equal(filterPublicEvents(rows, {query: 'concepcion'}).length, 1);
  assert.equal(filterPublicEvents(rows, {month: '2027-05'}).length, 0);
  assert.equal(filterPublicEvents(rows, {category: 'Deportivo'}).length, 0);
  assert.equal(filterPublicEvents(rows).length, 2);
});

test('existing event detail URLs remain while unconfirmed examples are noindex', async () => {
  const source = await readFile(new URL('../app/eventos/[slug]/page.js', import.meta.url), 'utf8');
  assert.match(source, /isConfirmedEvent\(event\) \? metadata :/);
  assert.match(source, /index: false, follow: false/);
  assert.match(source, /generateStaticParams/);
  const detail = await readFile(new URL('../app/eventos/EventDetailClient.js', import.meta.url), 'utf8');
  assert.match(detail, /href="\/eventos">← Volver a la agenda/);
  assert.match(detail, /No confirmado · Datos de demostración/);
  assert.match(detail, /confirmed && event.ctaHref/);
});
