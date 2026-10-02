import pkg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => console.error('Unexpected error on idle client', err));

export const query = (text: string, params?: any[]) => pool.query(text, params);
export const getClient = () => pool.connect();

export default pool;
