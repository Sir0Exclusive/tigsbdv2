import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { products, productVariants } from "./catalog";
import { stores } from "./stores";
import { users } from "./users";

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id").references(() => users.id),
  guestEmail: text("guest_email"),
  guestPhone: text("guest_phone"),
  status: text("status", { enum: ["pending", "confirmed", "cancelled"] }).notNull().default("pending"),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "failed"] }).notNull().default("pending"),
  paymentMethod: text("payment_method").notNull().default("placeholder"),
  currency: text("currency").notNull().default("USD"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  taxCents: integer("tax_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),
  shippingMethod: text("shipping_method").notNull(),
  shippingAddress: text("shipping_address", { mode: "json" }).$type<Record<string, string>>().notNull(),
  idempotencyKey: text("idempotency_key").notNull(),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  dataSource: text("data_source").notNull().default("checkout"),
  seedBatchId: text("seed_batch_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({ idempotency: uniqueIndex("orders_idempotency_unique").on(table.idempotencyKey), userStatus: index("orders_user_status_idx").on(table.userId, table.status) }));

export const orderItems = sqliteTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  storeId: text("store_id").notNull().references(() => stores.id),
  productId: text("product_id").notNull().references(() => products.id),
  variantId: text("variant_id").references(() => productVariants.id),
  productName: text("product_name").notNull(),
  productSku: text("product_sku").notNull(),
  storeName: text("store_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  lineTotalCents: integer("line_total_cents").notNull(),
  productSnapshot: text("product_snapshot", { mode: "json" }).$type<Record<string, string | number | null>>().notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({ orderLookup: index("order_items_order_idx").on(table.orderId), storeLookup: index("order_items_store_idx").on(table.storeId) }));

export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;