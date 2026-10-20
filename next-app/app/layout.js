import "./globals.css";
import "./components/public-footer.css";
import PublicSiteBackground from "./components/PublicSiteBackground";
import {PublicEditorialProvider} from "./components/PublicEditorialContext";
import {getPublishedSiteContent} from "../lib/admin/published-extended";
import {getSiteConfiguration} from '../lib/admin/published-configuration';
import PublicAnalytics from "./components/PublicAnalytics";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo/public-metadata";

const initialMetadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "es_AR",
    type: "website",
  },
};

export async function generateMetadata(){const {settings}=await getSiteConfiguration();return {...initialMetadata,title:{default:settings.siteName,template:'%s | '+settings.siteName},description:settings.description,openGraph:{...initialMetadata.openGraph,title:settings.siteName,description:settings.description,siteName:settings.siteName,...(settings.ogImage?{images:[{url:settings.ogImage}]}:{})},...(settings.favicon?{icons:{icon:settings.favicon}}:{})};}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const siteContent=await getPublishedSiteContent();
  return (
    <html lang="es">
      <body>
        <PublicEditorialProvider content={siteContent}><PublicSiteBackground>{children}</PublicSiteBackground></PublicEditorialProvider>
        <PublicAnalytics />
      </body>
    </html>
  );
}
