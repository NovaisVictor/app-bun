import { env } from '@/env'

import { defineConfig } from 'drizzle-kit'
export default defineConfig({
  dialect: 'postgresql',
  out: './drizzle',
  schema: './src/db/schema.ts',
  dbCredentials: {
    url: env.DB_URL,
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
})
