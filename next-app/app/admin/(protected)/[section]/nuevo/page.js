import {notFound} from 'next/navigation';
import {EDITOR_TYPES} from '../../../../../lib/admin/editorial-model.mjs';
import {requireAdmin} from '../../../../../lib/admin/auth';
import {getPublishedCatalog} from '../../../../../lib/admin/published-editorial';
import NewEntityWizard from '../../../ui/NewEntityWizard';
export default async function NewPage({params}){const {section}=await params;if(!EDITOR_TYPES[section])notFound();await requireAdmin('edit');return <NewEntityWizard type={section} catalog={await getPublishedCatalog({fresh:true})}/>;}
