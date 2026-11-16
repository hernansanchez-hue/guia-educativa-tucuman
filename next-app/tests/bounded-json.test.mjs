import test from 'node:test';
import assert from 'node:assert/strict';
import {readBoundedJson} from '../lib/security/bounded-json.mjs';

function streamed(chunks, headers = {}) {
  let reads = 0, cancelled = false;
  const body = new ReadableStream({pull(controller) {if(reads < chunks.length) controller.enqueue(chunks[reads++]);else controller.close();},cancel(){cancelled = true;}}, {highWaterMark: 0});
  return {request: {headers: new Headers(headers),body}, state:()=>({reads,cancelled})};
}
const bytes = value => new TextEncoder().encode(value);
test('bounded JSON parses UTF-8 split across chunks and does not count characters as bytes', async()=>{
  const data=bytes('{"name":"á"}');
  const input=streamed([data.slice(0,10),data.slice(10)]);
  assert.deepEqual(await readBoundedJson(input.request,data.byteLength),{value:{name:'á'}});
  assert.equal((await readBoundedJson(streamed([data]).request,data.byteLength-1)).status,413);
});
test('oversized Content-Length is rejected without reading or allocating full body',async()=>{
  const input=streamed([bytes('{}')],{'content-length':'999999999'});
  assert.equal((await readBoundedJson(input.request,8192)).status,413);
  assert.deepEqual(input.state(),{reads:0,cancelled:true});
});
test('chunked/lying length cannot bypass byte limit; remaining stream is cancelled',async()=>{
  for(const headers of [{},{'content-length':'2'}]) {
    const input=streamed([bytes('a'.repeat(4096)),bytes('a'.repeat(4097)),bytes('not-read')],headers);
    assert.equal((await readBoundedJson(input.request,8192)).status,413);
    assert.deepEqual(input.state(),{reads:2,cancelled:true});
  }
});
test('missing body, invalid JSON and malformed UTF-8 fail with 400',async()=>{
  assert.equal((await readBoundedJson({headers:new Headers(),body:null},100)).status,400);
  for(const data of [bytes('{'),new Uint8Array([0xff])]) assert.equal((await readBoundedJson(streamed([data]).request,100)).status,400);
});
