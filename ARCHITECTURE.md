# Architecture

TIGSBD and Sarongo are independent storefront catalogs on one shared commerce platform.

Phase 0 establishes the Next.js App Router, TypeScript, Tailwind CSS, Zod, a Turso/libSQL-compatible Drizzle client, a shared `stores` table, and a server-only session token boundary. Store ownership will be enforced by database `store_id` relationships as domain modules are added.

The application is intentionally local-first. Database access is isolated behind `src/lib/db`, authentication primitives behind `src/lib/auth`, and environment validation behind `src/lib/env` so future infrastructure changes do not leak into UI code.