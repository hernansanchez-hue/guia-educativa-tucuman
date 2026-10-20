import HomeMapClient from "./components/HomeMapClient";
import { getHomeMapCatalog } from "../lib/public-catalog/home-map-catalog";
import {getPublishedHome} from '../lib/admin/published-home';
import {editorialMetadata} from '../lib/admin/published-editorial';
import {
  SITE_DESCRIPTION,
  SITE_NAME,
} from "../lib/seo/public-metadata";
import "./home-map.css";

export const revalidate = 60;

const originalMetadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
};

export async function generateMetadata(){return editorialMetadata(originalMetadata,await getPublishedHome());}

export default async function Home() {
  const [catalog,content]=await Promise.all([getHomeMapCatalog(),getPublishedHome()]);
  return <HomeMapClient catalog={catalog} content={content} />;
}
