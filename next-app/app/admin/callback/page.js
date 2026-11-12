import AuthCallbackClient from "./AuthCallbackClient";
import { requireSupabaseConfiguration } from "../../../lib/admin/environment.mjs";

export default function AuthCallbackPage() {
  const { url, key } = requireSupabaseConfiguration(process.env);
  return <AuthCallbackClient config={{ url, key }} />;
}
