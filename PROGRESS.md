# Progress

## Current phase

Phase 2 - Authentication and shared customer identity

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

## Verification

- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` passed.
- `npm run db:generate`, `npm run db:migrate`, and `npm run db:seed` passed against local libSQL.
- `/tigsbd`, `/sarongo`, and invalid store routing verified locally.
- Desktop and 390px responsive storefront layouts visually inspected.
- Registration, login state, cross-store persistence, logout, invalid credentials, and protected account access verified locally.

## Known issues

Email verification and password reset are intentionally deferred because no email provider is configured. Vercel currently has no database or auth environment variables, so production registration/login require those values to be configured before they can be verified.

## Next phase

Wait for approval before starting Phase 3.