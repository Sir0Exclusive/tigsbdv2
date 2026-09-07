import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { stores } from "./stores";
import { users } from "./users";
import { orders } from "./orders";

export const orderStatusHistory = sqliteTable("order_status_history", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  actorType: text("actor_type", { enum: ["customer", "admin", "store_manager", "system"] }).notNull(),
  actorUserId: text("actor_user_id").references(() => users.id),
  note: text("note"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({ orderLookup: index("order_status_history_order_idx").on(table.orderId, table.createdAt) }));

export const adminUsers = sqliteTable("admin_users", {
  userId: text("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  role: text("role", { enum: ["platform_admin", "order_manager", "store_manager"] }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const adminStoreAssignments = sqliteTable("admin_store_assignments", {
  userId: text("user_id").notNull().references(() => adminUsers.userId, { onDelete: "cascade" }),
  storeId: text("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
}, (table) => ({ assignment: uniqueIndex("admin_store_assignment_unique").on(table.userId, table.storeId) }));

export type AdminUser = typeof adminUsers.$inferSelect;