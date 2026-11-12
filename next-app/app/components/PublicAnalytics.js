import PublicAnalyticsClient from './PublicAnalyticsClient';
import {getIndexablePublicRoutePaths} from '../../lib/admin/published-editorial';

export default async function PublicAnalytics() {
  // Non-secret deployment gate: check Enhanced Measurement is disabled in GA
  // before enabling manual events. This never overrides the visitor's consent.
  const configured = process.env.GET_GA_MANUAL_MEASUREMENT_CONFIRMED === 'true';
  const paths = configured ? await getIndexablePublicRoutePaths() : [];
  return <PublicAnalyticsClient configured={configured} publicPaths={paths} />;
}
