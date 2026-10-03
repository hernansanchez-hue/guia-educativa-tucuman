"use client";

import { usePathname } from "next/navigation";

export default function PublicSiteBackground({ children }) {
  const pathname = usePathname();

  return (
    <div className={pathname === "/" ? "public-site-root" : "public-site-background"}>
      {children}
    </div>
  );
}
