import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { Pool } from 'pg';
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL before running migrations.');
const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.PGSSL==='true'?{rejectUnauthorized:true}:undefined});
try{await pool.query(await readFile(new URL('../db/schema.sql',import.meta.url),'utf8'));console.log('HealthCopilot schema applied.')}finally{await pool.end()}
