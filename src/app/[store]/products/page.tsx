import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogGrid } from "@/components/catalog/catalog-grid";
import { listStoreCategories, listStoreProducts, resolveCatalogStore } from "@/lib/catalog";

type ProductsPageProps = { params: Promise<{ store: string }> };

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { store: slug } = await params;
  const store = await resolveCatalogStore(slug);
  if (!store) notFound();
  const [products, categories] = await Promise.all([listStoreProducts(store), listStoreCategories(store)]);
  return (
    <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end">
        <div><nav aria-label="Breadcrumb" className="text-sm text-slate-500"><Link href={`/${store.slug}`} className="hover:text-slate-950">{store.name}</Link><span className="px-2">/</span><span>Products</span></nav><h1 className="mt-4 text-4xl font-black tracking-tight">The {store.name} edit</h1><p className="mt-3 max-w-xl text-slate-600">A store-scoped collection of considered goods, gathered for this storefront.</p></div>
        <span className="text-sm font-semibold text-slate-500">{products.length} {products.length === 1 ? "item" : "items"}</span>
      </div>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Product categories">
        <Link href={`/${store.slug}/products`} className="shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">All products</Link>
        {categories.map((category) => <Link key={category.id} href={`/${store.slug}/category/${category.slug}`} className="shrink-0 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-950">{category.name}</Link>)}
      </div>
      <section className="mt-10"><CatalogGrid products={products} storeSlug={store.slug} /></section>
    </main>
  );
}