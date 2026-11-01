const GET_INSTITUCIONES_URL = "https://get-instituciones.netlify.app/";

export function GET() {
  return Response.redirect(GET_INSTITUCIONES_URL, 302);
}
