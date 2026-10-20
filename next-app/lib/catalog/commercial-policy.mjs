/** Explicit plan/flags or an editorial featured selection are the commercial contract. */
export function isPremiumInstitution(institution,city) {
 if(institution?.featured===false||institution?.premium===false)return false;
 return !!institution&&(institution.premium===true||institution.plan==='Premium'||institution.featured===true||city?.featuredInstitutionIds?.includes(institution.id)===true);
}
export function isPremiumCareer(career,institution,city) {
 if(career?.featured===false||career?.premium===false)return false;
 return !!career&&(career.premium===true||career.featured===true||isPremiumInstitution(institution,city));
}
