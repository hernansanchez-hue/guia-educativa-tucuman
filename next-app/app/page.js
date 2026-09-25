import HomeMapClient from "./components/HomeMapClient";
import { getHomeMapCatalog } from "../lib/public-catalog/home-map-catalog";
import {
  createPublicMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/seo/public-metadata";
import "./home-map.css";

export const revalidate = 60;

export const metadata = createPublicMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default async function Home() {
  return <HomeMapClient catalog={await getHomeMapCatalog()} />;
}
