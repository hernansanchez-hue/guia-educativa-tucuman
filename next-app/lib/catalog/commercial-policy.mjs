/** Profile presentation approved by GET on 2026-10-30.
 * Editorial placement is deliberately not evidence of a paid subscription.
 * Missing/unknown plans remain pending; no catalog data is changed here.
 */
export function institutionProfileTier(institution) {
 const plan=typeof institution?.plan==='string'
  ? institution.plan.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()
  : '';
 if(plan==='premium'||plan==='profesional')return 'paid';
 if(plan==='basico')return 'free';
 return 'pending';
}

export function institutionProfileCapabilities(institution) {
 const tier=institutionProfileTier(institution),paid=tier==='paid';
 return Object.freeze({tier,classificationPending:tier==='pending',
  animatedCover:paid,gallery:paid,institutionWhatsApp:paid,
  maxFeaturedCareers:paid?5:0});
}

/** Explicit plan/flags or an editorial featured selection are the commercial contract. */
export function isPremiumInstitution(institution,city) {
 if(institution?.featured===false||institution?.premium===false)return false;
 return !!institution&&(institution.premium===true||institution.plan==='Premium'||institution.featured===true||city?.featuredInstitutionIds?.includes(institution.id)===true);
}
export function isPremiumCareer(career,institution,city) {
 if(career?.featured===false||career?.premium===false)return false;
 return !!career&&(career.premium===true||career.featured===true||isPremiumInstitution(institution,city));
}
