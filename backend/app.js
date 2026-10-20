import express from 'express';
import cors from 'cors';
import {salaryClusters} from './cluster.js';
export function createApp(store) {
 const app=express();
 app.use(cors());app.use(express.json({limit:'16kb'}));
 const run=fn=>(req,res,next)=>Promise.resolve(fn(req,res,next)).catch(next);
 app.get('/api/health',(req,res)=>res.json({success:true,service:'horizon-hr-api',version:'2026-10-20-edit-route-fix'}));
 app.post('/api/login',(req,res)=>{
  if(req.body?.username==='admin' && req.body?.password==='password123') return res.json({success:true,token:'mock-jwt-token'});
  res.status(401).json({success:false,message:'Invalid username or password'});
 });
 app.use('/api/employees',(req,res,next)=>{
  if(req.headers.authorization!=='Bearer mock-jwt-token')return res.status(401).json({success:false,message:'Unauthorized. Please log in.'});
  next();
 });
 app.get('/api/employees/salary-clusters',run(async(req,res)=>res.json({success:true,clusters:salaryClusters((await store.all()).map(x=>Number(x.salary)))})));
 app.get('/api/employees',run(async(req,res)=>res.json(await store.all())));
 const validateEmployee=(req,res,next)=>{
  const {name,position,salary}=req.body||{};
  if(typeof name!=='string'||!name.trim()||name.trim().length>100||typeof position!=='string'||!position.trim()||position.trim().length>100)
   return res.status(400).json({success:false,message:'Name and position are required (maximum 100 characters each).'});
  if(typeof salary!=='number'||!Number.isFinite(salary)||salary<0||salary>9999999999.99||Math.abs(salary*100-Math.round(salary*100))>0.0001)
   return res.status(400).json({success:false,message:'Salary must be a number from 0 to 9999999999.99 with at most 2 decimal places.'});
  req.employeeData={name:name.trim(),position:position.trim(),salary};next();
 };
 app.post('/api/employees',validateEmployee,run(async(req,res)=>res.status(201).json(await store.add(req.employeeData))));
 const updateEmployee=run(async(req,res)=>{
  const row=await store.update(req.params.id,req.employeeData);
  if(!row)return res.status(404).json({success:false,message:'Employee not found'});
  res.json(row);
 });
 // Support PUT (primary), PATCH, and POST for compatibility with older frontends/proxies.
 app.put('/api/employees/:id',validateEmployee,updateEmployee);
 app.patch('/api/employees/:id',validateEmployee,updateEmployee);
 app.post('/api/employees/:id',validateEmployee,updateEmployee);
 app.param('id',(req,res,next,id)=>{if(id.length>36)return res.status(400).json({success:false,message:'Invalid employee ID'});next();});
 app.put('/api/employees/:id/status',run(async(req,res)=>{const row=await store.toggle(req.params.id);if(!row)return res.status(404).json({success:false,message:'Employee not found'});res.json(row);}));
 app.delete('/api/employees/:id',run(async(req,res)=>{if(!await store.remove(req.params.id))return res.status(404).json({success:false,message:'Employee not found'});res.json({success:true});}));
 app.use((req,res)=>res.status(404).json({success:false,message:'Endpoint not found'}));
 app.use((err,req,res,next)=>{
  if(err.type==='entity.parse.failed')return res.status(400).json({success:false,message:'Invalid JSON body'});
  if(err.type==='entity.too.large')return res.status(413).json({success:false,message:'Request body too large'});
  console.error(err.message);res.status(500).json({success:false,message:'Server error. Please try again.'});
 });return app;
}
