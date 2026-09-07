import type { CatalogProduct } from "@/lib/catalog";

import { ProductCard } from "./product-card";

type CatalogGridProps = {
  products: CatalogProduct[];
  storeSlug: string;
};

export function CatalogGrid({ products, storeSlug }: CatalogGridProps) {
  if (products.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-slate-500">No products are available in this collection yet.</div>;
  }
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">{products.map((item) => <ProductCard key={item.product.id} item={item} storeSlug={storeSlug} />)}</div>;
}