
import {consoleQuery} from '../../../../lib/admin/final-service';
import BannerIndex from '../../ui/BannerIndex';
import {requireAdmin} from '../../../../lib/admin/auth';
export default async function BannersPage(){
 await requireAdmin('settings');
 const rows=await consoleQuery('banners');
 const routes={home:'home',cities:'ciudades',institutions:'instituciones',careers:'carreras',events:'eventos',services:'servicios',trainings:'capacitaciones',about:'nosotros'};
 return <BannerIndex rows={rows.map(r=>({...r,href:r.module_id==='home'?'/admin/home':r.module_id==='about'?'/admin/nosotros':'/admin/'+routes[r.module_id]+'/'+(['events-page','services-page'].includes(r.kind)?'pagina':r.id)}))}/>;
}
