import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { createCheckoutOrder } from "@/lib/checkout";
import { getCurrentUser } from "@/lib/auth/session";
import { getCartLines, getOrCreateCart } from "@/lib/cart";

export async function POST(request: Request) {
  try {
    const guestToken = (await cookies()).get("tigsbd_cart")?.value;
    const user = await getCurrentUser();
    const cart = await getOrCreateCart({ userId: user?.id, guestToken });
    const order = await createCheckoutOrder(await request.json(), guestToken, cart.cart, await getCartLines(cart.cart.id));
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to place order." }, { status: 400 });
  }
}