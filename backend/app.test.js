import test from 'node:test';
import assert from 'node:assert/strict';
import {createApp} from './app.js';
import {memoryStore} from './store.js';
import {salaryClusters} from './cluster.js';
test('K-Means: known tiers, empty, repeated and small inputs',()=>{
 assert.deepEqual(salaryClusters([18000,25000,45000,85000,95000]),[{group:'Tier 1',centroid:21500,count:2},{group:'Tier 2',centroid:45000,count:1},{group:'Tier 3',centroid:90000,count:2}]);
 for(const xs of [[],[0],[10,10],[10,20],[5,5,5,5],[0,1,2,100,1000]]){
  const result=salaryClusters(xs);assert.equal(result.length,3);assert.equal(result.reduce((s,g)=>s+g.count,0),xs.length);
  assert.ok(result.every(g=>g.count?Number.isFinite(g.centroid):g.centroid===null));
  assert.ok(Math.abs(result.reduce((s,g)=>s+(g.centroid||0)*g.count,0)-xs.reduce((s,x)=>s+x,0))<=xs.length*.0051);
 }
});
test('API: authentication, CRUD, validation, JSON errors and empty clustering',async()=>{
 const server=createApp(memoryStore()).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 async function call(path,method='GET',body,auth=true){return fetch(base+path,{method,headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer mock-jwt-token'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});}
 try{
  assert.equal((await call('/api/employees','GET',undefined,false)).status,401);
  assert.equal((await call('/api/employees/salary-clusters','GET',undefined,false)).status,401);
  for(const method of ['POST','PUT','DELETE'])assert.equal((await call(method==='POST'?'/api/employees':`/api/employees/1${method==='PUT'?'/status':''}`,method,{},false)).status,401);
  assert.equal((await call('/api/login','POST',{username:'admin',password:'bad'},false)).status,401);
  assert.deepEqual(await (await call('/api/login','POST',{username:'admin',password:'password123'},false)).json(),{success:true,token:'mock-jwt-token'});
  assert.equal((await (await call('/api/employees')).json()).length,5);
  for(const salary of [undefined,null,'',-1,'123',true,{},1.234,1e12])assert.equal((await call('/api/employees','POST',{name:'A',position:'B',salary})).status,400);
  assert.equal((await call('/api/employees','POST',{name:'  ',position:'B',salary:100})).status,400);
  assert.equal((await call('/api/employees','POST',{name:'a'.repeat(101),position:'B',salary:100})).status,400);
  const add=await call('/api/employees','POST',{name:' Test ',position:' QA ',salary:0});assert.equal(add.status,201);const row=await add.json();assert.equal(row.name,'Test');assert.equal(row.status,'Active');
  assert.equal((await(await call(`/api/employees/${row.id}/status`,'PUT')).json()).status,'On Leave');
  assert.equal((await(await call(`/api/employees/${row.id}/status`,'PUT')).json()).status,'Active');
  assert.equal((await call('/api/employees/missing/status','PUT')).status,404);
  assert.equal((await call('/api/employees/missing','DELETE')).status,404);
  assert.equal((await fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{broken'})).status,400);
  let remaining=await(await call('/api/employees')).json();
  assert.deepEqual(remaining.map(e=>e.id),['1','2','3','4','5','6']);
  assert.equal((await call('/api/employees/2','DELETE')).status,200);
  remaining=await(await call('/api/employees')).json();
  assert.deepEqual(remaining.map(e=>e.id),['1','2','3','4','5']);
  while((remaining=await(await call('/api/employees')).json()).length) assert.equal((await call(`/api/employees/${remaining[0].id}`,'DELETE')).status,200);
  assert.deepEqual(await(await call('/api/employees')).json(),[]);
  const result=await(await call('/api/employees/salary-clusters')).json();assert.equal(result.success,true);assert.ok(result.clusters.every(c=>c.count===0&&c.centroid===null));
 }finally{await new Promise(r=>server.close(r));}
});
test('Edit employee persists values, preserves status/ID, rejects invalid input, updates analytics',async()=>{
 const server=createApp(memoryStore()).listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 const data={name:' Updated name ',position:' Updated role ',salary:12345.67};
 const edit=(id,body,auth=true)=>fetch(`${base}/api/employees/${id}`,{method:'PUT',headers:{'Content-Type':'application/json',...(auth?{Authorization:'Bearer mock-jwt-token'}:{})},body:JSON.stringify(body)});
 const get=async path=>(await fetch(base+path,{headers:{Authorization:'Bearer mock-jwt-token'}})).json();
 try {
  assert.equal((await edit('3',data,false)).status,401);
  const response=await edit('3',data);assert.equal(response.status,200);
  const expected={id:'3',name:'Updated name',position:'Updated role',salary:12345.67,status:'On Leave'};
  assert.deepEqual(await response.json(),expected);
  assert.equal((await edit('3',data)).status,200); // unchanged values still succeed
  for(const bad of [{...data,name:' '},{...data,position:''},{...data,salary:-1},{...data,salary:'123'},{...data,salary:1.234}])assert.equal((await edit('3',bad)).status,400);
  assert.equal((await edit('missing',data)).status,404);
  const rows=await get('/api/employees');assert.deepEqual(rows.find(x=>x.id==='3'),expected);assert.equal(rows.length,5);
  const {clusters}=await get('/api/employees/salary-clusters');assert.deepEqual(clusters,salaryClusters(rows.map(x=>x.salary)));
 }finally{await new Promise(r=>server.close(r));}
});
