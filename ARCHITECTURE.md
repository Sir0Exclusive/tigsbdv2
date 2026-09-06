# Architecture

TIGSBD and Sarongo are independent storefront catalogs on one shared commerce platform.

Phase 0 establishes the Next.js App Router, TypeScript, Tailwind CSS, Zod, a Turso/libSQL-compatible Drizzle client, a shared `stores` table, and a server-only session token boundary. Phase 1 adds one reusable `/[store]` route boundary, a centralized store registry, and one shared storefront shell for both initial stores. Phase 2 adds one shared customer identity system with server-side sessions used by both storefronts. Store ownership will be enforced by database `store_id` relationships as domain modules are added.

The application is intentionally local-first. Database access is isolated behind `src/lib/db`, authentication primitives behind `src/lib/auth`, environment validation behind `src/lib/env`, and store identity/configuration behind `src/lib/stores` so future infrastructure changes do not leak into UI code.

Store slugs are URL context only. The database `stores` entity remains the business boundary, and future store-owned records must reference it rather than creating store-specific table families.

Authentication is platform-wide rather than store-specific. Password hashes remain server-side, session cookies contain only opaque random tokens, and hashed session tokens plus expiry/revocation state are stored in the database. Account access is protected by a shared server-side `requireUser` boundary.