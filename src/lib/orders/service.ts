import { randomBytes } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth/session";
import { getDb } from "@/lib/db/client";
import { adminStoreAssignments, adminUsers, orderItems, orderStatusHistory, orders } from "@/lib/db/schema";

export const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
const transitions: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export async function getCustomerOrders(userId: string) {
  const db = getDb();
  const rows = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  return Promise.all(rows.map(async (order) => ({ order, items: await db.select().from(orderItems).where(eq(orderItems.orderId, order.id)) })));
}

export async function getCustomerOrder(userId: string, orderId: string) {
  const db = getDb();
  const [order] = await db.select().from(orders).where(and(eq(orders.id, orderId), eq(orders.userId, userId))).limit(1);
  if (!order) return null;
  const [items, history] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    db.select().from(orderStatusHistory).where(eq(orderStatusHistory.orderId, order.id)).orderBy(orderStatusHistory.createdAt),
  ]);
  return { order, items, history };
}

async function getAdminScope(userId: string) {
  const db = getDb();
  const [admin] = await db.select().from(adminUsers).where(and(eq(adminUsers.userId, userId), eq(adminUsers.isActive, true))).limit(1);
  if (!admin) return null;
  const assignments = await db.select({ storeId: adminStoreAssignments.storeId }).from(adminStoreAssignments).where(eq(adminStoreAssignments.userId, userId));
  return { ...admin, storeIds: assignments.map((item) => item.storeId) };
}

export async function getAdminOrders(userId: string, filter: "all" | "tigsbd" | "sarongo" | "mixed" = "all") {
  const scope = await getAdminScope(userId);
  if (!scope) return null;
  const db = getDb();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const result = [];
  for (const order of rows) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    const storeIds = [...new Set(items.map((item) => item.storeId))];
    const visible = scope.role === "platform_admin" || scope.role === "order_manager" || items.some((item) => scope.storeIds.includes(item.storeId));
    if (!visible) continue;
    const isMixed = storeIds.length > 1;
    const matches = filter === "all" || (filter === "mixed" && isMixed) || (filter === "tigsbd" && storeIds.length === 1 && storeIds[0] === "store_tigsbd") || (filter === "sarongo" && storeIds.length === 1 && storeIds[0] === "store_sarongo");
    if (matches) result.push({ order, items, storeIds, isMixed });
  }
  return result;
}

export async function getAdminOrder(userId: string, orderId: string) {
  const all = await getAdminOrders(userId, "all");
  const entry = all?.find((entry) => entry.order.id === orderId) ?? null;
  if (!entry) return null;
  const history = await getDb().select().from(orderStatusHistory).where(eq(orderStatusHistory.orderId, orderId)).orderBy(orderStatusHistory.createdAt);
  return { ...entry, history };
}

export async function updateOrderStatus(userId: string, orderId: string, nextStatus: OrderStatus, note?: string) {
  const scope = await getAdminScope(userId);
  if (!scope) throw new Error("Unauthorized.");
  const current = await getAdminOrder(userId, orderId);
  if (!current) throw new Error("Order not found.");
  const currentStatus = current.order.status as OrderStatus;
  if (!transitions[currentStatus]?.includes(nextStatus)) throw new Error(`Invalid status transition from ${currentStatus} to ${nextStatus}.`);
  const actorType = scope.role === "store_manager" ? "store_manager" : "admin";
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.update(orders).set({ status: nextStatus, updatedAt: new Date(), shippingStatus: nextStatus === "shipped" ? "shipped" : current.order.shippingStatus }).where(eq(orders.id, orderId));
    await tx.insert(orderStatusHistory).values({ id: `history_${randomBytes(12).toString("hex")}`, orderId, previousStatus: currentStatus, newStatus: nextStatus, actorType, actorUserId: userId, note: note ?? null, createdAt: new Date() });
  });
}

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Authentication required.");
  const scope = await getAdminScope(user.id);
  if (!scope) throw new Error("Admin access required.");
  return { user, scope };
}

export async function cancelCustomerOrder(userId: string, orderId: string) {
  const data = await getCustomerOrder(userId, orderId);
  if (!data) throw new Error("Order not found.");
  if (!transitions[data.order.status as OrderStatus]?.includes("cancelled")) throw new Error("This order can no longer be cancelled.");
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.update(orders).set({ status: "cancelled", updatedAt: new Date() }).where(eq(orders.id, orderId));
    await tx.insert(orderStatusHistory).values({ id: `history_${randomBytes(12).toString("hex")}`, orderId, previousStatus: data.order.status, newStatus: "cancelled", actorType: "customer", actorUserId: userId, note: "Cancelled by customer", createdAt: new Date() });
  });
}