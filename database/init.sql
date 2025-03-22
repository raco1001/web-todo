USE todolist;


CREATE TABLE `team_lists` (
	`team_id` CHAR(36) NOT NULL,
	`list_id` BIGINT NOT NULL,
	PRIMARY KEY (`team_id`, `list_id`)
);

CREATE TABLE `users` (
	`id` CHAR(36) NOT NULL,
	`name` VARCHAR(50) NOT NULL,
	`password` VARCHAR(255) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);


CREATE TABLE `todolists` (
	`id` BIGINT NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NULL,
	`status` BOOLEAN NOT NULL DEFAULT FALSE,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);


CREATE TABLE `teams` (
	`id` CHAR(36) NOT NULL,
	`name` VARCHAR(50) NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);


CREATE TABLE `team_users` (
	`team_id` CHAR(36) NOT NULL,
	`user_id` CHAR(36) NOT NULL,
	`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`team_id`, `user_id`)
);


ALTER TABLE `team_lists` 
ADD CONSTRAINT `FK_teams_TO_team_lists_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

ALTER TABLE `team_lists` 
ADD CONSTRAINT `FK_todolists_TO_team_lists_1` FOREIGN KEY (`list_id`) REFERENCES `todolists` (`id`) ON DELETE CASCADE;


ALTER TABLE `team_users` 
ADD CONSTRAINT `FK_teams_TO_team_users_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE;

ALTER TABLE `team_users` 
ADD CONSTRAINT `FK_users_TO_team_users_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

