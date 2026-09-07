import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { products, productVariants } from "./catalog";
import { users } from "./users";

export const carts = sqliteTable("carts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  guestTokenHash: text("guest_token_hash").unique(),
  status: text("status", { enum: ["active", "merged", "abandoned"] }).notNull().default("active"),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  dataSource: text("data_source").notNull().default("runtime"),
  seedBatchId: text("seed_batch_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  userActive: uniqueIndex("carts_user_active_unique").on(table.userId, table.status),
  guestLookup: index("carts_guest_token_idx").on(table.guestTokenHash),
}));

export const cartItems = sqliteTable("cart_items", {
  cartId: text("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  productId: text("product_id").notNull().references(() => products.id),
  variantId: text("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.cartId, table.productId, table.variantId] }),
  cartLookup: index("cart_items_cart_idx").on(table.cartId),
}));

export type Cart = typeof carts.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;