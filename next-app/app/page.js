import ApprovedHomeClient from './components/ApprovedHomeClient';
import { getCityEntryCatalog } from '../lib/public-catalog/city-entry.mjs';
import { getPublishedHome } from '../lib/admin/published-home';
import { editorialMetadata } from '../lib/admin/published-editorial';
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/seo/public-metadata';

export const revalidate = 60;

const originalMetadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: '/',
  absoluteTitle: true,
};

export async function generateMetadata() {
  return editorialMetadata(originalMetadata, await getPublishedHome());
}

export default function Home() {
  return <ApprovedHomeClient cities={getCityEntryCatalog()} />;
}
