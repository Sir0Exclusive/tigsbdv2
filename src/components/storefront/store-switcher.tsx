import Link from "next/link";

import { storeConfigs, type StoreConfig } from "@/lib/stores";

type StoreSwitcherProps = {
  activeStore: StoreConfig;
};

export function StoreSwitcher({ activeStore }: StoreSwitcherProps) {
  return (
    <nav aria-label="Store switcher" className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
      {storeConfigs.map((store) => {
        const isActive = store.slug === activeStore.slug;
        return (
          <Link
            key={store.key}
            href={`/${store.slug}`}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 ${
              isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {store.name}
          </Link>
        );
      })}
    </nav>
  );
}