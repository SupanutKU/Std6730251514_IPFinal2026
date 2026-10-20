-- Optional seed data. Existing IDs are left unchanged when rerun.
USE `ip_std6730251514`;
INSERT INTO `Supanut_6730251514_Employees`
 (`Supanut_6730251514_id`,`Supanut_6730251514_name`,`Supanut_6730251514_position`,`Supanut_6730251514_status`,`Supanut_6730251514_salary`)
VALUES
 ('1','John Doe','Software Engineer','Active',45000),
 ('2','Jane Smith','HR Officer','Active',25000),
 ('3','Somchai Jaidee','Office Assistant','On Leave',18000),
 ('4','Supanut','Senior Developer','Active',85000),
 ('5','Anna Lee','IT Manager','Active',95000)
ON DUPLICATE KEY UPDATE `Supanut_6730251514_id`=`Supanut_6730251514_id`;
SELECT * FROM `Supanut_6730251514_Employees`;
