CREATE TABLE `credentials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`credential_type` text NOT NULL,
	`base_credential` text NOT NULL,
	`issued_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`revoked_at` integer
);
--> statement-breakpoint
CREATE INDEX `credential_type_idx` ON `credentials` (`credential_type`);--> statement-breakpoint
CREATE TABLE `status_lists` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`credential_type` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`last_message_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
