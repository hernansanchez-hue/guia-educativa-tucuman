export const norm = (v) => String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
export const href = (params = {}) => '/administrador?' + new URLSearchParams(Object.entries(params).filter(([,v]) => v !== undefined && v !== null && v !== '')).toString();
export const navigation = [
  ['inicio', 'Inicio', 'home'], ['slider', 'Slider', 'slides'], ['sedes', 'Instituciones', 'school'],
  ['ofertas', 'Carreras', 'book'], ['medios', 'Biblioteca de medios', 'image'],
  ['eventos','Eventos','slides'], ['servicios','Servicios','school'],
  ['consultas','Consultas','book'],
  ['borradores', 'Borradores', 'edit'], ['historial', 'Actividad', 'clock'], ['usuarios', 'Usuarios', 'team'],
];
export const venueSections = ['sedes', 'destacadas', 'sucursales', 'seleccion'];
export const cityEditors = ['slider', 'destacadas'];
export const createTypes = ['institucion', 'sede', 'oferta', 'carrera','evento'];
export const rememberKey = 'get-control-city';
export function chooseCity(cities, explicit, remembered) {
  for (const id of [explicit, remembered, 'concepcion']) {
    if (typeof id !== 'string') continue;
    const c = cities.find(item => item.id === id || item.slug === id);
    if (c) return c;
  }
  return cities[0] || null;
}
