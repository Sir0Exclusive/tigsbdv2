import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

export function getDb() {
  const client = createClient({
    url: process.env["DATABASE_URL"] || env.DATABASE_URL,
    authToken: process.env["DATABASE_AUTH_TOKEN"] || env.DATABASE_AUTH_TOKEN,
  });
  return drizzle(client, { schema });
}

export const db = getDb();