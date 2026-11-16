// Netlify enforces this counter at its edge, not in a Next.js process.
// No user data, credentials, request body or CRM routing live in this function.
export default async function publicInquiryGuard(_request, context) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('X-GET-Inquiry-Guard', 'v1');
  return new Response(response.body, {status: response.status, statusText: response.statusText, headers});
}

export const config = {
  path: '/api/public-inquiries',
  method: 'POST',
  onError: 'fail',
  rateLimit: {windowLimit: 30, windowSize: 60, aggregateBy: ['ip', 'domain']},
};
