import { createHmac, randomBytes } from "node:crypto";

import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { cartItems, carts, productInventory, productMedia, products, productVariants, type Cart } from "@/lib/db/schema";

const MAX_QUANTITY = 20;

export type CartIdentity = { userId?: string; guestToken?: string };
export type CartLine = {
  cartId: string;
  product: typeof products.$inferSelect;
  variant: typeof productVariants.$inferSelect | null;
  media: typeof productMedia.$inferSelect | null;
  inventory: typeof productInventory.$inferSelect | null;
  quantity: number;
  unitPriceCents: number;
  lineSubtotalCents: number;
};

function hashGuestToken(token: string) {
  return createHmac("sha256", process.env.AUTH_SESSION_SECRET ?? "local-development-session-secret-change-me").update(token).digest("hex");
}

function assertQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) throw new Error("Quantity must be between 1 and 20.");
}

export function createGuestToken() {
  return randomBytes(32).toString("base64url");
}

export async function getOrCreateCart(identity: CartIdentity): Promise<{ cart: Cart; guestToken?: string }> {
  const db = getDb();
  if (identity.userId) {
    const [existing] = await db.select().from(carts).where(and(eq(carts.userId, identity.userId), eq(carts.status, "active"))).limit(1);
    if (existing) return { cart: existing };
  }
  if (identity.guestToken) {
    const [existing] = await db.select().from(carts).where(and(eq(carts.guestTokenHash, hashGuestToken(identity.guestToken)), eq(carts.status, "active"))).limit(1);
    if (existing) return { cart: existing, guestToken: identity.guestToken };
  }
  const guestToken = identity.userId ? undefined : (identity.guestToken ?? createGuestToken());
  const now = new Date();
  const [cart] = await db.insert(carts).values({ id: `cart_${randomBytes(12).toString("hex")}`, userId: identity.userId ?? null, guestTokenHash: guestToken ? hashGuestToken(guestToken) : null, createdAt: now, updatedAt: now }).returning();
  if (!cart) throw new Error("Unable to create cart.");
  return { cart, guestToken };
}

async function validateLine(productId: string, variantId?: string | null) {
  const db = getDb();
  const [product] = await db.select().from(products).where(and(eq(products.id, productId), eq(products.status, "active"), eq(products.visibility, "visible"))).limit(1);
  if (!product) throw new Error("Product is unavailable.");
  let variant: typeof productVariants.$inferSelect | null = null;
  if (variantId) {
    [variant] = await db.select().from(productVariants).where(and(eq(productVariants.id, variantId), eq(productVariants.productId, productId), eq(productVariants.status, "active"))).limit(1);
    if (!variant) throw new Error("Product option is unavailable.");
  }
  const [inventory] = await db.select().from(productInventory).where(and(eq(productInventory.productId, productId), eq(productInventory.storeId, product.storeId))).limit(1);
  return { product, variant, inventory };
}

export async function getCartLines(cartId: string): Promise<CartLine[]> {
  const db = getDb();
  const rows = await db.select().from(cartItems).where(eq(cartItems.cartId, cartId));
  const lines: CartLine[] = [];
  for (const row of rows) {
    const { product, variant, inventory } = await validateLine(row.productId, row.variantId);
    const [media] = await db.select().from(productMedia).where(eq(productMedia.productId, product.id)).orderBy(productMedia.sortOrder).limit(1);
    const unitPriceCents = variant?.priceCents ?? product.salePriceCents ?? product.priceCents;
    lines.push({ cartId, product, variant, media: media ?? null, inventory: inventory ?? null, quantity: row.quantity, unitPriceCents, lineSubtotalCents: unitPriceCents * row.quantity });
  }
  return lines;
}

export async function addCartItem(cartId: string, productId: string, variantId: string | null, quantity: number) {
  assertQuantity(quantity);
  const db = getDb();
  const { inventory } = await validateLine(productId, variantId);
  const [existing] = await db.select().from(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId), variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId))).limit(1);
  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  if (inventory && nextQuantity > Math.max(0, inventory.availableQuantity - inventory.reservedQuantity)) throw new Error("Not enough stock available.");
  const now = new Date();
  if (existing) await db.update(cartItems).set({ quantity: nextQuantity, updatedAt: now }).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId), variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId)));
  else await db.insert(cartItems).values({ cartId, productId, variantId, quantity, createdAt: now, updatedAt: now });
}

export async function updateCartItem(cartId: string, productId: string, variantId: string | null, quantity: number) {
  assertQuantity(quantity);
  const db = getDb();
  const { inventory } = await validateLine(productId, variantId);
  if (inventory && quantity > Math.max(0, inventory.availableQuantity - inventory.reservedQuantity)) throw new Error("Not enough stock available.");
  await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId), variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId)));
}

export async function removeCartItem(cartId: string, productId: string, variantId: string | null) {
  const db = getDb();
  await db.delete(cartItems).where(and(eq(cartItems.cartId, cartId), eq(cartItems.productId, productId), variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId)));
}

export async function clearCart(cartId: string) {
  await getDb().delete(cartItems).where(eq(cartItems.cartId, cartId));
}

export async function mergeGuestCart(guestCartId: string, userId: string) {
  const db = getDb();
  const { cart: userCart } = await getOrCreateCart({ userId });
  const guestLines = await db.select().from(cartItems).where(eq(cartItems.cartId, guestCartId));
  for (const line of guestLines) {
    try { await addCartItem(userCart.id, line.productId, line.variantId, line.quantity); } catch { /* Keep valid account lines if a guest line is no longer available. */ }
  }
  await db.update(carts).set({ status: "merged", updatedAt: new Date() }).where(eq(carts.id, guestCartId));
  return userCart;
}

export { MAX_QUANTITY };