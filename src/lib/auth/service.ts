import { eq } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { users, type User } from "@/lib/db/schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { normalizeEmail, registerSchema, loginSchema } from "@/lib/auth/validation";

export type PublicUser = Pick<User, "id" | "email" | "firstName" | "lastName" | "phone" | "emailVerified" | "isDemo">;

export function toPublicUser(user: User): PublicUser {
  return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, emailVerified: user.emailVerified, isDemo: user.isDemo };
}

export async function registerCustomer(input: unknown): Promise<PublicUser | null> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) return null;
  const email = normalizeEmail(parsed.data.email);
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) return null;

  const now = new Date();
  const [user] = await db.insert(users).values({
    id: `user_${crypto.randomUUID()}`,
    email,
    passwordHash: await hashPassword(parsed.data.password),
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    createdAt: now,
    updatedAt: now,
  }).returning();
  return user ? toPublicUser(user) : null;
}

export async function authenticateCustomer(input: unknown): Promise<PublicUser | null> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return null;
  const email = normalizeEmail(parsed.data.email);
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !user.isActive || !(await verifyPassword(parsed.data.password, user.passwordHash))) return null;
  return toPublicUser(user);
}