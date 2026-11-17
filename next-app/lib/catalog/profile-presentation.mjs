import {institutionProfileTier} from './commercial-policy.mjs';
const canonical=id=>id==='licenciatura-en-administracion'?'lic-en-administracion':id;
export function selectedProfileCareers(institution){
 if(institutionProfileTier(institution)!=='paid')return [];
 const ids=institution.featuredCareerIds;
 const options=(institution.careers||[]).filter(c=>c.visible!==false);
 return (Array.isArray(ids)?ids.map(id=>options.find(c=>id===c.offeringId||canonical(id)===canonical(c.id))).filter(Boolean):options.filter(c=>c.featured===true)).slice(0,5);
}
export function hasFeaturedCareerProfile(institution,career){return selectedProfileCareers(institution).some(c=>canonical(c.id)===canonical(career.id));}
// The published plan and the exact territorial card grant access, never editorial placement.
export function allowsCareerInquiry(institution, offeringId) {
 if (typeof offeringId !== 'string' || !offeringId || institution?.plan?.trim().toLowerCase() !== 'premium' ||
     institution.visible === false || institution.formEnabled === false) return false;
 return selectedProfileCareers(institution).some(card =>
   card.offeringId === offeringId && card.formEnabled !== false);
}
export function safeStudyPlanPdf(career,offering={}){
 const href=career.studyPlanPdf||career.study_plan_pdf||offering.studyPlanPdf||offering.study_plan_pdf;
 if(typeof href!=='string'||!/^\/(?!\/)|^https:\/\//.test(href))return null;
 return /\.pdf(?:[?#]|$)/i.test(href)?href:null;
}
