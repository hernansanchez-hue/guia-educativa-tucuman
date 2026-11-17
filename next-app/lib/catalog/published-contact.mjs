import {cityPageFromCatalog} from '../admin/editorial-model.mjs';

// Mismo catálogo y misma proyección que la sincronización comercial.
export function isPublishedContactVenue(catalog, venue) {
  if (!venue?.id || !venue.citySlug || venue.visible === false) return false;
  return cityPageFromCatalog(catalog, venue.citySlug)?.featuredInstitutions
    .some(card => card.id === venue.id) === true;
}

export function withPublishedContact(catalog, page) {
  if (!page) return null;
  return {...page, institution: {...page.institution,
    contactFeatured: isPublishedContactVenue(catalog, page.institution)}};
}
