# Database

The current database plan is Turso/libSQL accessed through Drizzle ORM. Local development defaults to `file:./local.db`; hosted environments provide `DATABASE_URL` and `DATABASE_AUTH_TOKEN` through environment configuration.

Phase 1 extends the shared `stores` table with branding and demo-identification fields. The two initial store records remain `tigsbd` and `sarongo`. No product, customer, order, cart, payment, or admin tables exist yet.

Run `npm run db:seed` after configuring the database environment.