import { NextResponse } from "next/server";
import { sql, eq, and } from "drizzle-orm";
import { categories, products, carts, cartItems } from "@/lib/db/schema";

export async function GET() {
  try {
    const { getDb } = await import("@/lib/db/client");
    const db = getDb();

    const tables = await db.all(sql.raw("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"));
    const allProducts = await db.select().from(products);
    const activeVisibleProducts = await db.select().from(products).where(and(eq(products.status, "active"), eq(products.visibility, "visible")));
    const tigsbdProducts = await db.select().from(products).where(eq(products.storeId, "store_tigsbd"));
    const tigsbdActiveVisibleProducts = await db.select().from(products).where(and(eq(products.storeId, "store_tigsbd"), eq(products.status, "active"), eq(products.visibility, "visible")));
    const allCats = await db.select().from(categories);
    const cartsData = await db.select().from(carts);
    const cartItemsData = await db.select().from(cartItems);

    return NextResponse.json({
      tablesCount: tables.length,
      tableNames: tables.map((t: any) => t.name),
      allProductsCount: allProducts.length,
      statusSamples: allProducts.slice(0, 2).map(p => ({ id: p.id, status: p.status, visibility: p.visibility, storeId: p.storeId })),
      activeVisibleProductsCount: activeVisibleProducts.length,
      tigsbdOnlyCount: tigsbdProducts.length,
      tigsbdActiveVisibleCount: tigsbdActiveVisibleProducts.length,
      categoriesCount: allCats.length,
      cartsCount: cartsData.length,
      cartItemsCount: cartItemsData.length,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
