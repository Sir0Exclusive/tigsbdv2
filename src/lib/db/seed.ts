import { db } from "@/lib/db/client";
import { stores } from "@/lib/db/schema";

const now = new Date();
const seedBatchId = "phase-1-store-foundation";

const initialStores = [
  {
    id: "store_tigsbd",
    key: "tigsbd",
    name: "TIGSBD",
    slug: "tigsbd",
    description: "TIGSBD storefront catalog",
    logo: "TIGSBD",
    branding: { accent: "#e7a83e", accentSoft: "#fff2d2", ink: "#101827" },
    status: "active" as const,
    settings: { shellVersion: "phase-1" },
    isDemo: false,
    dataSource: "system",
    seedBatchId,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "store_sarongo",
    key: "sarongo",
    name: "Sarongo",
    slug: "sarongo",
    description: "Sarongo storefront catalog",
    logo: "SARONGO",
    branding: { accent: "#d97852", accentSoft: "#ffe4d9", ink: "#241817" },
    status: "active" as const,
    settings: { shellVersion: "phase-1" },
    isDemo: false,
    dataSource: "system",
    seedBatchId,
    createdAt: now,
    updatedAt: now,
  },
];

async function seed() {
  for (const store of initialStores) {
    await db.insert(stores).values(store).onConflictDoUpdate({
      target: stores.key,
      set: {
        name: store.name,
        slug: store.slug,
        description: store.description,
        logo: store.logo,
        branding: store.branding,
        status: store.status,
        settings: store.settings,
        isDemo: store.isDemo,
        dataSource: store.dataSource,
        seedBatchId: store.seedBatchId,
        updatedAt: store.updatedAt,
      },
    });
  }
  console.log("Seeded initial stores: tigsbd, sarongo");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});