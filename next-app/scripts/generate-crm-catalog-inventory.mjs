import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {publicIntegrationCatalog, validateIntegrationMap} from '../lib/integration/catalog-map.mjs';

const catalog = publicIntegrationCatalog();
const root = resolve(import.meta.dirname, '../../docs/integration');
const crm = JSON.parse(readFileSync(resolve(root, 'crm-readonly-snapshot.json'), 'utf8'));
const cities = new Map(catalog.cities.map(row => [row.id, row]));
const brands = new Map(catalog.brands.map(row => [row.id, row]));
const careers = new Map(catalog.careers.map(row => [row.id, row]));
const institutions = new Map(catalog.institutions.map(row => [row.id, row]));
const byInstitution = new Map();
const duplicates = [];
const pairSeen = new Map();
const inconsistencies = [];

const offerings = catalog.offerings.map(row => {
  const venue = institutions.get(row.institutionId);
  const master = careers.get(row.careerId);
  if (!venue) inconsistencies.push({type:'offering_without_venue', id:row.id});
  if (!master) inconsistencies.push({type:'offering_without_master', id:row.id});
  const pair = `${row.institutionId}:${row.careerId}`;
  if (pairSeen.has(pair)) duplicates.push({type:'same_venue_master_requires_modality_review', ids:[pairSeen.get(pair),row.id]});
  else pairSeen.set(pair,row.id);
  const item = {publicOfferingId:row.id, publicVenueId:row.institutionId, publicMasterCareerId:row.careerId, masterName:master?.name??null, masterSlug:master?.slug??null, modality:row.modality??null, duration:row.duration??null, citySlug:venue?.citySlug??null, route:venue&&master?`/${venue.citySlug}/${venue.slug}/carreras/${master.slug}`:null, sourceKey:`oferta/${row.id}`};
  if (!byInstitution.has(row.institutionId)) byInstitution.set(row.institutionId,[]);
  byInstitution.get(row.institutionId).push(item.publicOfferingId);
  return item;
}).sort((a,b)=>a.publicOfferingId.localeCompare(b.publicOfferingId));

const venues = catalog.institutions.map(row => {
  const city = cities.get(row.cityId??row.citySlug);
  const brand = brands.get(row.brandId);
  if (!city) inconsistencies.push({type:'venue_without_city',id:row.id});
  if (!brand) inconsistencies.push({type:'venue_without_brand',id:row.id});
  return {publicVenueId:row.id, institutionName:row.name??brand?.name??null, brandId:row.brandId, brandName:brand?.name??null, cityId:city?.id??null, city:city?.name??null, department:city?.department??null, departmentId:city?.departmentId??null, slug:row.slug, sourceKey:`sede/${row.id}`, sourceLocality:row.sourceLocality??null, cueAnexo:row.cueAnexo??null, address:row.address??null, publicOfferingIds:byInstitution.get(row.id)??[]};
}).sort((a,b)=>a.publicVenueId.localeCompare(b.publicVenueId));

const groups = new Map();
for (const venue of venues) {
  if (!groups.has(venue.brandId)) groups.set(venue.brandId,[]);
  groups.get(venue.brandId).push(venue.publicVenueId);
}
const commercialProposals = [...groups].map(([brandId,venueIds])=>({brandId,brandName:brands.get(brandId)?.name??null,publicVenueIds:venueIds,commercialTenantDecision:venueIds.length>1?'requires_commercial_decision':'unverified',crmInstitutionId:null})).sort((a,b)=>a.brandId.localeCompare(b.brandId));
const crossVenueMaster = new Map();
for (const offer of offerings) {
  const brandId = institutions.get(offer.publicVenueId)?.brandId;
  const key = `${brandId}:${offer.publicMasterCareerId}`;
  if (!crossVenueMaster.has(key)) crossVenueMaster.set(key,new Set());
  crossVenueMaster.get(key).add(offer.publicVenueId);
}
const sharedProgramDecisions=[...crossVenueMaster].filter(([,venues])=>venues.size>1).map(([key,venues])=>({brandAndMaster:key,publicVenueIds:[...venues],decision:'Do not share CRM program without tenant and commercial review'}));
const realCrm = crm.institutions.filter(row=>!row.qa);
const realPrograms = crm.programs.filter(row=>!crm.institutions.some(inst=>inst.id===row.institutionId&&inst.qa));
const proposal = {sourceVersion:crm.snapshotDate,crmProjectRef:crm.projectRef,confirmedVenueMappings:{},confirmedOfferingMappings:{},venues:venues.map(row=>({publicVenueId:row.publicVenueId,brandId:row.brandId,crmInstitutionId:null,status:'crm_registration_pending',reason:'No existe vinculación verificada por identificador estable'})),offerings:offerings.map(row=>({publicOfferingId:row.publicOfferingId,publicVenueId:row.publicVenueId,publicMasterCareerId:row.publicMasterCareerId,crmProgramId:null,status:'crm_registration_pending',reason:'No existe programa CRM real verificado'})),commercialProposals};
const pending = {multiVenueGroups:commercialProposals.filter(row=>row.publicVenueIds.length>1),sharedProgramDecisions,possibleDuplicates:duplicates,inconsistencies,qaExcluded:crm.institutions.filter(row=>row.qa).map(row=>({id:row.id,name:row.name})),crmRealInstitutions:realCrm.length,crmRealPrograms:realPrograms.length};
const report = {catalogVersion:catalog.entries.length,counts:{cities:catalog.cities.length,venues:venues.length,brands:groups.size,masters:catalog.careers.length,offerings:offerings.length,multisiteBrandGroups:pending.multiVenueGroups.length},confirmedVenueMappings:0,confirmedOfferingMappings:0,confirmedCommercialTenants:0,crmRealInstitutions:realCrm.length,crmRealPrograms:realPrograms.length,possibleDuplicates:duplicates.length,sharedProgramDecisions:sharedProgramDecisions.length,inconsistencies:inconsistencies.length,validator:validateIntegrationMap({venues:{},offerings:{}},catalog).counts};

mkdirSync(root,{recursive:true});
for (const [name,data] of Object.entries({'venues.json':venues,'offerings.json':offerings,'mapping-proposal.json':proposal,'pending-review.json':pending,'validation-report.json':report})) writeFileSync(resolve(root,name),JSON.stringify(data,null,2)+'\n');
if (venues.length!==125||offerings.length!==198||catalog.careers.length!==195||catalog.cities.length!==27||inconsistencies.length) process.exitCode=1;
console.log(JSON.stringify(report));
