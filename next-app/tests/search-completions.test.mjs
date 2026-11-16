import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {completedSearchGate} from '../lib/analytics/search-completions.mjs';

test('counts only explicit completion; Enter, submit and selected result deduplicate without sending text',()=>{
 const events=[],complete=completedSearchGate((...args)=>events.push(args));
 const input={value:''};
 assert.equal(complete(input),false);
 input.value='private@example.test';assert.equal(events.length,0);
 assert.equal(complete(input),true);assert.equal(complete(input),false);assert.equal(complete(input),false);
 assert.deepEqual(events,[[]]);
 input.value='another query';assert.equal(complete(input),true);
 assert.deepEqual(events,[[],[]]);
 assert.equal(complete({value:'second field'}),true);
});
test('analytics subscribes to completion, never input debounce or typing pauses',()=>{
 const source=readFileSync(new URL('../app/components/PublicAnalyticsClient.js',import.meta.url),'utf8');
 assert.ok(source.includes("document.addEventListener('submit'"));
 assert.ok(source.includes("event.key === 'Enter' && !event.isComposing"));
 assert.ok(source.includes('[data-get-search-result]'));
 assert.ok(!source.includes("addEventListener('input'"));
 assert.ok(!source.includes('setTimeout('));
});
