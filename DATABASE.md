# Database

The current database plan is Turso/libSQL accessed through Drizzle ORM. Local development defaults to `file:./local.db`; hosted environments provide `DATABASE_URL` and `DATABASE_AUTH_TOKEN` through environment configuration.

Phase 1 extends the shared `stores` table with branding and demo-identification fields. Phase 2 adds shared `users` and revocable `sessions` tables. Phase 3 adds store-scoped `categories`, `products`, `product_categories`, `product_variants`, `product_media`, and `product_inventory` tables. Phase 4 adds shared `carts` and `cart_items` tables. The two initial store records remain `tigsbd` and `sarongo`; order, payment, and admin tables do not exist yet.

User emails are normalized lowercase and unique. Passwords are stored as bcrypt hashes. Session identifiers are random opaque values presented in HttpOnly cookies; only keyed hashes of those values are stored in `sessions`.

Catalog ownership is explicit through `store_id` foreign keys and composite store/slug and store/SKU indexes. Catalog reads resolve the route store first, then apply that store ID to every product/category/inventory query.

Cart items retain product and optional variant relationships, while cart ownership is either a shared `user_id` or a hashed opaque guest token. Cart lifecycle is tracked with `active`, `merged`, and `abandoned` statuses.

Run `npm run db:seed` after configuring the database environment.