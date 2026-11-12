import {requireAdmin} from '../../../../lib/admin/auth';
import SettingsHub from '../../ui/SettingsHub';

export default async function SettingsPage(){
 const {actor}=await requireAdmin();
 return <SettingsHub actor={actor}/>;
}
