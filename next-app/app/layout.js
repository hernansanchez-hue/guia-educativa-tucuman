import "./globals.css";
import "./components/public-footer.css";
import Script from "next/script";

import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "../lib/seo/public-metadata";

export const metadata = {
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

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KY9E5NG5V2"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KY9E5NG5V2');`}
        </Script>
      </body>
    </html>
  );
}
