const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const CONFIRMED_STATUSES = new Set(['confirmado', 'confirmada', 'inscripciones abiertas', 'en curso', 'realizado', 'realizada', 'finalizado', 'finalizada']);
const pending = /a confirmar|por confirmar|pendiente|demostracion|demo|prueba/;

/** Confirmation is editorial data, never inferred from a title, image or publication alone. */
export function eventStartDate(event) {
  const value = String(event.startDate || event.date || '');
  const match = value.match(/^(\d{4}-\d{2}-\d{2})(?:T|$)/);
  if (!match) return '';
  const date = new Date(match[1] + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === match[1] ? match[1] : '';
}

export function isConfirmedEvent(event) {
  return Boolean(event && event.visible !== false && CONFIRMED_STATUSES.has(normalize(event.status))
    && eventStartDate(event) && String(event.location || '').trim() && !pending.test(normalize(event.location)));
}

export function eventDateLabel(event) {
  const label = String(event.date || '').trim();
  if (label && !pending.test(normalize(label)) && !/^\d{4}-\d{2}-\d{2}/.test(label)) return label;
  const date = eventStartDate(event);
  if (!date) return 'Fecha a confirmar';
  return new Intl.DateTimeFormat('es-AR', {day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC'}).format(new Date(date + 'T12:00:00Z'));
}

export function filterPublicEvents(events, {query = '', city = 'Todos', category = 'Todos', month = ''} = {}) {
  const term = normalize(query);
  return events.filter(isConfirmedEvent).filter(event =>
    (!term || normalize([event.name, event.description, event.city, event.category].join(' ')).includes(term))
    && (city === 'Todos' || event.city === city)
    && (category === 'Todos' || event.category === category)
    && (!month || eventStartDate(event).slice(0, 7) === month));
}
