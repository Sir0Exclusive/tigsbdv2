import { db } from "@/lib/db/client";
import { stores } from "@/lib/db/schema";

const now = new Date();

const initialStores = [
  {
    id: "store_tigsbd",
    key: "tigsbd",
    name: "TIGSBD",
    slug: "tigsbd",
    description: "TIGSBD storefront catalog",
    status: "active" as const,
    settings: { isDemo: false },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "store_sarongo",
    key: "sarongo",
    name: "Sarongo",
    slug: "sarongo",
    description: "Sarongo storefront catalog",
    status: "active" as const,
    settings: { isDemo: false },
    createdAt: now,
    updatedAt: now,
  },
];

async function seed() {
  await db.insert(stores).values(initialStores).onConflictDoNothing({ target: stores.key });
  console.log("Seeded initial stores: tigsbd, sarongo");
}

seed().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});