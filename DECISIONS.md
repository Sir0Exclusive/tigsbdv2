# Decisions

## Phase 0

- Use Next.js App Router with a `src` directory and the `@/*` import alias.
- Use Drizzle ORM with `@libsql/client` for Turso/libSQL compatibility.
- Keep authentication server-side; Phase 0 provides signed session primitives without building login or account flows.
- Use a single `stores` table with `tigsbd` and `sarongo` records rather than separate catalog tables.

## Phase 2

- Use bcryptjs for password hashing to keep the self-contained Vercel/Turso deployment free of native runtime dependencies.
- Store only keyed hashes of random session tokens in the database; cookies are HttpOnly, SameSite=Lax, Secure in production, scoped to `/`, and expire after 30 days.
- Keep registration/login failure messages generic and add an in-memory rate-limit foundation without introducing paid infrastructure.
- Do not seed a demo login account with a weak password. Demo-user fields exist for future safe data management, while local tests create and remove synthetic users.
- Defer email verification and password reset until an email delivery infrastructure decision exists.

## Phase 3

- Keep one common catalog schema with explicit store ownership rather than separate TIGSBD/Sarongo table families.
- Treat TIGSBD as the main/default store and Sarongo as the sub-store in the centralized registry only; no additional hierarchy columns are introduced into the database.
- Use repository-safe placeholder media references and CSS-rendered product visuals. Do not add paid object storage.
- Keep catalog writes out of scope; Phase 3 provides safe server-side reads and synthetic demo seed data for both stores.
- Defer cart actions to Phase 4; product controls are intentionally non-mutating placeholders.