import {hasInquiryConsent, INQUIRY_PRIVACY_VERSION} from './inquiry-consent.mjs';

// Immutable notice identifier. Change it whenever either notice fragment changes.
// Its full text is preserved in docs/control/CONSENT-AND-MFA.md and Git history.
export const COMMERCIAL_NOTICE = Object.freeze({
  version: 'contacto-2026-11-15-v1',
  beforeLink: 'Autorizo a GET a registrar y atender esta consulta en su bandeja comercial privada, según la ',
  afterLink: '. No se envía automáticamente a GET Instituciones ni autoriza publicidad ajena a mi consulta.',
});

export function commercialConsent(input) {
  return hasInquiryConsent(input) ? {
    accepted: true, noticeVersion: COMMERCIAL_NOTICE.version,
    privacyVersion: INQUIRY_PRIVACY_VERSION, sourcePath: '/contacto',
  } : null;
}

export function validCommercialEvidence(value) {
  return value?.accepted === true && value.noticeVersion === COMMERCIAL_NOTICE.version
    && value.privacyVersion === INQUIRY_PRIVACY_VERSION && value.sourcePath === '/contacto'
    && Object.keys(value).sort().join(',') === 'accepted,noticeVersion,privacyVersion,sourcePath';
}
