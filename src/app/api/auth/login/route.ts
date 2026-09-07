import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { getOrCreateCart, mergeGuestCart } from "@/lib/cart";
import { allowAuthAttempt, getRequestKey } from "@/lib/auth/rate-limit";
import { authenticateCustomer } from "@/lib/auth/service";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!allowAuthAttempt(getRequestKey(request, "login"))) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  try {
    const user = await authenticateCustomer(await request.json());
    if (!user) return NextResponse.json({ error: "The email or password is not correct." }, { status: 401 });
    const guestToken = (await cookies()).get("tigsbd_cart")?.value;
    await createSession(user.id);
    if (guestToken) {
      const guestCart = await getOrCreateCart({ guestToken });
      await mergeGuestCart(guestCart.cart.id, user.id);
      (await cookies()).set("tigsbd_cart", "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
    }
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unable to sign in right now." }, { status: 400 });
  }
}