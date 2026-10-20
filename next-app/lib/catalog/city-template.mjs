import {resolveCitySlides} from '../admin/city-slider.mjs';

// One GET-owned editorial fallback, not a paid placement or a campus endorsement.
export const GET_CITY_BANNER = Object.freeze({
  image: '/assets/catalog/institution-neutral.webp',
  description: 'Explorá instituciones y carreras y encontrá opciones para tu próximo paso.',
  ctaLabel: 'Ver instituciones',
});

export function resolveCityBanner(city) {
  const slides = resolveCitySlides(city);
  if (slides.length) return {kind: 'commercial', slides};
  return {
    kind: 'editorial',
    slides: [],
    title: city.heroTitle || `Encontrá dónde estudiar en ${city.name}.`,
    description: city.heroDescription || GET_CITY_BANNER.description,
    image: city.heroImage || GET_CITY_BANNER.image,
    ctaLabel: GET_CITY_BANNER.ctaLabel,
  };
}

export function showCityOrientation(city, orientation) {
  // The singleton is global. Legacy cityIds must not exclude future localities.
  // Preserve an explicit editorial hide at either the global or city level.
  return city.orientationVisible !== false && orientation?.visible === true;
}
