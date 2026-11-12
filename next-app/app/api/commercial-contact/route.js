import {handleCommercialContact} from '../../../lib/integration/commercial-contact.mjs';
import {commercialContactPersistence} from '../../../lib/control/commercial-inbox-server';

export const runtime = 'nodejs';

export async function POST(request) {
  return handleCommercialContact(request,{persistence:commercialContactPersistence()});
}
