import { NextResponse } from "next/server";
import { sql, eq, and } from "drizzle-orm";
import { categories, products } from "@/lib/db/schema";

export async function GET() {
  const results: any = {};
  try {
    const { getDb } = await import("@/lib/db/client");
    const db = getDb();

    results.step1 = "importing db";
    const allProducts = await db.select().from(products);
    results.step2 = "loaded products";
    results.allProductsCount = allProducts.length;

    const activeVisibleProducts = await db.select().from(products).where(and(eq(products.status, "active"), eq(products.visibility, "visible")));
    results.step3 = "queried active/visible";
    results.activeVisibleProductsCount = activeVisibleProducts.length;

    const tigsbdProducts = await db.select().from(products).where(eq(products.storeId, "store_tigsbd"));
    results.step4 = "queried tigsbd";
    results.tigsbdOnlyCount = tigsbdProducts.length;

    const tigsbdActiveVisibleProducts = await db.select().from(products).where(and(eq(products.storeId, "store_tigsbd"), eq(products.status, "active"), eq(products.visibility, "visible")));
    results.step5 = "queried tigsbd active/visible";
    results.tigsbdActiveVisibleCount = tigsbdActiveVisibleProducts.length;

    const allCats = await db.select().from(categories);
    results.step6 = "queried categories";
    results.categoriesCount = allCats.length;

    results.finalStep = "success";
    return NextResponse.json(results);
  } catch (error) {
    results.error = error instanceof Error ? error.message : "Unknown error";
    results.stack = error instanceof Error ? error.stack?.split("\n").slice(0, 2) : undefined;
    return NextResponse.json(results, { status: 500 });
  }
}
