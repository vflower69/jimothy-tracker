CREATE TABLE `sightings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location` varchar(500) NOT NULL,
	`latitude` double NOT NULL,
	`longitude` double NOT NULL,
	`sightedAt` bigint NOT NULL,
	`note` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sightings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `sightings_sightedAt_idx` ON `sightings` (`sightedAt`);--> statement-breakpoint
CREATE INDEX `sightings_createdAt_idx` ON `sightings` (`createdAt`);