import env from '@/middlewares/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});
// let the DB know about the schema's that we defined.
const db = drizzle(client, {
  schema,
});

export default db;
