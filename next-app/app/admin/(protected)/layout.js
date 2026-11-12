import { requireAdmin } from "../../../lib/admin/auth";
import AdminShell from '../ui/AdminShell';
export default async function ProtectedLayout({ children }) {
  const {actor}=await requireAdmin();
  return <AdminShell actor={actor}>{children}</AdminShell>;
}
