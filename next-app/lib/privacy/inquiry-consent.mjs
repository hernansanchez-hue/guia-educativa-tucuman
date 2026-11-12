import {legalConfig} from '../legal-config.js';

export const INQUIRY_PRIVACY_VERSION = legalConfig.privacyVersion;

// Never infer consent from a plan, an email or a successful delivery.
export function hasInquiryConsent(input) {
  return input?.privacyConsent === true && input?.privacyVersion === INQUIRY_PRIVACY_VERSION;
}
