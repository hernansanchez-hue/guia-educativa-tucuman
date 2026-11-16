import PublicAnalyticsClient from './PublicAnalyticsClient';
import {getIndexablePublicRoutePaths,getPublishedCatalog} from '../../lib/admin/published-editorial';
import {getExtendedCatalog} from '../../lib/admin/published-extended';
import {publicPageTitles} from '../../lib/analytics/attribution.mjs';

export default async function PublicAnalytics() {
  // Non-secret deployment gate: check Enhanced Measurement is disabled in GA
  // before enabling manual events. This never overrides the visitor's consent.
  const configured = process.env.GET_GA_MANUAL_MEASUREMENT_CONFIRMED === 'true'
    && process.env.NODE_ENV === 'production'
    && (!process.env.CONTEXT || process.env.CONTEXT === 'production');
  const paths = configured ? await getIndexablePublicRoutePaths() : [];
  const titles = configured ? publicPageTitles(await getPublishedCatalog(),await getExtendedCatalog(['events','services'])) : {};
  return <PublicAnalyticsClient configured={configured} publicPaths={paths} publicTitles={Object.fromEntries(paths.filter(path=>titles[path]).map(path=>[path,titles[path]]))} />;
}
