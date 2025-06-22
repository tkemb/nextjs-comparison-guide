import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Parse the DATABASE_URL to extract individual components
const url = new URL(process.env.DATABASE_URL);

export default defineConfig({
  schema: './src/lib/db/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: url.hostname,
    port: parseInt(url.port),
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove the leading '/'
    ssl: {
      rejectUnauthorized: false, // Required for DigitalOcean managed databases
    },
  },
});