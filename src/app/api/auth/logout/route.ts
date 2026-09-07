import { NextResponse } from "next/server";

import { logout } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    await logout();
  } catch {
    // Keep logout idempotent when production database configuration is absent.
  }
  return NextResponse.redirect(new URL("/login", request.url), 303);
}