export const SITE_NAME = "Guía Educativa Tucumán";
export const SITE_URL = "https://guiaeducativatuc.com.ar";
export const SITE_DESCRIPTION =
  "Instituciones, carreras y cursos de toda la provincia reunidos en un solo lugar.";

export function createPublicMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  image,
  absoluteTitle = false,
}) {
  const resolvedTitle = absoluteTitle ? { absolute: title } : title;
  const openGraph = {
    title,
    description,
    url: path,
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
  };

  if (image) {
    openGraph.images = [{ url: image, alt: title }];
  }

  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: path },
    openGraph,
  };
}
