import { createHmac, timingSafeEqual } from "node:crypto";

import { assertProductionEnvironment, env } from "@/lib/env";

export function createSessionToken(subject: string): string {
  assertProductionEnvironment();
  const payload = Buffer.from(JSON.stringify({ subject, issuedAt: Date.now() })).toString("base64url");
  const signature = createHmac("sha256", env.AUTH_SESSION_SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string): { subject: string; issuedAt: number } | null {
  assertProductionEnvironment();
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", env.AUTH_SESSION_SECRET).update(payload).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!parsed || typeof parsed !== "object" || !("subject" in parsed) || !("issuedAt" in parsed)) {
      return null;
    }
    const session = parsed as { subject: unknown; issuedAt: unknown };
    return typeof session.subject === "string" && typeof session.issuedAt === "number"
      ? { subject: session.subject, issuedAt: session.issuedAt }
      : null;
  } catch {
    return null;
  }
}