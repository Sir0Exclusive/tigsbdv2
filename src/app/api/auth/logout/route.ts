import { NextResponse } from "next/server";

import { logout } from "@/lib/auth/session";

export async function POST() {
  try {
    await logout();
  } catch {
    // Keep logout idempotent when production database configuration is absent.
  }
  return NextResponse.json({ ok: true });
}