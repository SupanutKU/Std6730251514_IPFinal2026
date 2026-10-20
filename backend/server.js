import 'dotenv/config';
import {createApp} from './app.js';
import {memoryStore,mysqlStore} from './store.js';
const mode=process.env.STORAGE||'mysql';
if(!['memory','mysql'].includes(mode))throw new Error('STORAGE must be memory or mysql');
try {
 const store=mode==='mysql'?await mysqlStore():memoryStore();
 const server=createApp(store).listen(Number(process.env.PORT||3113),'0.0.0.0',()=>console.log(`HR API ready on port ${process.env.PORT||3113}; storage=${mode}`));
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(async()=>{await store.close();process.exit(0);}));
} catch(error){console.error('Startup failed:',error.message);process.exit(1);}
