import { getPublicRoutePaths } from "../lib/public-catalog/public-routes-catalog";
import { SITE_URL } from "../lib/seo/public-metadata";

export const revalidate = 60;

export default async function sitemap() {
  const paths = await getPublicRoutePaths();
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
  }));
}
