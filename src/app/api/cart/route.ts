import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { addCartItem, clearCart, getCartLines, getOrCreateCart, removeCartItem, updateCartItem } from "@/lib/cart";

const lineSchema = z.object({ productId: z.string().min(1), variantId: z.string().min(1).nullable().optional(), quantity: z.number().int().min(1).max(20) });
const cartCookie = "tigsbd_cart";

async function identity() {
  const user = await getCurrentUser();
  const token = (await cookies()).get(cartCookie)?.value;
  return { user, token };
}

async function responseWithCart(cart: Awaited<ReturnType<typeof getOrCreateCart>>, status = 200) {
  const response = NextResponse.json({ cartId: cart.cart.id, lines: await getCartLines(cart.cart.id) }, { status });
  if (cart.guestToken) response.cookies.set(cartCookie, cart.guestToken, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return response;
}

export async function GET() {
  try {
    const { user, token } = await identity();
    return responseWithCart(await getOrCreateCart({ userId: user?.id, guestToken: token }));
  } catch { return NextResponse.json({ error: "Unable to load cart." }, { status: 500 }); }
}

export async function POST(request: Request) {
  try {
    const input = lineSchema.parse(await request.json());
    const { user, token } = await identity();
    const cart = await getOrCreateCart({ userId: user?.id, guestToken: token });
    await addCartItem(cart.cart.id, input.productId, input.variantId ?? null, input.quantity);
    return responseWithCart(cart, 201);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add item." }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  try {
    const input = lineSchema.parse(await request.json());
    const { user, token } = await identity();
    const cart = await getOrCreateCart({ userId: user?.id, guestToken: token });
    await updateCartItem(cart.cart.id, input.productId, input.variantId ?? null, input.quantity);
    return responseWithCart(cart);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update item." }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  try {
    const input = z.object({ productId: z.string().min(1).optional(), variantId: z.string().min(1).nullable().optional(), clear: z.boolean().optional() }).refine((value) => value.clear || value.productId, { message: "Product is required unless clearing the cart." }).parse(await request.json());
    const { user, token } = await identity();
    const cart = await getOrCreateCart({ userId: user?.id, guestToken: token });
    if (input.clear) await clearCart(cart.cart.id);
    else await removeCartItem(cart.cart.id, input.productId!, input.variantId ?? null);
    return responseWithCart(cart);
  } catch { return NextResponse.json({ error: "Unable to remove item." }, { status: 400 }); }
}