"use client";

import Link from "next/link";
import { useState } from "react";

import { storeConfigs, type StoreConfig } from "@/lib/stores";

type MobileMenuProps = {
  activeStore: StoreConfig;
};

export function MobileMenu({ activeStore }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
      >
        <span aria-hidden="true" className="text-lg leading-none">{isOpen ? "×" : "☰"}</span>
        <span>Menu</span>
      </button>
      {isOpen ? (
        <div id="mobile-navigation" className="absolute inset-x-0 top-full border-t border-white/10 bg-slate-950 px-6 py-6 shadow-2xl">
          <nav aria-label="Mobile navigation" className="mx-auto grid max-w-7xl gap-2">
            <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Switch store</p>
            {storeConfigs.map((store) => (
              <Link
                key={store.key}
                href={`/${store.slug}`}
                onClick={() => setIsOpen(false)}
                aria-current={store.slug === activeStore.slug ? "page" : undefined}
                className="rounded-xl px-3 py-3 text-base text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-300"
              >
                {store.name}
              </Link>
            ))}
            <div className="mt-3 border-t border-white/10 pt-3">
              <span className="px-3 text-sm text-slate-500">Browse, search, account and cart will arrive in later phases.</span>
            </div>
          </nav>
        </div>
      ) : null}
    </div>
  );
}