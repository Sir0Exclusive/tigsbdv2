ALTER TABLE `stores` ADD `logo` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `branding` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `is_demo` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `data_source` text DEFAULT 'system' NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD `seed_batch_id` text;