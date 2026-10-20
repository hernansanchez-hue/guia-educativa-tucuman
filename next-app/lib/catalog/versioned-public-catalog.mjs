import catalog from "./public-catalog.json" with { type: "json" };

export const PUBLIC_CATALOG_VERSION = catalog.version;
export const PUBLIC_CATALOG_SOURCE = catalog.catalog;

/**
 * Fuente oficial temporal del catálogo público de GET.
 *
 * El contenido está versionado con la aplicación y no depende del estado del
 * CMS remoto. Los consumidores deben tratar el resultado como datos de solo
 * lectura.
 */
export function getVersionedPublicCatalogEntries() {
  return catalog.entries;
}
