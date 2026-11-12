import {requireAdmin} from '../../../../../lib/admin/auth';
import {listRedirects} from '../../../../../lib/admin/final-service';
import FinalConsole from '../../../ui/FinalConsole';
export default async function Redirects({searchParams}){const q=await searchParams,{actor}=await requireAdmin('seo'),page=Math.max(1,Math.min(400,Number(q.page)||1));return <FinalConsole mode='redirects' rows={await listRedirects(page)} actor={actor} query={q}/>;}
