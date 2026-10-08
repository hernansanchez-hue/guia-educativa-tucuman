import PublicHeader from "./PublicHeader";
import PublicHeaderFrame from "./PublicHeaderFrame";

// Navbar oficial para todo el sitio público, excepto la Home principal.
export default function PublicFloatingHeader({ citySearch = null, homeHref = "/" }) {
  return (
    <PublicHeaderFrame>
      <PublicHeader variant="city-hero" citySearch={citySearch} homeHref={homeHref} />
    </PublicHeaderFrame>
  );
}
