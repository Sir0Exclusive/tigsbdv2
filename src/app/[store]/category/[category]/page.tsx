import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { listStoreCategories, listStoreProducts, resolveCatalogStore } from "@/lib/catalog";

type CategoryPageProps = { params: Promise<{ store: string; category: string }> };

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { store: slug, category: categorySlug } = await params;
  const store = await resolveCatalogStore(slug);
  if (!store) notFound();
  const categories = await listStoreCategories(store);
  const category = categories.find((candidate) => candidate.slug === categorySlug);
  if (!category) notFound();
  const products = await listStoreProducts(store, category.slug);
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href={`/${store.slug}`} className="hover:text-slate-950">{store.name}</Link><span className="px-2">/</span><Link href={`/${store.slug}/products`} className="hover:text-slate-950">Products</Link><span className="px-2">/</span><span>{category.name}</span></nav>
      <div className="mt-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">Collection</p><h1 className="mt-3 text-4xl font-black tracking-tight">{category.name}</h1><p className="mt-3 max-w-xl text-slate-600">{category.description}</p></div><span className="text-sm font-semibold text-slate-500">{products.length} items</span></div>
      <section className="mt-10"><CatalogGrid products={products} storeSlug={store.slug} /></section>
    </main>
  );
}