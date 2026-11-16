import {institutionPageFromCatalog} from './editorial-model.mjs';
import {institutionDesignPage} from '../catalog/institution-design.mjs';
import {selectedProfileCareers} from '../catalog/profile-presentation.mjs';

export function eligibleCareerPaths(catalog) {
 const paths = new Set();
 for(const institution of catalog.institutions) {
  const page = institutionDesignPage(catalog,institutionPageFromCatalog(catalog,institution.citySlug,institution.slug));
  for(const career of selectedProfileCareers(page?.institution)) if(career.routePath?.includes('/carreras/')) paths.add(career.routePath);
 }
 return paths;
}
export function indexablePublicPaths(paths,catalog,extended,homeSeo={}){
 const careerPaths = eligibleCareerPaths(catalog);
 const flags=new Map(),set=(path,seo)=>flags.set(path,seo||{});
 set('/',homeSeo);
 for(const c of catalog.cities)set('/'+c.slug,c.cmsSeo);
 for(const i of catalog.institutions){set('/'+i.citySlug+'/'+i.slug,i.cmsSeo);const brand=catalog.brands.find(b=>b.id===i.brandId);set('/instituciones/'+i.slug,brand?.cmsSeo);}
 for(const c of catalog.careers)set('/carreras/'+c.slug,c.cmsSeo);
 for(const o of catalog.offerings){const i=catalog.institutions.find(i=>i.id===o.institutionId),c=catalog.careers.find(c=>c.id===o.careerId);if(i&&c)set('/'+i.citySlug+'/'+i.slug+'/carreras/'+c.slug,o.cmsSeo);}
 for(const e of extended.events)set('/eventos/'+e.slug,e.cmsSeo);
 for(const e of extended.services)set('/servicios/'+e.slug,e.cmsSeo);
 for(const o of extended.trainingOfferings){const i=catalog.institutions.find(i=>i.id===o.institutionId),p=extended.trainings.find(p=>p.id===o.trainingProgramId);if(i&&p)set('/'+i.citySlug+'/'+i.slug+'/capacitaciones/'+p.slug,o.cmsSeo);}
 for(const [path,entity]of [['/eventos',extended.eventsPage],['/servicios',extended.servicesPage],['/nosotros',extended.about]])set(path,entity?.cmsSeo);
 return [...new Set(paths)].filter(path=>!/^\/(?:admin|administrador|api|media|docs)(?:\/|$)/.test(path)&&path!=='/ciudades'&&(!/^\/[^/]+\/[^/]+\/carreras\//.test(path)||careerPaths.has(path))&&flags.get(path)?.noindex!==true&&(!flags.get(path)?.canonical||flags.get(path).canonical===path));
}
