# Database

The current database plan is Turso/libSQL accessed through Drizzle ORM. Local development defaults to `file:./local.db`; hosted environments provide `DATABASE_URL` and `DATABASE_AUTH_TOKEN` through environment configuration.

Phase 0 creates the shared `stores` table and the two initial store records. No product, customer, order, cart, payment, or admin tables exist yet.

Run `npm run db:seed` after configuring the database environment.