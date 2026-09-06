# Progress

## Current phase

Phase 1 - Store foundation

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

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed.
- `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` passed against local libSQL.
- `/tigsbd`, `/sarongo`, and invalid store routing verified locally.
- Desktop and 390px responsive storefront layouts visually inspected.

## Known issues

None known.

## Next phase

Wait for approval before starting Phase 2.