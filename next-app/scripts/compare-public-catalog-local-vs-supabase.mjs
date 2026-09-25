import { careers } from "../app/data/careers.js";
import { institutions, cityPages } from "../app/data/institutions.js";
import { offerings } from "../app/data/offerings.js";
import { trainingOfferings } from "../app/data/trainingOfferings.js";
import { trainingPrograms } from "../app/data/trainingPrograms.js";
import { getSupabaseAcademicOfferings, getSupabaseCareerMasters, getSupabaseCities, getSupabaseInstitutions, getSupabaseTrainingOfferings, getSupabaseTrainingPrograms } from "../lib/public-catalog/supabase-public-catalog.js";

const fields = {
  cities: ["slug","name","title","display_order","is_active","visual_metadata"],
  institutions: ["legacy_key","city_slug","slug","name","type","logo_text","plan","slogan","description","address","whatsapp","website","opening_hours","hero_image_url","media_label","gallery","cities_label","display_order","is_featured","is_active","visual_metadata"],
  career_masters: ["legacy_key","slug","name","description","graduate_profile","work_field","study_plan","requirements","faq","status","is_active"],
  academic_offerings: ["legacy_key","institution_legacy_key","career_slug","city_slug","modality","duration","degree","campus","shifts","national_validity","image_url","badge","display_order","form_enabled","whatsapp","is_visible","publication_status","metadata"],
  training_programs: ["legacy_key","slug","name","description","profile","work_field","contents","requirements","faq","status","is_active"],
  training_offerings: ["legacy_key","institution_legacy_key","training_program_slug","city_slug","modality","duration","certification","campus","shifts","national_validity","image_url","badge","display_order","form_enabled","whatsapp","is_visible","publication_status","metadata"],
};
function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  return value;
}

const stringify = (value) => JSON.stringify(canonicalize(value));
const cityLocal = Object.values(cityPages).map((city, index) => ({ slug:city.slug, name:city.name, title:city.title, display_order:index + 1, is_active:true, visual_metadata:{ institutionIds:city.institutionIds, featuredInstitutionIds:city.featuredInstitutionIds, ...(city.canonicalDataNotice ? { canonicalDataNotice:city.canonicalDataNotice } : {}) } }));
const institutionLocal = institutions.map((institution) => ({ legacy_key:institution.id, city_slug:institution.citySlug, slug:institution.slug, name:institution.name, type:institution.type, logo_text:institution.logo, plan:institution.plan, slogan:institution.slogan, description:institution.description, address:institution.address, whatsapp:institution.whatsapp, website:null, opening_hours:null, hero_image_url:institution.image, media_label:institution.media, gallery:institution.gallery, cities_label:institution.cities, display_order:cityPages[institution.citySlug].institutionIds.indexOf(institution.id) + 1, is_featured:cityPages[institution.citySlug].featuredInstitutionIds.includes(institution.id), is_active:true, visual_metadata:institution.canonicalDataNotice ? { canonicalDataNotice:institution.canonicalDataNotice } : {} }));
const careerLocal = careers.map((career) => ({ legacy_key:career.id, slug:career.slug, name:career.name, description:career.description, graduate_profile:career.graduateProfile, work_field:career.workField, study_plan:career.studyPlan, requirements:career.requirements, faq:career.faq, status:"published", is_active:true }));
const academicLocal = offerings.map((offering) => ({ legacy_key:offering.id, institution_legacy_key:offering.institutionId, career_slug:offering.careerId === "licenciatura-en-administracion" ? "lic-en-administracion" : offering.careerId, city_slug:offering.citySlug, modality:offering.modality, duration:offering.duration, degree:offering.degree, campus:offering.campus ?? null, shifts:offering.shifts, national_validity:offering.nationalValidity, image_url:offering.image, badge:offering.badge, display_order:offering.order, form_enabled:offering.formEnabled, whatsapp:offering.whatsapp ?? null, is_visible:offering.visible, publication_status:offering.publicationStatus ?? "published", metadata:{} }));
const trainingProgramLocal = trainingPrograms.map((program) => ({ legacy_key:program.id, slug:program.slug, name:program.name, description:program.description, profile:program.profile, work_field:program.workField, contents:program.contents, requirements:program.requirements, faq:program.faq, status:program.status, is_active:true }));
const trainingOfferingLocal = trainingOfferings.map((offering) => ({ legacy_key:offering.id, institution_legacy_key:offering.institutionId, training_program_slug:offering.trainingProgramId, city_slug:offering.citySlug, modality:offering.modality, duration:offering.duration, certification:offering.certification, campus:offering.campus ?? null, shifts:offering.shifts, national_validity:offering.nationalValidity, image_url:offering.image, badge:offering.badge, display_order:offering.order, form_enabled:offering.formEnabled, whatsapp:offering.whatsapp ?? null, is_visible:offering.visible, publication_status:offering.publicationStatus, metadata:{} }));

const [cities, remoteInstitutions, careerMasters, academicOfferings, remoteTrainingPrograms, remoteTrainingOfferings] = await Promise.all([getSupabaseCities(),getSupabaseInstitutions(),getSupabaseCareerMasters(),getSupabaseAcademicOfferings(),getSupabaseTrainingPrograms(),getSupabaseTrainingOfferings()]);
const cityById = new Map(cities.map((row) => [row.id,row.slug]));
const institutionById = new Map(remoteInstitutions.map((row) => [row.id,row]));
const careerById = new Map(careerMasters.map((row) => [row.id,row.slug]));
const trainingById = new Map(remoteTrainingPrograms.map((row) => [row.id,row.slug]));
const remote = {
  cities: cities.map(({id,created_at,updated_at,...row}) => row),
  institutions: remoteInstitutions.map(({id,city_id,created_at,updated_at,...row}) => ({...row,city_slug:cityById.get(city_id)})),
  career_masters: careerMasters.map(({id,created_at,updated_at,...row}) => row),
  academic_offerings: academicOfferings.map(({id,institution_id,career_master_id,created_at,updated_at,...row}) => ({...row,institution_legacy_key:institutionById.get(institution_id)?.legacy_key,career_slug:careerById.get(career_master_id),city_slug:cityById.get(institutionById.get(institution_id)?.city_id)})),
  training_programs: remoteTrainingPrograms.map(({id,created_at,updated_at,...row}) => row),
  training_offerings: remoteTrainingOfferings.map(({id,institution_id,training_program_id,created_at,updated_at,...row}) => ({...row,institution_legacy_key:institutionById.get(institution_id)?.legacy_key,training_program_slug:trainingById.get(training_program_id),city_slug:cityById.get(institutionById.get(institution_id)?.city_id)})),
};
const local = { cities:cityLocal, institutions:institutionLocal, career_masters:careerLocal, academic_offerings:academicLocal, training_programs:trainingProgramLocal, training_offerings:trainingOfferingLocal };
const identities = { cities:"slug", institutions:"legacy_key", career_masters:"slug", academic_offerings:"legacy_key", training_programs:"slug", training_offerings:"legacy_key" };
const result = { counts:{}, missingLocal:[], missingRemote:[], unexpectedRemote:[], fieldMismatches:[] };
for (const [entity, identity] of Object.entries(identities)) {
  const localMap = new Map(local[entity].map((row) => [row[identity],row]));
  const remoteMap = new Map(remote[entity].map((row) => [row[identity],row]));
  for (const key of localMap.keys()) if (!remoteMap.has(key)) result.missingRemote.push(`${entity}:${key}`);
  for (const key of remoteMap.keys()) if (!localMap.has(key)) result.unexpectedRemote.push(`${entity}:${key}`);
  for (const [key, localRow] of localMap) { const remoteRow=remoteMap.get(key); if (!remoteRow) continue; for (const field of fields[entity]) if (stringify(localRow[field]) !== stringify(remoteRow[field])) result.fieldMismatches.push({entity,identity:key,field,local:localRow[field],remote:remoteRow[field]}); }
  result.counts[entity]={local:localMap.size,remote:remoteMap.size};
}
const count = (rows,predicate) => rows.filter(predicate).length;
const checks = [
  ["Siglo 21 multisede",count(remote.institutions,(row)=>row.slug === "universidad-siglo-21") === 3],
  ["Santa Bárbara multisede",count(remote.institutions,(row)=>row.slug === "instituto-santa-barbara") === 2],
  ["Abogacía",count(remote.career_masters,(row)=>row.slug === "abogacia") === 1 && count(remote.academic_offerings,(row)=>row.career_slug === "abogacia") === 3],
  ["Diagnóstico",count(remote.career_masters,(row)=>row.slug === "diagnostico-por-imagenes") === 1 && count(remote.academic_offerings,(row)=>row.career_slug === "diagnostico-por-imagenes") === 2],
  ["Administración",count(remote.career_masters,(row)=>row.slug === "lic-en-administracion") === 1 && count(remote.career_masters,(row)=>row.slug === "licenciatura-en-administracion") === 0],
  ["Academia académica",count(remote.academic_offerings,(row)=>row.institution_legacy_key === "academia-profesional-norte-aguilares") === 3],
  ["Academia training",count(remote.training_offerings,(row)=>row.institution_legacy_key === "academia-profesional-norte-aguilares") === 0],
  ["Centro Formación training",remote.training_programs.length === 3 && count(remote.training_offerings,(row)=>row.institution_legacy_key === "centro-de-formacion-tucuman-monteros") === 3],
];
const failedChecks=checks.filter(([,passed])=>!passed).map(([name])=>name);
for (const [entity,countResult] of Object.entries(result.counts)) console.log(`${entity}: ${countResult.local}/${countResult.remote} OK`);
console.log(`field mismatches: ${result.fieldMismatches.length}`);
console.log(`missing local records: ${result.missingLocal.length}`);
console.log(`missing remote records: ${result.missingRemote.length}`);
console.log(`unexpected remote records: ${result.unexpectedRemote.length}`);
console.log(`TOTAL: ${Object.values(result.counts).reduce((total,row)=>total + row.local,0)}/${Object.values(result.counts).reduce((total,row)=>total + row.remote,0)}`);
if (result.fieldMismatches.length || result.missingLocal.length || result.missingRemote.length || result.unexpectedRemote.length || failedChecks.length) {
  for (const mismatch of result.fieldMismatches) console.error(`mismatch ${mismatch.entity}:${mismatch.identity}.${mismatch.field}\n  local: ${stringify(mismatch.local)}\n  remote: ${stringify(mismatch.remote)}`);
  for (const item of result.missingLocal) console.error(`missing local: ${item}`);
  for (const item of result.missingRemote) console.error(`missing remote: ${item}`);
  for (const item of result.unexpectedRemote) console.error(`unexpected remote: ${item}`);
  for (const item of failedChecks) console.error(`special validation failed: ${item}`);
  process.exitCode=1;
}
