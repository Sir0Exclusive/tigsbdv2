DROP INDEX "stores_key_unique";--> statement-breakpoint
DROP INDEX "stores_slug_unique";--> statement-breakpoint
DROP INDEX "users_email_unique";--> statement-breakpoint
DROP INDEX "categories_store_slug_unique";--> statement-breakpoint
DROP INDEX "categories_store_status_idx";--> statement-breakpoint
DROP INDEX "product_categories_category_idx";--> statement-breakpoint
DROP INDEX "product_inventory_product_store_unique";--> statement-breakpoint
DROP INDEX "product_inventory_store_idx";--> statement-breakpoint
DROP INDEX "product_media_product_order_idx";--> statement-breakpoint
DROP INDEX "product_variants_sku_unique";--> statement-breakpoint
DROP INDEX "product_variants_product_idx";--> statement-breakpoint
DROP INDEX "products_store_sku_unique";--> statement-breakpoint
DROP INDEX "products_store_slug_unique";--> statement-breakpoint
DROP INDEX "products_store_status_visibility_idx";--> statement-breakpoint
DROP INDEX "cart_items_cart_idx";--> statement-breakpoint
DROP INDEX "carts_guest_token_hash_unique";--> statement-breakpoint
DROP INDEX "carts_user_active_unique";--> statement-breakpoint
DROP INDEX "carts_guest_token_idx";--> statement-breakpoint
DROP INDEX "order_items_order_idx";--> statement-breakpoint
DROP INDEX "order_items_store_idx";--> statement-breakpoint
DROP INDEX "orders_order_number_unique";--> statement-breakpoint
DROP INDEX "orders_idempotency_unique";--> statement-breakpoint
DROP INDEX "orders_user_status_idx";--> statement-breakpoint
ALTER TABLE `orders` ALTER COLUMN "currency" TO "currency" text NOT NULL DEFAULT 'BDT';--> statement-breakpoint
CREATE UNIQUE INDEX `stores_key_unique` ON `stores` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `stores_slug_unique` ON `stores` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `categories_store_slug_unique` ON `categories` (`store_id`,`slug`);--> statement-breakpoint
CREATE INDEX `categories_store_status_idx` ON `categories` (`store_id`,`status`);--> statement-breakpoint
CREATE INDEX `product_categories_category_idx` ON `product_categories` (`category_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_inventory_product_store_unique` ON `product_inventory` (`product_id`,`store_id`);--> statement-breakpoint
CREATE INDEX `product_inventory_store_idx` ON `product_inventory` (`store_id`);--> statement-breakpoint
CREATE INDEX `product_media_product_order_idx` ON `product_media` (`product_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `product_variants_sku_unique` ON `product_variants` (`sku`);--> statement-breakpoint
CREATE INDEX `product_variants_product_idx` ON `product_variants` (`product_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_store_sku_unique` ON `products` (`store_id`,`sku`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_store_slug_unique` ON `products` (`store_id`,`slug`);--> statement-breakpoint
CREATE INDEX `products_store_status_visibility_idx` ON `products` (`store_id`,`status`,`visibility`);--> statement-breakpoint
CREATE INDEX `cart_items_cart_idx` ON `cart_items` (`cart_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `carts_guest_token_hash_unique` ON `carts` (`guest_token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `carts_user_active_unique` ON `carts` (`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `carts_guest_token_idx` ON `carts` (`guest_token_hash`);--> statement-breakpoint
CREATE INDEX `order_items_order_idx` ON `order_items` (`order_id`);--> statement-breakpoint
CREATE INDEX `order_items_store_idx` ON `order_items` (`store_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_order_number_unique` ON `orders` (`order_number`);--> statement-breakpoint
CREATE UNIQUE INDEX `orders_idempotency_unique` ON `orders` (`idempotency_key`);--> statement-breakpoint
CREATE INDEX `orders_user_status_idx` ON `orders` (`user_id`,`status`);