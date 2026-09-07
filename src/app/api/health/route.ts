import { NextResponse } from "next/server";

export function GET() {
  const runtimeDatabaseUrl = process.env["DATABASE_URL"];
  return NextResponse.json({
    status: "ok",
    databaseConfigured: Boolean(runtimeDatabaseUrl),
    databaseSource: runtimeDatabaseUrl?.startsWith("file:") ? "local" : runtimeDatabaseUrl ? "remote" : "absent",
    environment: process.env.NODE_ENV,
  });
}