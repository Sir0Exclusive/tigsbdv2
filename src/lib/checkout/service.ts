import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { getCurrentUser } from "@/lib/auth/session";
import { getCartLines, getOrCreateCart, type CartLine } from "@/lib/cart";
import { carts, orderItems, orders, type Cart } from "@/lib/db/schema";
import { storeConfigs } from "@/lib/stores";
import { checkoutSchema } from "./validation";
import { PlaceholderPaymentProvider } from "./payment";

const STANDARD_SHIPPING_CENTS = 0;

export async function createCheckoutOrder(rawInput: unknown, guestToken?: string, resolvedCart?: Cart, resolvedLines?: CartLine[]) {
  const input = checkoutSchema.parse(rawInput);
  const user = guestToken ? null : await getCurrentUser();
  const cart = resolvedCart ? { cart: resolvedCart } : await getOrCreateCart({ userId: user?.id, guestToken });
  if (!cart.cart) throw new Error("Cart is unavailable.");
  const lines = resolvedLines ?? await getCartLines(cart.cart.id);
  if (lines.length === 0) throw new Error("Your cart is empty.");

  const subtotalCents = lines.reduce((sum, line) => sum + line.lineSubtotalCents, 0);
  const totalCents = subtotalCents + STANDARD_SHIPPING_CENTS;
  const db = getDb();
  const [existing] = await db.select().from(orders).where(eq(orders.idempotencyKey, input.idempotencyKey)).limit(1);
  if (existing) {
    const existingItems = await db.select({ id: orderItems.id }).from(orderItems).where(eq(orderItems.orderId, existing.id));
    return { id: existing.id, orderNumber: existing.orderNumber, status: existing.status, totalCents: existing.totalCents, itemCount: existingItems.length };
  }

  const now = new Date();
  const orderId = `order_${randomBytes(12).toString("hex")}`;
  const orderNumber = `TIG-${Date.now().toString(36).toUpperCase()}`;
  const address = { firstName: input.firstName, lastName: input.lastName, address1: input.address1, address2: input.address2 ?? "", city: input.city, region: input.region, postalCode: input.postalCode, country: input.country, phone: input.phone };
  const payment = await new PlaceholderPaymentProvider().createIntent();

  await db.transaction(async (tx) => {
    for (const line of lines) {
      if (line.inventory && line.quantity > line.inventory.availableQuantity - line.inventory.reservedQuantity) throw new Error(`Insufficient stock for ${line.product.name}.`);
    }
    await tx.insert(orders).values({ id: orderId, orderNumber, userId: user?.id ?? null, guestEmail: input.email, guestPhone: input.phone, status: "pending", paymentStatus: payment.status, paymentMethod: payment.method, currency: "USD", subtotalCents, shippingCents: STANDARD_SHIPPING_CENTS, discountCents: 0, taxCents: 0, totalCents, shippingMethod: input.shippingMethod, shippingAddress: address, idempotencyKey: input.idempotencyKey, createdAt: now, updatedAt: now });
    for (const line of lines) {
      const store = storeConfigs.find((candidate) => candidate.id === line.product.storeId);
      if (!store) throw new Error("Invalid store ownership.");
      await tx.insert(orderItems).values({ id: `item_${randomBytes(12).toString("hex")}`, orderId, storeId: line.product.storeId, productId: line.product.id, variantId: line.variant?.id ?? null, productName: line.product.name, productSku: line.product.sku, storeName: store.name, quantity: line.quantity, unitPriceCents: line.unitPriceCents, lineTotalCents: line.lineSubtotalCents, productSnapshot: { name: line.product.name, sku: line.product.sku, storeId: line.product.storeId, storeName: store.name }, createdAt: now });
    }
    await tx.delete(carts).where(eq(carts.id, cart.cart.id));
  });
  return { id: orderId, orderNumber, status: "pending", totalCents, itemCount: lines.length };
}