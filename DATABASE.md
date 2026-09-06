# Database

The current database plan is Turso/libSQL accessed through Drizzle ORM. Local development defaults to `file:./local.db`; hosted environments provide `DATABASE_URL` and `DATABASE_AUTH_TOKEN` through environment configuration.

Phase 1 extends the shared `stores` table with branding and demo-identification fields. Phase 2 adds shared `users` and revocable `sessions` tables. The two initial store records remain `tigsbd` and `sarongo`. No product, order, cart, payment, or admin tables exist yet.

User emails are normalized lowercase and unique. Passwords are stored as bcrypt hashes. Session identifiers are random opaque values presented in HttpOnly cookies; only keyed hashes of those values are stored in `sessions`.

Run `npm run db:seed` after configuring the database environment.