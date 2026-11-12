import { SITE_URL } from "../lib/seo/public-metadata";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/administrador$", "/administrador/", "/admin$", "/admin/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
