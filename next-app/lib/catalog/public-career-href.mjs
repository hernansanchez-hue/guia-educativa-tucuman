import {hasFeaturedCareerProfile} from './profile-presentation.mjs';

export function publicCareerHref(city, institution, career) {
  if (career.publicHref) return career.publicHref;
  const base = `/${city.slug}/${institution.slug}`;
  if (/capacitaci/i.test(institution.type || '')) return `${base}/capacitaciones/${career.slug}`;
  const slug = career.slug === 'licenciatura-en-administracion' ? 'lic-en-administracion' : career.slug;
  return hasFeaturedCareerProfile(institution, career) ? `${base}/carreras/${slug}` : `${base}#carreras`;
}
