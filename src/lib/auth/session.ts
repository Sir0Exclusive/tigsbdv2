import "server-only";

import { createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "@/lib/db/client";
import { sessions, users } from "@/lib/db/schema";
import { assertProductionEnvironment, env } from "@/lib/env";
import type { PublicUser } from "@/lib/auth/service";

const SESSION_COOKIE = "tigsbd_session";
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000;

function hashSessionToken(token: string): string {
	return createHmac("sha256", env.AUTH_SESSION_SECRET).update(token).digest("hex");
}

function cookieOptions() {
	return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: SESSION_LIFETIME_MS / 1000 };
}

export async function createSession(userId: string): Promise<void> {
	assertProductionEnvironment();
	const rawToken = randomBytes(32).toString("base64url");
	const now = new Date();
	await db.insert(sessions).values({
		id: hashSessionToken(rawToken),
		userId,
		createdAt: now,
		expiresAt: new Date(now.getTime() + SESSION_LIFETIME_MS),
	});
	(await cookies()).set(SESSION_COOKIE, rawToken, cookieOptions());
}

export async function getSession() {
	const rawToken = (await cookies()).get(SESSION_COOKIE)?.value;
	if (!rawToken) return null;
	const [session] = await db.select().from(sessions).where(and(eq(sessions.id, hashSessionToken(rawToken)), isNull(sessions.revokedAt), gt(sessions.expiresAt, new Date()))).limit(1);
	return session ?? null;
}

export async function getCurrentUser(): Promise<PublicUser | null> {
	if (env.DATABASE_URL.startsWith("file:")) return null;
	try {
		const session = await getSession();
		if (!session) return null;
		const [user] = await db.select({ id: users.id, email: users.email, firstName: users.firstName, lastName: users.lastName, phone: users.phone, emailVerified: users.emailVerified, isDemo: users.isDemo }).from(users).where(and(eq(users.id, session.userId), eq(users.isActive, true))).limit(1);
		return user ?? null;
	} catch {
		return null;
	}
}

export async function requireUser(): Promise<PublicUser> {
	const user = await getCurrentUser();
	if (!user) redirect("/login?next=/account");
	return user;
}

export async function logout(): Promise<void> {
	const cookieStore = await cookies();
	const rawToken = cookieStore.get(SESSION_COOKIE)?.value;
	if (rawToken) {
		await db.update(sessions).set({ revokedAt: new Date() }).where(eq(sessions.id, hashSessionToken(rawToken)));
	}
	cookieStore.set(SESSION_COOKIE, "", { ...cookieOptions(), maxAge: 0 });
}