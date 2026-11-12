import { serveFile } from '../../../../lib/control/media';
export const dynamic = 'force-dynamic';
export async function GET(req, { params }) {
  return serveFile(req, (await params).id, true);
}
