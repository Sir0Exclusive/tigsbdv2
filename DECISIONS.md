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

## Phase 4

- Use one platform-wide cart table, never store-specific carts.
- Keep guest identifiers opaque and hashed in the database; do not encode cart contents or prices in cookies.
- Merge guest lines into the authenticated cart at login/registration, combining matching product/variant lines and retaining distinct lines.
- Keep checkout disabled; the cart UI explicitly communicates that checkout belongs to a later phase.

## Phase 5

- Create one order containing all shared-cart lines, including mixed TIGSBD and Sarongo items.
- Re-read product, variant, and inventory data server-side; client totals are never accepted.
- Use an idempotency key to prevent duplicate order creation on retries.
- Use a pending placeholder payment adapter; no payment provider or sensitive payment data is stored.
- Clear the cart only after the order and all order items are created successfully.
- Defer inventory decrement/reservation, coupons, shipping integrations, refunds, and admin order management.

## Phase 5.1

- Use BDT as the sole platform currency, represented as integer poisha. Historical order currency values are preserved.
- Accept Bangladesh mobile formats beginning `01[3-9]` with 11 local digits or the `+880`/`880` equivalent.
- Collect division, district, and optional upazila/thana readiness without shipping a geographic database.
- Enable COD as the only active payment method; bKash, Nagad, and card remain provider method abstractions.
- Update only synthetic demo catalog prices through the existing idempotent seed; no real product/order records are deleted or converted.