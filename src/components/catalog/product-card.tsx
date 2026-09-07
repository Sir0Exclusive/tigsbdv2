import Link from "next/link";

import type { CatalogProduct } from "@/lib/catalog";

import { ProductVisual } from "./product-visual";
import { formatBDT } from "@/lib/money";

type ProductCardProps = {
  item: CatalogProduct;
  storeSlug: string;
};

export function ProductCard({ item, storeSlug }: ProductCardProps) {
  const { product, inventory } = item;
  const media = item.media[0];
  const accent = media?.url.startsWith("placeholder://") ? `#${media.url.replace("placeholder://", "")}` : "#e7a83e";
  const isLowStock = inventory ? inventory.availableQuantity > 0 && inventory.availableQuantity <= inventory.lowStockThreshold : false;
  return (
    <article className="group min-w-0">
      <Link href={`/${storeSlug}/product/${product.slug}`} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950">
        <ProductVisual name={product.name} accent={accent} />
        <div className="pt-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-950 transition-colors group-hover:text-slate-600">{product.name}</h3>
            <span className="shrink-0 text-sm font-bold text-slate-950">{formatBDT(product.salePriceCents ?? product.priceCents)}</span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{product.shortDescription}</p>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]">
            {product.salePriceCents ? <span className="text-amber-700">Special price</span> : null}
            {isLowStock ? <span className="text-orange-700">Low stock</span> : null}
            {inventory?.availableQuantity === 0 ? <span className="text-slate-400">Currently unavailable</span> : null}
          </div>
        </div>
      </Link>
    </article>
  );
}