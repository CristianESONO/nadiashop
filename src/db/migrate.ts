import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL no está definida en el archivo .env');
  }

  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'boutique_db',
    password: 'admin123',
    port: 5432,
  });
  const client = await pool.connect();

  try {
    console.log('🚀 Empezando la migración...');

    // Carpeta de migraciones
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`📜 Ejecutando: ${file}`);
      const content = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
      
      // Limpiar y separar por statement-breakpoint
      const statements = content.split('--> statement-breakpoint');
      
      for (let statement of statements) {
        statement = statement.trim();
        if (statement) {
          await client.query(statement);
        }
      }
    }

    console.log('✅ Migración completada con éxito.');
  } catch (err) {
    console.error('❌ Error durante la migración:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
