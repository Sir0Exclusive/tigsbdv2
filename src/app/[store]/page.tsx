import Link from "next/link";

import { resolveStore, storeConfigs } from "@/lib/stores";

type StorePageProps = {
  params: Promise<{ store: string }>;
};

export default async function StorePage({ params }: StorePageProps) {
  const { store: slug } = await params;
  const store = resolveStore(slug);
  if (!store) return null;
  const sibling = storeConfigs.find((candidate) => candidate.slug !== store.slug);

  return (
    <main>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:px-8 lg:py-28">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.22em]" style={{ color: store.colors.accent }}>{store.name} storefront</p>
            <h1 className="max-w-3xl text-5xl font-black tracking-[-0.04em] text-slate-950 sm:text-7xl">A clearer way to discover what belongs with you.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{store.description} This is the shared platform foundation: a distinct storefront now, with the catalog and commerce layers arriving in later phases.</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <span className="rounded-full px-5 py-3 text-sm font-semibold text-slate-950" style={{ backgroundColor: store.colors.accentSoft }}>Store context: {store.name}</span>
              {sibling ? <Link href={`/${sibling.slug}`} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-950 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">Visit {sibling.name}</Link> : null}
            </div>
          </div>
          <div className="relative min-h-72 overflow-hidden rounded-4xl bg-slate-950 p-8 text-white shadow-2xl shadow-slate-300/40 sm:min-h-96 sm:p-10">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-28 opacity-70" style={{ borderColor: store.colors.accent }} />
            <div className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border-18 border-white/10" />
            <div className="relative flex h-full min-h-56 flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Shared platform / 01</span>
              <div>
                <p className="text-3xl font-bold tracking-tight">{store.logo}</p>
                <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300">Independent identity, shared infrastructure, and one consistent standard of care.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-10 sm:grid-cols-3 lg:px-8">
        {["Independent store identity", "Shared platform foundation", "Commerce layers to come"].map((item, index) => (
          <div key={item} className="rounded-2xl border border-slate-200 bg-white p-6">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">0{index + 1}</span>
            <p className="mt-4 text-lg font-semibold text-slate-900">{item}</p>
          </div>
        ))}
      </section>
    </main>
  );
}