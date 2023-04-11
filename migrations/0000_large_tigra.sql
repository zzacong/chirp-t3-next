-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migraitons
/*
CREATE TABLE `Post` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`content` varchar(255) NOT NULL,
	`authorId` varchar(191) NOT NULL
);

CREATE INDEX `Post_authorId_idx` ON `Post` (`authorId`);
*/