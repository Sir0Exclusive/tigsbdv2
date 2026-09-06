PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_stores` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`logo` text DEFAULT '' NOT NULL,
	`branding` text DEFAULT '{}' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`settings` text NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`data_source` text DEFAULT 'system' NOT NULL,
	`seed_batch_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_stores`("id", "key", "name", "slug", "description", "logo", "branding", "status", "settings", "is_demo", "data_source", "seed_batch_id", "created_at", "updated_at") SELECT "id", "key", "name", "slug", "description", "logo", "branding", "status", "settings", "is_demo", "data_source", "seed_batch_id", "created_at", "updated_at" FROM `stores`;--> statement-breakpoint
DROP TABLE `stores`;--> statement-breakpoint
ALTER TABLE `__new_stores` RENAME TO `stores`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `stores_key_unique` ON `stores` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `stores_slug_unique` ON `stores` (`slug`);