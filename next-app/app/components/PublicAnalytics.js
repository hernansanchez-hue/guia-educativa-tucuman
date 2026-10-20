"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { isAdminPath } from "../../lib/admin/auth-contract.mjs";

export default function PublicAnalytics() {
  const pathname = usePathname();
  const admin = isAdminPath(pathname);
  useEffect(() => { window["ga-disable-G-KY9E5NG5V2"] = admin; }, [admin]);
  if (admin) return null;
  return <><Script src="https://www.googletagmanager.com/gtag/js?id=G-KY9E5NG5V2" strategy="afterInteractive" />
    <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || [];
function gtag(){if(location.pathname === '/admin' || location.pathname.startsWith('/admin/')) return; dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-KY9E5NG5V2');`}</Script></>;
}
