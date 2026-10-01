CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(300) NOT NULL,
	`severity` enum('critical','high','medium','low') NOT NULL DEFAULT 'medium',
	`details` text,
	`erpRecordId` int,
	`matchId` int,
	`status` enum('open','in_progress','resolved') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`resolvedAt` timestamp,
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(64) NOT NULL,
	`value` varchar(255) NOT NULL,
	CONSTRAINT `settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `bank_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceNo` varchar(64) NOT NULL,
	`date` varchar(32) NOT NULL,
	`amount` varchar(32) NOT NULL,
	`direction` enum('in','out') NOT NULL DEFAULT 'out',
	`party` varchar(200),
	`description` text,
	`source` varchar(32) NOT NULL DEFAULT 'manual',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bank_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `erp_records` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referenceNo` varchar(64) NOT NULL,
	`documentType` enum('invoice','po','credit_note') NOT NULL DEFAULT 'invoice',
	`supplier` varchar(200),
	`date` varchar(32) NOT NULL,
	`amount` varchar(32) NOT NULL,
	`description` text,
	`source` varchar(32) NOT NULL DEFAULT 'manual',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `erp_records_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`erpRecordId` int,
	`bankRecordId` int,
	`erpReference` varchar(64),
	`bankReference` varchar(64),
	`erpAmount` varchar(32),
	`bankAmount` varchar(32),
	`difference` varchar(32) DEFAULT '0',
	`status` enum('matched','partial','unmatched','pending_review') NOT NULL DEFAULT 'pending_review',
	`matchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
