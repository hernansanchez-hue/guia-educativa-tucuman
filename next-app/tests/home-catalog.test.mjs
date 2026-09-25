import assert from "node:assert/strict";
import test from "node:test";
import { getHomeCatalog, getLocalHomeCatalog } from "../lib/public-catalog/home-catalog.js";
const env={PUBLIC_CATALOG_SOURCE:"supabase",SUPABASE_URL:"https://example.test",SUPABASE_PUBLISHABLE_KEY:"sb_publishable_test"};
const fetchImpl=async()=>({ok:true,json:async()=>[{id:"uuid",slug:"concepcion",name:"Concepción",is_visible:true,publication_status:"published"},{id:"uuid2",slug:"monteros",name:"Monteros",is_visible:true,publication_status:"published"},{id:"uuid3",slug:"aguilares",name:"Aguilares",is_visible:true,publication_status:"published"}]});
test("local and Supabase home cities share the visible shape",async()=>{assert.deepEqual(await getHomeCatalog({env,fetchImpl}),getLocalHomeCatalog());});
test("local is default and UUID is hidden",async()=>{assert.deepEqual(await getHomeCatalog({env:{}}),getLocalHomeCatalog());assert.equal(JSON.stringify(await getHomeCatalog({env,fetchImpl})).includes("uuid"),false);});
