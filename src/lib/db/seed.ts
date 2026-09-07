import { db } from "@/lib/db/client";
import { categories, productCategories, productInventory, productMedia, products, productVariants, stores } from "@/lib/db/schema";

const now = new Date();
const seedBatchId = "phase-1-store-foundation";
const catalogSeedBatchId = "phase-3-catalog-foundation";

const initialStores = [
  {
    id: "store_tigsbd",
    key: "tigsbd",
    name: "TIGSBD",
    slug: "tigsbd",
    description: "TIGSBD storefront catalog",
    logo: "TIGSBD",
    branding: { accent: "#e7a83e", accentSoft: "#fff2d2", ink: "#101827" },
    status: "active" as const,
    settings: { shellVersion: "phase-1" },
    isDemo: false,
    dataSource: "system",
    seedBatchId,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "store_sarongo",
    key: "sarongo",
    name: "Sarongo",
    slug: "sarongo",
    description: "Sarongo storefront catalog",
    logo: "SARONGO",
    branding: { accent: "#d97852", accentSoft: "#ffe4d9", ink: "#241817" },
    status: "active" as const,
    settings: { shellVersion: "phase-1" },
    isDemo: false,
    dataSource: "system",
    seedBatchId,
    createdAt: now,
    updatedAt: now,
  },
];

async function seed() {
  for (const store of initialStores) {
    await db.insert(stores).values(store).onConflictDoUpdate({
      target: stores.key,
      set: {
        name: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logo,
        branding: store.branding,
        status: store.status,
        settings: store.settings,
        isDemo: store.isDemo,
        dataSource: store.dataSource,
        seedBatchId: store.seedBatchId,
        updatedAt: store.updatedAt,
      },
    });
  }
  const catalogCategories = [
    { id: "cat_tigsbd_home", storeId: "store_tigsbd", name: "Home edit", slug: "home-edit", description: "Quiet essentials for considered spaces." },
    { id: "cat_tigsbd_daily", storeId: "store_tigsbd", name: "Daily carry", slug: "daily-carry", description: "Useful pieces for the rhythm of the day." },
    { id: "cat_sarongo_objects", storeId: "store_sarongo", name: "Collected objects", slug: "collected-objects", description: "Distinctive objects with a story to tell." },
    { id: "cat_sarongo_textiles", storeId: "store_sarongo", name: "Soft goods", slug: "soft-goods", description: "Warm textures for slower moments." },
  ];
  for (const category of catalogCategories) {
    await db.insert(categories).values({ ...category, status: "active", isDemo: true, dataSource: "seed", seedBatchId: catalogSeedBatchId, createdAt: now, updatedAt: now }).onConflictDoUpdate({ target: categories.id, set: { ...category, updatedAt: now } });
  }
  const catalogProducts = [
    { id: "prod_tigsbd_linen-tray", storeId: "store_tigsbd", sku: "TIG-HOME-001", name: "Linen Catchall Tray", slug: "linen-catchall-tray", shortDescription: "A soft-edged landing place for the small essentials.", description: "Made for keys, glasses, and the quiet ritual of arriving home, this linen-lined tray keeps daily objects gathered without making a scene.", priceCents: 4200, salePriceCents: null, featured: true, categoryId: "cat_tigsbd_home", accent: "#e7a83e" },
    { id: "prod_tigsbd_carry-notebook", storeId: "store_tigsbd", sku: "TIG-DAILY-002", name: "Field Notes Journal", slug: "field-notes-journal", shortDescription: "A substantial notebook for plans, lists, and loose thoughts.", description: "A tactile, thread-bound journal with generous pages for the things worth keeping close.", priceCents: 2600, salePriceCents: 2200, featured: false, categoryId: "cat_tigsbd_daily", accent: "#9b8061" },
    { id: "prod_tigsbd_ceramic-mug", storeId: "store_tigsbd", sku: "TIG-HOME-003", name: "Morning Ceramic Mug", slug: "morning-ceramic-mug", shortDescription: "A balanced stoneware mug with a warm satin glaze.", description: "Comfortable in the hand and generous enough for a long morning, finished in a restrained clay tone.", priceCents: 3400, salePriceCents: null, featured: true, categoryId: "cat_tigsbd_home", accent: "#c88963" },
    { id: "prod_sarongo_brass-vessel", storeId: "store_sarongo", sku: "SAR-OBJ-001", name: "Brass Line Vessel", slug: "brass-line-vessel", shortDescription: "A sculptural vessel for a single stem or an empty shelf.", description: "The Brass Line Vessel brings a little considered weight to a room, with a hand-finished profile that catches changing light.", priceCents: 6800, salePriceCents: null, featured: true, categoryId: "cat_sarongo_objects", accent: "#d97852" },
    { id: "prod_sarongo_woven-throw", storeId: "store_sarongo", sku: "SAR-SOFT-002", name: "Woven Ochre Throw", slug: "woven-ochre-throw", shortDescription: "A generous layer in textured cotton with an ochre edge.", description: "Light enough for a chair and warm enough for a late evening, woven with a quietly irregular texture.", priceCents: 8400, salePriceCents: 7200, featured: true, categoryId: "cat_sarongo_textiles", accent: "#b78e4b" },
    { id: "prod_sarongo-glass-candle", storeId: "store_sarongo", sku: "SAR-OBJ-003", name: "Amber Glass Candle", slug: "amber-glass-candle", shortDescription: "A low glow with notes of cedar, fig, and warm paper.", description: "Poured into amber glass and designed to stay in the room after the flame is gone.", priceCents: 3800, salePriceCents: null, featured: false, categoryId: "cat_sarongo_objects", accent: "#aa6d46" },
  ];
  for (const product of catalogProducts) {
    const { categoryId, accent, ...productValues } = product;
    await db.insert(products).values({ ...productValues, status: "active", visibility: "visible", seoTitle: product.name, seoDescription: product.shortDescription, isDemo: true, dataSource: "seed", seedBatchId: catalogSeedBatchId, createdAt: now, updatedAt: now }).onConflictDoUpdate({ target: products.id, set: { ...productValues, status: "active", visibility: "visible", updatedAt: now } });
    await db.insert(productCategories).values({ productId: product.id, categoryId }).onConflictDoNothing();
    await db.insert(productMedia).values({ id: `${product.id}_media`, productId: product.id, kind: "placeholder", url: `placeholder://${accent.slice(1)}`, altText: product.name, sortOrder: 0, createdAt: now, updatedAt: now }).onConflictDoNothing();
    await db.insert(productInventory).values({ id: `${product.id}_inventory`, productId: product.id, storeId: product.storeId, availableQuantity: product.id.includes("throw") ? 2 : 12, reservedQuantity: 0, lowStockThreshold: 3, createdAt: now, updatedAt: now }).onConflictDoUpdate({ target: productInventory.id, set: { availableQuantity: product.id.includes("throw") ? 2 : 12, updatedAt: now } });
  }
  await db.insert(productVariants).values([
    { id: "variant_tigsbd_mug_sand", productId: "prod_tigsbd_ceramic-mug", name: "Sand", sku: "TIG-HOME-003-SAND", priceCents: null, options: { color: "Sand" }, status: "active", createdAt: now, updatedAt: now },
    { id: "variant_sarongo_throw_large", productId: "prod_sarongo_woven-throw", name: "Large", sku: "SAR-SOFT-002-L", priceCents: 8400, options: { size: "Large" }, status: "active", createdAt: now, updatedAt: now },
  ]).onConflictDoNothing();
  console.log("Seeded initial stores: tigsbd, sarongo");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});