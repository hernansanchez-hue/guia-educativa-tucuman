import 'server-only';
import { getVersionedPublicCatalogEntries } from '../catalog/versioned-public-catalog.mjs';
import { controlStore, controlMode, hasLocalContent } from './store';
import { project } from './domain.mjs';
import {isExtendedRecord} from './extended.mjs';
export async function controlPublishedEntries() {
  const base = getVersionedPublicCatalogEntries();
  if (controlMode() === 'off' || (controlMode() === 'local' && !hasLocalContent())) return base;
  return project(base, (await (await controlStore()).published()).filter(r=>!isExtendedRecord(r)));
}
