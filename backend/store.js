import {randomUUID} from 'node:crypto';
export const seed = [
 {id:'1',name:'John Doe',position:'Software Engineer',status:'Active',salary:45000},
 {id:'2',name:'Jane Smith',position:'HR Officer',status:'Active',salary:25000},
 {id:'3',name:'Somchai Jaidee',position:'Office Assistant',status:'On Leave',salary:18000},
 {id:'4',name:'Supanut',position:'Senior Developer',status:'Active',salary:85000},
 {id:'5',name:'Anna Lee',position:'IT Manager',status:'Active',salary:95000}
];
export function memoryStore() {
 const rows=structuredClone(seed);
 const renumber=()=>rows.forEach((row,index)=>{row.id=String(index+1);});
 return {
  all:async()=>structuredClone(rows).sort((a,b)=>Number(a.id)-Number(b.id)),
  add:async data=>{const row={id:String(rows.length+1),...data,status:'Active'};rows.push(row);return {...row};},
  update:async(id,data)=>{const row=rows.find(x=>x.id===id);if(!row)return null;Object.assign(row,data);return {...row};},
  toggle:async id=>{const row=rows.find(x=>x.id===id);if(!row)return null;row.status=row.status==='Active'?'On Leave':'Active';return {...row};},
  remove:async id=>{const i=rows.findIndex(x=>x.id===id);if(i<0)return false;rows.splice(i,1);renumber();return true;},
  close:async()=>{}
 };
}
export async function mysqlStore() {
 const {default:mysql}=await import('mysql2/promise');
 const pool=mysql.createPool({host:process.env.DB_HOST||'localhost',port:Number(process.env.DB_PORT||3306),database:process.env.DB_NAME||process.env.DB_DATABASE||'ip_std6730251514',user:process.env.DB_USER,password:process.env.DB_PASSWORD,waitForConnections:true,connectionLimit:5,decimalNumbers:true,charset:'utf8mb4'});
 const table='`Supanut_6730251514_Employees`';
 const prefix='Supanut_6730251514_';
 const columns=['id','name','position','status','salary'].map(c=>`\`${prefix}${c}\` AS \`${c}\``).join(', ');
 const idCol=`\`${prefix}id\``;
 try {
  await pool.execute(`SELECT ${columns} FROM ${table} LIMIT 0`);
  // Normalize old UUID IDs and any gaps to 1..N while preserving numeric IDs first.
  const [current]=await pool.execute(`SELECT ${idCol} AS id FROM ${table} ORDER BY CASE WHEN ${idCol} REGEXP '^[0-9]+$' THEN 0 ELSE 1 END, CAST(${idCol} AS UNSIGNED), ${idCol}`);
  if(current.length){
   const connection=await pool.getConnection();
   try {
    await connection.beginTransaction();
    for(const row of current) await connection.execute(`UPDATE ${table} SET ${idCol}=? WHERE ${idCol}=?`, [`tmp-${randomUUID()}`, row.id]);
    for(let i=0;i<current.length;i++) await connection.execute(`UPDATE ${table} SET ${idCol}=? WHERE ${idCol}=?`, [String(i+1), `tmp-${current[i].id}`]);
    await connection.commit();
   }catch(error){await connection.rollback();throw error;}finally{connection.release();}
  }
 } catch(error){await pool.end();throw error;}
 const renumber=async(connection)=>{
  const [rows]=await connection.execute(`SELECT ${idCol} AS id FROM ${table} ORDER BY CASE WHEN ${idCol} REGEXP '^[0-9]+$' THEN 0 ELSE 1 END, CAST(${idCol} AS UNSIGNED), ${idCol}`);
  for(const row of rows) await connection.execute(`UPDATE ${table} SET ${idCol}=? WHERE ${idCol}=?`, [`tmp-${randomUUID()}`,row.id]);
  for(let i=0;i<rows.length;i++) await connection.execute(`UPDATE ${table} SET ${idCol}=? WHERE ${idCol}=?`,[String(i+1),`tmp-${rows[i].id}`]);
 };
 return {
  all:async()=> (await pool.execute(`SELECT ${columns} FROM ${table} ORDER BY CAST(${prefix}id AS UNSIGNED) ASC`))[0],
  add:async data=>{
   const connection=await pool.getConnection();
   try {
    await connection.beginTransaction();
    await connection.execute(`SELECT ${idCol} FROM ${table} FOR UPDATE`);
    const [maxRows]=await connection.execute(`SELECT COALESCE(MAX(CAST(${idCol} AS UNSIGNED)),0)+1 AS nextId FROM ${table}`);
    const row={id:String(maxRows[0].nextId),...data,status:'Active'};
    await connection.execute(`INSERT INTO ${table} (${prefix}id,${prefix}name,${prefix}position,${prefix}status,${prefix}salary) VALUES (?,?,?,?,?)`,[row.id,row.name,row.position,row.status,row.salary]);
    await connection.commit();return row;
   }catch(error){await connection.rollback();throw error;}finally{connection.release();}
  },
  update:async(id,data)=>{
   const connection=await pool.getConnection();
   try {
    await connection.beginTransaction();
    const [existing]=await connection.execute(`SELECT ${columns} FROM ${table} WHERE ${prefix}id=? FOR UPDATE`,[id]);
    if(!existing.length){await connection.commit();return null;}
    await connection.execute(`UPDATE ${table} SET ${prefix}name=?,${prefix}position=?,${prefix}salary=? WHERE ${prefix}id=?`,[data.name,data.position,data.salary,id]);
    const [rows]=await connection.execute(`SELECT ${columns} FROM ${table} WHERE ${prefix}id=?`,[id]);
    await connection.commit();return rows[0];
   }catch(error){await connection.rollback();throw error;}finally{connection.release();}
  },
  toggle:async id=>{
   const connection=await pool.getConnection();
   try {
    await connection.beginTransaction();
    const [result]=await connection.execute(`UPDATE ${table} SET ${prefix}status=CASE WHEN ${prefix}status='Active' THEN 'On Leave' ELSE 'Active' END WHERE ${prefix}id=?`,[id]);
    if(!result.affectedRows){await connection.commit();return null;}
    const [rows]=await connection.execute(`SELECT ${columns} FROM ${table} WHERE ${prefix}id=?`,[id]);
    await connection.commit();return rows[0];
   }catch(error){await connection.rollback();throw error;}finally{connection.release();}
  },
  remove:async id=>{
   const connection=await pool.getConnection();
   try{
    await connection.beginTransaction();
    const [result]=await connection.execute(`DELETE FROM ${table} WHERE ${prefix}id=?`,[id]);
    if(!result.affectedRows){await connection.commit();return false;}
    await renumber(connection);
    await connection.commit();return true;
   }catch(error){await connection.rollback();throw error;}finally{connection.release();}
  },
  close:()=>pool.end()
 };
}
