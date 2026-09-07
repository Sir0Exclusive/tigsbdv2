import { and, desc, eq, inArray } from "drizzle-orm";

import { getDb } from "@/lib/db/client";
import { categories, productCategories, productInventory, productMedia, products, productVariants } from "@/lib/db/schema";
import { getStoreBySlug, type StoreConfig } from "@/lib/stores";

export type CatalogProduct = {
  product: typeof products.$inferSelect;
  media: typeof productMedia.$inferSelect[];
  inventory: typeof productInventory.$inferSelect | null;
  variants: typeof productVariants.$inferSelect[];
};

export async function resolveCatalogStore(slug: string): Promise<StoreConfig | null> {
  return getStoreBySlug(slug);
}

export async function listStoreCategories(store: StoreConfig) {
  const db = getDb();
  return db.select().from(categories).where(and(eq(categories.storeId, store.id), eq(categories.status, "active"))).orderBy(categories.name);
}

export async function listStoreProducts(store: StoreConfig, categorySlug?: string): Promise<CatalogProduct[]> {
  const db = getDb();
  let productIds: string[] | undefined;
  if (categorySlug) {
    const [category] = await db.select({ id: categories.id }).from(categories).where(and(eq(categories.storeId, store.id), eq(categories.slug, categorySlug), eq(categories.status, "active"))).limit(1);
    if (!category) return [];
    const categoryProducts = await db.select({ productId: productCategories.productId }).from(productCategories).innerJoin(products, eq(products.id, productCategories.productId)).where(and(eq(productCategories.categoryId, category.id), eq(products.storeId, store.id), eq(products.status, "active"), eq(products.visibility, "visible")));
    productIds = categoryProducts.map(({ productId }) => productId);
    if (productIds.length === 0) return [];
  }

  const conditions = [eq(products.storeId, store.id), eq(products.status, "active"), eq(products.visibility, "visible")];
  if (productIds) conditions.push(inArray(products.id, productIds));
  const rows = await db.select().from(products).where(and(...conditions)).orderBy(desc(products.featured), desc(products.createdAt));
  return hydrateProducts(rows, store.id);
}

export async function getStoreProduct(store: StoreConfig, slug: string): Promise<CatalogProduct | null> {
  const db = getDb();
  const [product] = await db.select().from(products).where(and(eq(products.storeId, store.id), eq(products.slug, slug), eq(products.status, "active"), eq(products.visibility, "visible"))).limit(1);
  if (!product) return null;
  const [hydrated] = await hydrateProducts([product], store.id);
  return hydrated ?? null;
}

async function hydrateProducts(productRows: typeof products.$inferSelect[], storeId: string): Promise<CatalogProduct[]> {
  const db = getDb();
  const ids = productRows.map((product) => product.id);
  if (ids.length === 0) return [];
  const [mediaRows, inventoryRows, variantRows] = await Promise.all([
    db.select().from(productMedia).where(inArray(productMedia.productId, ids)).orderBy(productMedia.sortOrder),
    db.select().from(productInventory).where(and(eq(productInventory.storeId, storeId), inArray(productInventory.productId, ids))),
    db.select().from(productVariants).where(inArray(productVariants.productId, ids)).orderBy(productVariants.name),
  ]);
  return productRows.map((product) => ({
    product,
    media: mediaRows.filter((media) => media.productId === product.id),
    inventory: inventoryRows.find((inventory) => inventory.productId === product.id) ?? null,
    variants: variantRows.filter((variant) => variant.productId === product.id),
  }));
}