import { NextResponse } from "next/server";
import { getAdminOrders, requireAdminUser } from "@/lib/orders";

export async function GET(request: Request) {
  try { const { searchParams } = new URL(request.url); const filter = (searchParams.get("store") ?? "all") as "all" | "tigsbd" | "sarongo" | "mixed"; const { user } = await requireAdminUser(); return NextResponse.json({ orders: await getAdminOrders(user.id, filter) }); }
  catch { return NextResponse.json({ error: "Unauthorized." }, { status: 403 }); }
}