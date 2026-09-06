import { NextResponse } from "next/server";

import { createSession } from "@/lib/auth/session";
import { registerCustomer } from "@/lib/auth/service";
import { allowAuthAttempt, getRequestKey } from "@/lib/auth/rate-limit";

export async function POST(request: Request) {
  if (!allowAuthAttempt(getRequestKey(request, "register"))) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  try {
    const user = await registerCustomer(await request.json());
    if (!user) return NextResponse.json({ error: "We could not create an account with those details." }, { status: 400 });
    await createSession(user.id);
    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "We could not create an account right now." }, { status: 400 });
  }
}