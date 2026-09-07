import test from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";

import { addCartItem, clearCart, getCartLines, getOrCreateCart, mergeGuestCart, removeCartItem, updateCartItem } from "@/lib/cart";
import { db } from "@/lib/db/client";
import { carts, products, users } from "@/lib/db/schema";

async function findProduct(slug: string) {
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  assert.ok(product);
  return product;
}

test("guest cart persists mixed TIGSBD and Sarongo lines with safe quantity operations", async () => {
  const tigsbd = await findProduct("linen-catchall-tray");
  const sarongo = await findProduct("brass-line-vessel");
  const guest = await getOrCreateCart({ guestToken: `test-guest-${crypto.randomUUID()}` });
  assert.ok(guest.guestToken);

  await addCartItem(guest.cart.id, tigsbd.id, null, 1);
  await addCartItem(guest.cart.id, sarongo.id, null, 2);
  await updateCartItem(guest.cart.id, tigsbd.id, null, 3);
  let lines = await getCartLines(guest.cart.id);
  assert.equal(lines.length, 2);
  assert.deepEqual(lines.map((line) => line.product.storeId).sort(), ["store_sarongo", "store_tigsbd"]);
  assert.equal(lines.find((line) => line.product.id === tigsbd.id)?.quantity, 3);
  assert.equal(lines.find((line) => line.product.id === sarongo.id)?.quantity, 2);

  await removeCartItem(guest.cart.id, sarongo.id, null);
  lines = await getCartLines(guest.cart.id);
  assert.equal(lines.length, 1);
  await clearCart(guest.cart.id);
  await db.delete(carts).where(eq(carts.id, guest.cart.id));
});

test("guest cart merges matching and distinct lines into one user cart", async () => {
  const tigsbd = await findProduct("linen-catchall-tray");
  const sarongo = await findProduct("brass-line-vessel");
  const email = `cart-${crypto.randomUUID()}@example.test`;
  const [user] = await db.insert(users).values({ id: `user_cart_${crypto.randomUUID()}`, email, passwordHash: "test-only", firstName: "Cart", lastName: "Tester", createdAt: new Date(), updatedAt: new Date() }).returning();
  assert.ok(user);
  const guest = await getOrCreateCart({ guestToken: `merge-${crypto.randomUUID()}` });
  const account = await getOrCreateCart({ userId: user.id });
  await addCartItem(guest.cart.id, tigsbd.id, null, 2);
  await addCartItem(account.cart.id, tigsbd.id, null, 1);
  await addCartItem(guest.cart.id, sarongo.id, null, 1);

  const merged = await mergeGuestCart(guest.cart.id, user.id);
  const lines = await getCartLines(merged.id);
  assert.equal(lines.length, 2);
  assert.equal(lines.find((line) => line.product.id === tigsbd.id)?.quantity, 3);
  assert.equal(lines.find((line) => line.product.id === sarongo.id)?.quantity, 1);

  await db.delete(carts).where(eq(carts.id, merged.id));
  await db.delete(carts).where(eq(carts.id, guest.cart.id));
  await db.delete(users).where(eq(users.id, user.id));
});

test("cart rejects quantities above the service limit", async () => {
  const product = await findProduct("linen-catchall-tray");
  const guest = await getOrCreateCart({ guestToken: `invalid-${crypto.randomUUID()}` });
  await assert.rejects(() => addCartItem(guest.cart.id, product.id, null, 21), /between 1 and 20/);
  await db.delete(carts).where(eq(carts.id, guest.cart.id));
});