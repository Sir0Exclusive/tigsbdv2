# Decisions

## Phase 0

- Use Next.js App Router with a `src` directory and the `@/*` import alias.
- Use Drizzle ORM with `@libsql/client` for Turso/libSQL compatibility.
- Keep authentication server-side; Phase 0 provides signed session primitives without building login or account flows.
- Use a single `stores` table with `tigsbd` and `sarongo` records rather than separate catalog tables.