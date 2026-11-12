import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=path=>readFileSync(new URL(path,import.meta.url),"utf8");

test("one shared city banner connects the orientation/expo block to the public agenda",()=>{
 const banner=source("../app/[ciudad]/CityEventsBanner.js");
 assert.ok(banner.includes("Viví la educación más allá del aula."));
 assert.ok(banner.includes("Descubrí ferias, charlas, encuentros y actividades educativas en Tucumán."));
 assert.match(banner,/href="\/eventos">Explorar eventos/);
 assert.match(banner,/aria-labelledby="cityEventsTitle"/);
 const sections=source("../app/[ciudad]/CityInstitutionSections.js");
 assert.equal((sections.match(/<CityEventsBanner\/>/g)||[]).length,1);
 assert.ok(sections.indexOf('id="orientacion"')<sections.indexOf("<CityEventsBanner/>"));
 assert.ok(sections.indexOf("<CityEventsBanner/>")<sections.indexOf('id="instituciones"'));
 assert.ok(!source("../app/components/ApprovedHomeClient.js").includes("CityEventsBanner"));
});

test("hardcoded provincial and city menus do not restore the removed Events navigation",()=>{
 for(const path of ["../app/components/ApprovedHomeClient.js","../app/components/HomeEntryMenu.js","../app/[ciudad]/CityPageClient.js"]){
  const navs=source(path).match(/<nav\b[\s\S]*?<\/nav>/g)||[];
  assert.ok(navs.length>0,path);
  for(const nav of navs)assert.doesNotMatch(nav,/href=["']\/eventos(?:\/|["'])/,path);
 }
});

test("the banner CSS is isolated to city pages and keeps its CTA keyboard accessible",()=>{
 const css=source("../app/[ciudad]/city-events-banner.css");
 assert.ok(css.includes(".get-city-approved .city-events-banner"));
 assert.ok(css.includes("minmax(0, 1fr)"));
 assert.ok(css.includes(":focus-visible"));
 assert.ok(css.includes("@media (max-width: 780px)"));
 assert.ok(css.includes("@media (max-width: 480px)"));
 assert.ok(!css.includes("animation:"));
});
