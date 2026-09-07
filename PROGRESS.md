# Progress

## Current phase

Phase 3 - Catalog foundation

## Completed

- New Next.js App Router project with TypeScript, React, Tailwind CSS, and ESLint.
- Turso/libSQL-compatible Drizzle database client and initial stores schema.
- Zod environment validation and `.env.example`.
- Server-only signed session token primitives.
- Minimal base application shell and health endpoint.
- Focused Phase 0 unit test setup.
- Centralized TIGSBD and Sarongo store registry with slug/key resolution.
- Shared `/tigsbd` and `/sarongo` storefront route and responsive shell.
- Accessible desktop/mobile store switcher, navigation foundation, and footer.
- Store-specific metadata, branding, and demo-identification schema fields.
- Phase 1 database migration and idempotent store seed.
- Shared customer `users` and revocable `sessions` schema.
- Bcrypt password hashing, normalized email identity, registration, login, and logout APIs.
- Server-side current-user and protected account boundary.
- Shared auth UI at `/login`, `/register`, and `/account`.
- Store shell account state integration and in-memory abuse-rate-limit foundation.
- Main/sub store hierarchy in centralized configuration: TIGSBD primary/default, Sarongo secondary.
- Store-scoped categories, products, relationships, variants, placeholder media, and inventory schema.
- Server-side catalog query layer with store-first isolation.
- Customer-facing store catalog listings, category pages, PDPs, pricing, variants, stock states, and breadcrumbs.
- Synthetic independent demo catalogs for both stores.

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed.
- `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` passed against local libSQL.
- `/tigsbd`, `/sarongo`, and invalid store routing verified locally.
- Desktop and 390px responsive storefront layouts visually inspected.
- Registration, login state, cross-store persistence, logout, invalid credentials, and protected account access verified locally.
- Catalog isolation tests and local visual verification for both stores, categories, PDPs, wrong-store PDP rejection, and 390px layout.

## Known issues

Email verification and password reset remain deferred because no email provider is configured. Cart, checkout, orders, and admin remain deferred to later phases.

## Next phase

Wait for approval before starting Phase 4.