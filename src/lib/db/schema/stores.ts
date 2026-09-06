import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const stores = sqliteTable("stores", {
  id: text("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  logo: text("logo").notNull().default(""),
  branding: text("branding", { mode: "json" }).$type<Record<string, string>>().notNull().default({}),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
  settings: text("settings", { mode: "json" }).$type<Record<string, unknown>>().notNull(),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  dataSource: text("data_source").notNull().default("system"),
  seedBatchId: text("seed_batch_id"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;