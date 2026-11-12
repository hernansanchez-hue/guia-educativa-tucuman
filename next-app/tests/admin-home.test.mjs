import test from 'node:test';
import assert from 'node:assert/strict';
import {HOME_CONTENT,seedHomeEntry,homeContentFromEntries,validateHomePayload} from '../lib/admin/home-editorial.mjs';
import {editorialCatalog,pageForEntry,relatedRoutes,validateEditorialPayload} from '../lib/admin/editorial-model.mjs';
import {editorFields,setField} from '../lib/admin/editor-fields.mjs';
import {createContentDocument,saveContentDraft,publishContentDocument,readPublishedContent,createPreviewPayload} from '../lib/admin/content-document.mjs';
const actor={id:'home-domain-test',role:'SUPERADMIN',isActive:true};

test('Home imports exact approved video, logo, title and real panel contents',()=>{
  const entry=seedHomeEntry();assert.deepEqual(entry.payload.data,HOME_CONTENT);
  assert.equal(entry.payload.data.logo,'/assets/get-logo-hero-white.png');
  assert.match(entry.payload.data.video,/v2l8k0maxocxnxf0yerh\.mp4$/);
  assert.equal([entry.payload.data.titleBefore,entry.payload.data.titleHighlight,entry.payload.data.titleAfter].join(' '),'Toda la oferta educativa de Tucumán en un solo lugar');
  assert.equal(entry.moduleId,'home');assert.equal(entry.key,'main');
});
test('Home draft, unsaved preview and discard do not mutate the published version',()=>{
  let document=createContentDocument({moduleId:'home',entityKey:'main',payload:seedHomeEntry().payload,actor});
  document=publishContentDocument(document,{expectedRevision:document.revision,actor});
  const original=readPublishedContent(document),next=setField({root:document.draft},'root.data.titleBefore','Título temporal').root;
  assert.equal(createPreviewPayload(document,next,actor).data.titleBefore,'Título temporal');
  document=saveContentDraft(document,{payload:next,expectedRevision:document.revision,actor});
  assert.deepEqual(readPublishedContent(document),original);
  document=publishContentDocument(document,{expectedRevision:document.revision,actor});
  assert.equal(readPublishedContent(document).data.titleBefore,'Título temporal');assert.equal(document.versions.length,2);
  assert.equal(original.data.titleBefore,HOME_CONTENT.titleBefore);
});
test('Home preview merges only its root without changing the shared catalog',()=>{
  const entry=seedHomeEntry();entry.payload.data.hint='Indicación temporal';
  const before=editorialCatalog(),after=editorialCatalog([entry]);
  const page=pageForEntry(after,entry);assert.equal(page.kind,'home');assert.equal(page.props.content.hint,'Indicación temporal');
  assert.deepEqual(after.cities,before.cities);assert.deepEqual(after.offerings,before.offerings);
});
test('Home publication targets only /; imported payload has no arbitrary blocks',()=>{
  const entry=seedHomeEntry();assert.deepEqual(relatedRoutes(editorialCatalog([entry]),[entry]),['/']);
  assert.throws(()=>validateEditorialPayload({...entry.payload,data:{...entry.payload.data,sections:['footer']}}));
  assert.throws(()=>homeContentFromEntries([{moduleId:'home',key:'main',visibility:'hidden',payload:null}]));
});
test('Home rejects unsafe resources, changed identity and dangerous design dimensions',()=>{
  const p=seedHomeEntry().payload;
  for(const logo of ['javascript:x','http://unsafe.test/a.png','//unsafe.test/a.png','/admin/media/a.png'])assert.throws(()=>validateHomePayload({...p,data:{...p.data,logo}}));
  assert.throws(()=>validateHomePayload({...p,data:{...p.data,id:'other'}}));
  assert.throws(()=>validateHomePayload({...p,data:{...p.data,titleBefore:'<script>x</script>'}}));
  for(const design of [{titleSize:100},{logoSize:1000},{overlay:0},{align:'right'},{css:'color:red'}])assert.throws(()=>validateHomePayload({...p,design}));
});
test('Home SEO includes separate OG fields and human editor tabs, without JSON controls',()=>{
  const fields=editorFields('home'),all=Object.values(fields).flat();
  for(const path of ['root.seo.title','root.seo.description','root.seo.ogTitle','root.seo.ogDescription','root.seo.image','root.seo.noindex'])assert.ok(all.some(f=>f.path===path));
  assert.ok(fields['Mapa y selector']);assert.ok(!all.some(f=>/json|uuid|entityKey/.test(f.path)));
  assert.deepEqual(validateHomePayload({...seedHomeEntry().payload,seo:{ogTitle:'GET',ogDescription:'Texto',noindex:true}}).seo,{ogTitle:'GET',ogDescription:'Texto',noindex:true});
});
