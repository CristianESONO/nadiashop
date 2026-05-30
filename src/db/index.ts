import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'boutique_db',
  password: 'admin123',
  port: 5432,
});

export const db = drizzle(pool, { schema });
