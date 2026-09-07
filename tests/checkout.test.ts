import test from "node:test";
import assert from "node:assert/strict";
import { and, eq } from "drizzle-orm";

import { createCheckoutOrder, checkoutSchema } from "@/lib/checkout";
import { formatBDT } from "@/lib/money";
import { addCartItem, getCartLines, getOrCreateCart } from "@/lib/cart";
import { db } from "@/lib/db/client";
import { carts, orderItems, orders, productInventory, products } from "@/lib/db/schema";

const baseCheckout = (idempotencyKey: string) => ({ email: `checkout-${idempotencyKey}@example.test`, phone: "01700000000", firstName: "Checkout", lastName: "Tester", address1: "12 Demo Street", address2: "", city: "Dhaka", region: "Bangladesh", division: "Dhaka", district: "Dhaka", upazila: "Dhanmondi", postalCode: "1200", country: "Bangladesh", shippingMethod: "standard", paymentMethod: "cod", idempotencyKey });

test("BDT formatting uses integer poisha and COD is a valid checkout method", () => {
  assert.equal(formatBDT(123456), "৳1,234.56");
  assert.equal(baseCheckout(crypto.randomUUID()).paymentMethod, "cod");
  assert.equal(checkoutSchema.safeParse(baseCheckout(crypto.randomUUID())).success, true);
  assert.equal(checkoutSchema.safeParse({ ...baseCheckout(crypto.randomUUID()), phone: "01712-345-678" }).success, true);
  assert.equal(checkoutSchema.safeParse({ ...baseCheckout(crypto.randomUUID()), phone: "12345" }).success, false);
});

test("guest mixed-store checkout creates one order, preserves stores, and clears cart", async () => {
  const [tigsbd] = await db.select().from(products).where(eq(products.slug, "linen-catchall-tray")).limit(1);
  const [sarongo] = await db.select().from(products).where(eq(products.slug, "brass-line-vessel")).limit(1);
  assert.ok(tigsbd && sarongo);
  const guestToken = `checkout-${crypto.randomUUID()}`;
  const guest = await getOrCreateCart({ guestToken });
  await addCartItem(guest.cart.id, tigsbd.id, null, 1);
  await addCartItem(guest.cart.id, sarongo.id, null, 1);
  assert.equal((await getCartLines(guest.cart.id)).length, 2);
  assert.equal((await getOrCreateCart({ guestToken })).cart.id, guest.cart.id);
  const idempotencyKey = crypto.randomUUID();
  const checkoutLines = await getCartLines(guest.cart.id);
  const result = await createCheckoutOrder(baseCheckout(idempotencyKey), guestToken, guest.cart, checkoutLines);
  assert.equal(result.itemCount, 2);
  const [createdOrder] = await db.select().from(orders).where(eq(orders.id, result.id)).limit(1);
  assert.equal(createdOrder?.currency, "BDT");
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, result.id));
  assert.deepEqual(items.map((item) => item.storeId).sort(), ["store_sarongo", "store_tigsbd"]);
  assert.equal((await getCartLines(guest.cart.id)).length, 0);
  const repeat = await createCheckoutOrder(baseCheckout(idempotencyKey), guestToken, guest.cart, checkoutLines);
  assert.equal(repeat.id, result.id);
  await db.delete(orders).where(eq(orders.id, result.id));
  await db.delete(carts).where(eq(carts.id, guest.cart.id));
});

test("checkout rejects invalid input and insufficient stock", async () => {
  const [product] = await db.select().from(products).where(eq(products.slug, "linen-catchall-tray")).limit(1);
  assert.ok(product);
  const guestToken = `stock-${crypto.randomUUID()}`;
  const guest = await getOrCreateCart({ guestToken });
  await addCartItem(guest.cart.id, product.id, null, 1);
  const [inventory] = await db.select().from(productInventory).where(and(eq(productInventory.productId, product.id), eq(productInventory.storeId, product.storeId))).limit(1);
  assert.ok(inventory);
  await db.update(productInventory).set({ availableQuantity: 0 }).where(eq(productInventory.id, inventory.id));
  await assert.rejects(() => createCheckoutOrder(baseCheckout(crypto.randomUUID()), guestToken, guest.cart), /Insufficient stock/);
  await db.update(productInventory).set({ availableQuantity: 12 }).where(eq(productInventory.id, inventory.id));
  await assert.rejects(() => createCheckoutOrder({ ...baseCheckout(crypto.randomUUID()), email: "bad" }, guestToken, guest.cart));
  await db.delete(carts).where(eq(carts.id, guest.cart.id));
});