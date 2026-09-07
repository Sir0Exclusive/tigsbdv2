import Link from "next/link";

import { MobileMenu } from "@/components/storefront/mobile-menu";
import { StoreSwitcher } from "@/components/storefront/store-switcher";
import type { PublicUser } from "@/lib/auth/service";
import { storeConfigs, type StoreConfig } from "@/lib/stores";

type StorefrontShellProps = {
  store: StoreConfig;
  children: React.ReactNode;
};

export async function StorefrontShell({ store, children }: StorefrontShellProps) {
  let currentUser: PublicUser | null = null;
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith("file:")) {
    const { getCurrentUser } = await import("@/lib/auth/session");
    currentUser = await getCurrentUser();
  }
  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-950" style={{ "--store-accent": store.colors.accent } as React.CSSProperties}>
      <div className="bg-slate-950 px-6 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-amber-200">
        Two stores. One considered shopping ecosystem.
      </div>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950 text-white shadow-xl shadow-slate-950/10">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <Link href={`/${store.slug}`} className="group shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">
            <span className="block text-xl font-black tracking-[0.2em] text-white transition-colors group-hover:text-amber-200">{store.logo}</span>
            <span className="mt-1 hidden text-[0.6rem] uppercase tracking-[0.18em] text-slate-400 sm:block">{store.description}</span>
          </Link>
          <div className="hidden items-center gap-5 lg:flex">
            <StoreSwitcher activeStore={store} />
            <div className="h-7 w-px bg-white/10" />
            <button type="button" disabled className="cursor-not-allowed text-sm text-slate-500" aria-label="Search coming in a later phase">Search</button>
            <Link href={currentUser ? "/account" : "/login?next=/account"} className="text-sm text-slate-200 transition-colors hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">{currentUser ? "Account" : "Login"}</Link>
            <Link href="/cart" className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-amber-200 hover:text-amber-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300">Cart</Link>
          </div>
          <MobileMenu activeStore={store} currentUser={currentUser} />
        </div>
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p><span className="font-semibold text-slate-900">{store.name}</span> is part of the TIGSBD + Sarongo platform.</p>
          <div className="flex gap-4">
            {storeConfigs.map((otherStore) => <Link key={otherStore.key} href={`/${otherStore.slug}`} className="font-medium text-slate-700 underline-offset-4 hover:underline">{otherStore.name}</Link>)}
          </div>
        </div>
      </footer>
    </div>
  );
}