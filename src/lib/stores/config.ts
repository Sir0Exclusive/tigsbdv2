export type StoreKey = "TIGSBD" | "SARONGO";

export type StoreConfig = {
  key: StoreKey;
  id: string;
  name: string;
  slug: string;
  role: "main" | "sub";
  isDefault: boolean;
  description: string;
  logo: string;
  colors: {
    accent: string;
    accentSoft: string;
    ink: string;
  };
  metadata: {
    title: string;
    description: string;
  };
};

export const storeConfigs: readonly StoreConfig[] = [
  {
    key: "TIGSBD",
    id: "store_tigsbd",
    name: "TIGSBD",
    slug: "tigsbd",
    role: "main",
    isDefault: true,
    description: "A considered collection for everyday living.",
    logo: "TIGSBD",
    colors: { accent: "#e7a83e", accentSoft: "#fff2d2", ink: "#101827" },
    metadata: {
      title: "TIGSBD | Thoughtful goods, clearly chosen",
      description: "Explore the TIGSBD storefront on the shared TIGSBD + Sarongo platform.",
    },
  },
  {
    key: "SARONGO",
    id: "store_sarongo",
    name: "Sarongo",
    slug: "sarongo",
    role: "sub",
    isDefault: false,
    description: "Distinctive finds with a warmer point of view.",
    logo: "SARONGO",
    colors: { accent: "#d97852", accentSoft: "#ffe4d9", ink: "#241817" },
    metadata: {
      title: "Sarongo | Distinctive finds, warmly gathered",
      description: "Explore the Sarongo storefront on the shared TIGSBD + Sarongo platform.",
    },
  },
];

export function getStoreBySlug(slug: string): StoreConfig | null {
  return storeConfigs.find((store) => store.slug === slug.toLowerCase()) ?? null;
}

export function getStoreByKey(key: string): StoreConfig | null {
  return storeConfigs.find((store) => store.key === key.toUpperCase()) ?? null;
}

export function resolveStore(value: string): StoreConfig | null {
  return getStoreBySlug(value) ?? getStoreByKey(value);
}