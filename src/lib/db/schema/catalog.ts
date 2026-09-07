import { index, integer, primaryKey, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import { stores } from "./stores";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
};

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  storeId: text("store_id").notNull().references(() => stores.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ["active", "hidden"] }).notNull().default("active"),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  dataSource: text("data_source").notNull().default("seed"),
  seedBatchId: text("seed_batch_id"),
  ...timestamps,
}, (table) => ({
  storeSlug: uniqueIndex("categories_store_slug_unique").on(table.storeId, table.slug),
  storeStatus: index("categories_store_status_idx").on(table.storeId, table.status),
}));

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  storeId: text("store_id").notNull().references(() => stores.id),
  sku: text("sku").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  priceCents: integer("price_cents").notNull(),
  salePriceCents: integer("sale_price_cents"),
  status: text("status", { enum: ["draft", "active", "archived"] }).notNull().default("draft"),
  visibility: text("visibility", { enum: ["visible", "hidden"] }).notNull().default("visible"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  seoTitle: text("seo_title").notNull(),
  seoDescription: text("seo_description").notNull(),
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(false),
  dataSource: text("data_source").notNull().default("seed"),
  seedBatchId: text("seed_batch_id"),
  ...timestamps,
}, (table) => ({
  storeSku: uniqueIndex("products_store_sku_unique").on(table.storeId, table.sku),
  storeSlug: uniqueIndex("products_store_slug_unique").on(table.storeId, table.slug),
  catalogLookup: index("products_store_status_visibility_idx").on(table.storeId, table.status, table.visibility),
}));

export const productCategories = sqliteTable("product_categories", {
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: primaryKey({ columns: [table.productId, table.categoryId] }),
  categoryLookup: index("product_categories_category_idx").on(table.categoryId),
}));

export const productVariants = sqliteTable("product_variants", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  priceCents: integer("price_cents"),
  options: text("options", { mode: "json" }).$type<Record<string, string>>().notNull(),
  status: text("status", { enum: ["active", "hidden"] }).notNull().default("active"),
  ...timestamps,
}, (table) => ({ productLookup: index("product_variants_product_idx").on(table.productId) }));

export const productMedia = sqliteTable("product_media", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  kind: text("kind", { enum: ["placeholder", "image"] }).notNull().default("placeholder"),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
}, (table) => ({ productOrder: index("product_media_product_order_idx").on(table.productId, table.sortOrder) }));

export const productInventory = sqliteTable("product_inventory", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  storeId: text("store_id").notNull().references(() => stores.id),
  availableQuantity: integer("available_quantity").notNull().default(0),
  reservedQuantity: integer("reserved_quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(3),
  ...timestamps,
}, (table) => ({ productStore: uniqueIndex("product_inventory_product_store_unique").on(table.productId, table.storeId), storeLookup: index("product_inventory_store_idx").on(table.storeId) }));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type ProductMedia = typeof productMedia.$inferSelect;
export type ProductInventory = typeof productInventory.$inferSelect;