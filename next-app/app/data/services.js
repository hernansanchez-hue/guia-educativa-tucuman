export const services = [
  ['redes-sociales','Redes Sociales'],['google-ads','Google Ads'],['meta-ads','Meta Ads'],['campana-de-mail','Campaña de mail'],['expos-carreras','Expos carreras'],['eventos','Eventos en ciudades'],['via-publica','Vía pública'],['podcast','Podcast'],['videos-personalizados','Videos personalizados'],['orientacion-vocacional','Orientación vocacional gratuita'],['cursos-gratuitos','Cursos gratuitos'],['convenios','Convenios'],['crm-seguimiento','CRM - Seguimiento'],['cursos-docentes','Cursos docentes'],['oficios','Oficios']
].map(([slug,name])=>({slug,name,description:`Soluciones GET para ${name.toLowerCase()}.`}));
export const getService=(slug)=>services.find((service)=>service.slug===slug);

// Copy comercial temporal: reemplazar estos campos cuando se definan los planes finales.
export const servicePlans = [
  {
    id: 'plan-1',
    name: 'Plan 1',
    description: 'Descripción comercial a definir.',
    priceLabel: 'Modalidad a definir',
    includes: ['Prestación a definir', 'Prestación adicional a definir', 'Alcance a definir'],
  },
  {
    id: 'plan-2',
    name: 'Plan 2',
    description: 'Descripción comercial a definir.',
    priceLabel: 'Modalidad a definir',
    includes: ['Prestación a definir', 'Prestación adicional a definir', 'Alcance a definir'],
  },
  {
    id: 'plan-3',
    name: 'Plan 3',
    description: 'Descripción comercial a definir.',
    priceLabel: 'Modalidad a definir',
    includes: ['Prestación a definir', 'Prestación adicional a definir', 'Alcance a definir'],
  },
];
