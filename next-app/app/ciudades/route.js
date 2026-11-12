// Retired duplicate city directory. Keep old bookmarks with an exact HTTP 301.
export function GET(request) {
 return Response.redirect(new URL("/",request.url),301);
}

