import { editorialCatalog } from '../admin/editorial-model.mjs';
import { getVersionedPublicCatalogEntries } from '../catalog/versioned-public-catalog.mjs';

// Project the same published source used by /[ciudad]; send only destinations to the browser.
export function getCityEntryCatalog() {
  const catalog = editorialCatalog(getVersionedPublicCatalogEntries(), { includeLegacy: false });
  const citiesWithInstitutions = new Set(catalog.institutions.map(institution => institution.citySlug));
  const order = new Intl.Collator('es', { sensitivity: 'base' });

  return catalog.cities
    .filter(city => citiesWithInstitutions.has(city.slug))
    .map(({ slug, name }) => ({ slug, name }))
    .sort((left, right) => order.compare(left.name, right.name) || order.compare(left.slug, right.slug));
}
