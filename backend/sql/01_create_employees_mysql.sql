-- phpMyAdmin: select ip_std6730251514, open SQL, paste and run.
-- Creates a new table only. Does not modify existing application tables.
USE `ip_std6730251514`;
CREATE TABLE IF NOT EXISTS `Supanut_6730251514_Employees` (
 `Supanut_6730251514_id` VARCHAR(36) NOT NULL,
 `Supanut_6730251514_name` VARCHAR(100) NOT NULL,
 `Supanut_6730251514_position` VARCHAR(100) NOT NULL,
 `Supanut_6730251514_status` ENUM('Active','On Leave') NOT NULL DEFAULT 'Active',
 `Supanut_6730251514_salary` DECIMAL(12,2) NOT NULL,
 PRIMARY KEY (`Supanut_6730251514_id`),
 CONSTRAINT `ck_supanut_salary` CHECK (`Supanut_6730251514_salary` >= 0),
 CONSTRAINT `ck_supanut_name` CHECK (CHAR_LENGTH(TRIM(`Supanut_6730251514_name`)) > 0),
 CONSTRAINT `ck_supanut_position` CHECK (CHAR_LENGTH(TRIM(`Supanut_6730251514_position`)) > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
