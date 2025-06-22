import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

// Disable SSL certificate verification for DigitalOcean
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Create PostgreSQL connection pool for DigitalOcean
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Always use SSL for DigitalOcean managed databases
    sslmode: 'require'
  },
  max: 10, // Reduced for DigitalOcean limits
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased timeout for DigitalOcean
  keepAlive: true,
  keepAliveInitialDelayMillis: 0,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Helper function to test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    return { success: true, timestamp: result.rows[0].now };
  } catch (error) {
    console.error('Database connection error:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to close connection (useful for cleanup)
export async function closeConnection() {
  await pool.end();
}

// Export schema for use in other files
export { schema };