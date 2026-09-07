import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductVisual } from "@/components/catalog/product-visual";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { getStoreProduct, resolveCatalogStore } from "@/lib/catalog";

type ProductPageProps = { params: Promise<{ store: string; product: string }> };

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { store: slug, product: productSlug } = await params;
  const store = await resolveCatalogStore(slug);
  if (!store) notFound();
  const item = await getStoreProduct(store, productSlug);
  if (!item) notFound();
  const accent = item.media[0]?.url.startsWith("placeholder://") ? `#${item.media[0].url.replace("placeholder://", "")}` : "#e7a83e";
  const stock = item.inventory?.availableQuantity ?? 0;
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href={`/${store.slug}`} className="hover:text-slate-950">{store.name}</Link><span className="px-2">/</span><Link href={`/${store.slug}/products`} className="hover:text-slate-950">Products</Link><span className="px-2">/</span><span>{item.product.name}</span></nav>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <ProductVisual name={item.product.name} accent={accent} />
        <section>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">{store.name} / Demo catalog</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">{item.product.name}</h1>
          <p className="mt-5 text-2xl font-bold text-slate-950">{formatPrice(item.product.salePriceCents ?? item.product.priceCents)}{item.product.salePriceCents ? <span className="ml-3 text-base font-medium text-slate-400 line-through">{formatPrice(item.product.priceCents)}</span> : null}</p>
          <p className="mt-6 text-lg leading-8 text-slate-600">{item.product.description}</p>
          <div className="mt-8 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-slate-100 px-4 py-2 font-semibold text-slate-700">SKU {item.product.sku}</span><span className={`rounded-full px-4 py-2 font-semibold ${stock > 0 ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"}`}>{stock > 0 ? `${stock} available` : "Currently unavailable"}</span></div>
          {item.variants.length ? <div className="mt-8"><h2 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">Options</h2><div className="mt-3 flex flex-wrap gap-2">{item.variants.map((variant) => <span key={variant.id} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold">{variant.name}</span>)}</div></div> : null}
          <AddToCartButton productId={item.product.id} variantId={item.variants.length === 1 ? item.variants[0].id : null} disabled={stock === 0} />
          <p className="mt-4 text-sm leading-6 text-slate-500">One shared cart across TIGSBD and Sarongo. Checkout is intentionally deferred.</p>
        </section>
      </div>
    </main>
  );
}