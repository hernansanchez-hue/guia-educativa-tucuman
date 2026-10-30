"use client";

import { useState } from "react";
import PublicImage from "../components/PublicImage";

// Editorial images can live on external hosts; keep the section usable if one fails.
function localStockOrSource(src, fallbackSrc) {
  return !src || /^https?:\/\/images\.unsplash\.com\//i.test(src) ? fallbackSrc : src;
}

export default function CityEditorialImage({ src, fallbackSrc, illustrativeLabel = false, ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const requestedSrc = localStockOrSource(src, fallbackSrc);
  const resolvedSrc = failedSrc === requestedSrc ? fallbackSrc : requestedSrc;

  return <><PublicImage
    {...props}
    src={resolvedSrc}
    onError={() => {
      if (resolvedSrc !== fallbackSrc) setFailedSrc(requestedSrc);
    }}
  />{illustrativeLabel && (resolvedSrc === fallbackSrc || /unsplash|\/assets\/catalog\//i.test(resolvedSrc || "")) ? <small>Imagen ilustrativa</small> : null}</>;
}
