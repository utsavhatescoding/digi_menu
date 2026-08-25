CREATE TABLE `menus` (
	`slug` text PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`currency` text DEFAULT 'NPR' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`whatsapp` text DEFAULT '' NOT NULL,
	`maps_url` text DEFAULT '' NOT NULL,
	`menu_json` text NOT NULL,
	`published_at` integer NOT NULL
);
