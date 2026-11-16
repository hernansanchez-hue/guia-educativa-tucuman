import test from 'node:test';
import assert from 'node:assert/strict';
import guard,{config} from '../netlify/edge-functions/public-inquiry-guard.js';

test('distributed limit uses Netlify edge config, not per-instance memory',()=>{
 assert.equal(config.path,'/api/public-inquiries');assert.equal(config.method,'POST');
 assert.equal(config.onError,'fail');assert.deepEqual(config.rateLimit,{windowLimit:30,windowSize:60,aggregateBy:['ip','domain']});
});
test('edge preserves the Next.js route response, body, headers and receipt',async()=>{
 let calls=0;
 const request=new Request('https://get.example/api/public-inquiries',{method:'POST',body:'not-read-by-edge'});
 const response=await guard(request,{next:async()=>{calls++;return Response.json({ok:true,receiptId:'isolated-receipt'},{status:201,headers:{'Cache-Control':'no-store','X-Test':'kept'}});}});
 assert.equal(request.bodyUsed,false);assert.equal(calls,1);assert.equal(response.status,201);
 assert.equal(response.headers.get('X-Test'),'kept');assert.equal(response.headers.get('Cache-Control'),'no-store');
 assert.equal(response.headers.get('X-GET-Inquiry-Guard'),'v1');assert.deepEqual(await response.json(),{ok:true,receiptId:'isolated-receipt'});
});
test('edge does not convert a rejected request to a successful consultation',async()=>{
 const response=await guard(null,{next:async()=>Response.json({ok:false,message:'Solicitud inválida'},{status:400})});
 assert.equal(response.status,400);assert.equal((await response.json()).ok,false);
});
