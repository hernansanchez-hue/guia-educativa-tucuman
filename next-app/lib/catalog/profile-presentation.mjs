import {institutionProfileTier} from './commercial-policy.mjs';
const canonical=id=>id==='licenciatura-en-administracion'?'lic-en-administracion':id;
export function selectedProfileCareers(institution){
 if(institutionProfileTier(institution)!=='paid')return [];
 const ids=institution.featuredCareerIds;
 return (institution.careers||[]).filter(c=>c.visible!==false&&(Array.isArray(ids)?ids.some(id=>canonical(id)===canonical(c.id)||id===c.offeringId):c.featured===true)).slice(0,5);
}
export function hasFeaturedCareerProfile(institution,career){return selectedProfileCareers(institution).some(c=>canonical(c.id)===canonical(career.id));}
export function safeStudyPlanPdf(career,offering={}){
 const href=career.studyPlanPdf||career.study_plan_pdf||offering.studyPlanPdf||offering.study_plan_pdf;
 if(typeof href!=='string'||!/^\/(?!\/)|^https:\/\//.test(href))return null;
 return /\.pdf(?:[?#]|$)/i.test(href)?href:null;
}
