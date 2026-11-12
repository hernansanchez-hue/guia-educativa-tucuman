// Metadata for the selector; never enumerate files, drafts, or credentials.
const allowed = (url) => typeof url === 'string' && (/^\/assets\//.test(url) || /^https:\/\//.test(url)) && !/[\s<>\\]/.test(url);
export function previewUrl(url) {
  return typeof url === 'string' && url.startsWith('/media/control/')
    ? url.replace('/media/control/', '/administrador/archivo/')
    : url;
}
export function catalogMedia(entries = []) {
  const assets = new Map();
  const add = (url, name, kind) => {
    if (allowed(url) && !assets.has(url)) assets.set(url, {url, name, kind});
  };
  for (const entry of entries) {
    if (!entry?.payload || entry.visibility === 'hidden') continue;
    const d = entry.payload.data;
    if (!d || d.visible === false) continue;
    const name = d.campusName || d.name || d.degree || 'Recurso publicado';
    for (const [field, label] of [['image','Portada'],['heroImage','Banner'],['logoUrl','Logo'],['logo','Logo']]) add(d[field], name+' · '+label,'image');
    for(const image of d.verifiedGallery || []) add(typeof image==='string'?image:image?.url,name+' · Galería','image');
    add(d.controlCareer?.studyPlanPdf || d.studyPlanPdf,name+' · Plan de estudios','pdf');
  }
  return [...assets.values()];
}
