import test from "node:test";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";

import { cancelCustomerOrder, getAdminOrder, getAdminOrders, getAdminScope, getCustomerOrder, matchesOrderStoreFilter, updateOrderStatus } from "@/lib/orders";
import { db } from "@/lib/db/client";
import { adminStoreAssignments, adminUsers, orderItems, orderStatusHistory, orders, users } from "@/lib/db/schema";

test("customer ownership, admin filters, transitions, history, and cancellation are enforced", async () => {
  const now = new Date();
  const customerId = `user_orders_${crypto.randomUUID()}`;
  const adminId = `user_admin_${crypto.randomUUID()}`;
  const orderId = `order_test_${crypto.randomUUID()}`;
  const [customer, admin] = await Promise.all([
    db.insert(users).values({ id: customerId, email: `${customerId}@example.test`, passwordHash: "test", firstName: "Customer", lastName: "Tester", createdAt: now, updatedAt: now }).returning(),
    db.insert(users).values({ id: adminId, email: `${adminId}@example.test`, passwordHash: "test", firstName: "Admin", lastName: "Tester", createdAt: now, updatedAt: now }).returning(),
  ]);
  assert.ok(customer[0] && admin[0]);
  await db.insert(adminUsers).values({ userId: adminId, role: "platform_admin", createdAt: now });
  await db.insert(orders).values({ id: orderId, orderNumber: `TST-${Date.now()}`, userId: customerId, guestEmail: customer[0].email, guestPhone: "01700000000", status: "pending", paymentStatus: "pending", paymentMethod: "cod", currency: "BDT", subtotalCents: 11000, shippingCents: 0, discountCents: 0, taxCents: 0, totalCents: 11000, shippingMethod: "standard", shippingStatus: "pending", shippingAddress: { address1: "Demo", city: "Dhaka", district: "Dhaka", division: "Dhaka", country: "Bangladesh" }, idempotencyKey: `test-${crypto.randomUUID()}`, createdAt: now, updatedAt: now });
  await db.insert(orderItems).values([
    { id: `item_${crypto.randomUUID()}`, orderId, storeId: "store_tigsbd", productId: "prod_tigsbd_linen-tray", variantId: null, productName: "Linen Catchall Tray", productSku: "TIG-HOME-001", storeName: "TIGSBD", quantity: 1, unitPriceCents: 4200, lineTotalCents: 4200, productSnapshot: { name: "Linen Catchall Tray", storeId: "store_tigsbd" }, createdAt: now },
    { id: `item_${crypto.randomUUID()}`, orderId, storeId: "store_sarongo", productId: "prod_sarongo_brass-vessel", variantId: null, productName: "Brass Line Vessel", productSku: "SAR-OBJ-001", storeName: "Sarongo", quantity: 1, unitPriceCents: 6800, lineTotalCents: 6800, productSnapshot: { name: "Brass Line Vessel", storeId: "store_sarongo" }, createdAt: now },
  ]);

  assert.equal((await getCustomerOrder(customerId, orderId))?.items.length, 2);
  assert.equal(await getCustomerOrder(adminId, orderId), null);
  assert.equal((await getAdminOrders(adminId, "mixed"))?.[0].isMixed, true);
  await updateOrderStatus(adminId, orderId, "confirmed", "Reviewed by platform admin");
  await assert.rejects(() => updateOrderStatus(adminId, orderId, "delivered"), /Invalid status transition/);
  assert.equal((await getAdminOrder(adminId, orderId))?.history.length, 1);
  await cancelCustomerOrder(customerId, orderId);
  assert.equal((await getCustomerOrder(customerId, orderId))?.order.status, "cancelled");
  assert.equal((await getCustomerOrder(customerId, orderId))?.history.length, 2);

  await db.delete(orderStatusHistory).where(eq(orderStatusHistory.orderId, orderId));
  await db.delete(orderItems).where(eq(orderItems.orderId, orderId));
  await db.delete(orders).where(eq(orders.id, orderId));
  await db.delete(adminStoreAssignments).where(eq(adminStoreAssignments.userId, adminId));
  await db.delete(adminUsers).where(eq(adminUsers.userId, adminId));
  await db.delete(users).where(eq(users.id, customerId));
  await db.delete(users).where(eq(users.id, adminId));
});

test("admin store filters include mixed orders in both store views", () => {
  assert.equal(matchesOrderStoreFilter(["store_tigsbd"], "all"), true);
  assert.equal(matchesOrderStoreFilter(["store_tigsbd"], "tigsbd"), true);
  assert.equal(matchesOrderStoreFilter(["store_tigsbd"], "sarongo"), false);
  assert.equal(matchesOrderStoreFilter(["store_tigsbd"], "mixed"), false);
  assert.equal(matchesOrderStoreFilter(["store_sarongo"], "sarongo"), true);
  assert.equal(matchesOrderStoreFilter(["store_sarongo"], "tigsbd"), false);
  assert.equal(matchesOrderStoreFilter(["store_sarongo"], "mixed"), false);
  assert.equal(matchesOrderStoreFilter(["store_tigsbd", "store_sarongo"], "tigsbd"), true);
  assert.equal(matchesOrderStoreFilter(["store_tigsbd", "store_sarongo"], "sarongo"), true);
  assert.equal(matchesOrderStoreFilter(["store_tigsbd", "store_sarongo"], "mixed"), true);
});

test("admin scope exposes only active assignments for store managers", async () => {
  const now = new Date();
  const userId = `user_scope_${crypto.randomUUID()}`;
  await db.insert(users).values({ id: userId, email: `${userId}@example.test`, passwordHash: "test", firstName: "Store", lastName: "Manager", createdAt: now, updatedAt: now });
  await db.insert(adminUsers).values({ userId, role: "store_manager", createdAt: now });
  await db.insert(adminStoreAssignments).values({ userId, storeId: "store_sarongo", createdAt: now });

  const scope = await getAdminScope(userId);
  assert.equal(scope?.role, "store_manager");
  assert.deepEqual(scope?.storeIds, ["store_sarongo"]);
  assert.equal(await getAdminScope(`missing_${crypto.randomUUID()}`), null);

  await db.delete(adminStoreAssignments).where(eq(adminStoreAssignments.userId, userId));
  await db.delete(adminUsers).where(eq(adminUsers.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
});