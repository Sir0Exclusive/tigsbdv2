import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default("file:./local.db"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  AUTH_SESSION_SECRET: z.string().min(32).default("local-development-session-secret-change-me"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN || undefined,
  AUTH_SESSION_SECRET: process.env.AUTH_SESSION_SECRET,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export function assertProductionEnvironment() {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_SESSION_SECRET) {
    throw new Error("AUTH_SESSION_SECRET must be configured in production.");
  }
}