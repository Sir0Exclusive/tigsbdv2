import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export function GET() {
  return NextResponse.json({
    status: "ok",
    databaseConfigured: Boolean(env.DATABASE_URL),
    environment: process.env.NODE_ENV,
  });
}