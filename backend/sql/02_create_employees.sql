-- SQL Server / SSMS: select your target database from the dropdown first.
-- For a newly created database: USE [Supanut_6730251514_HR];
-- Table and ALL column names have the requested prefix.
SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.Supanut_6730251514_Employees', N'U') IS NULL
BEGIN
 CREATE TABLE dbo.Supanut_6730251514_Employees (
  Supanut_6730251514_id NVARCHAR(36) NOT NULL
   CONSTRAINT PK_Supanut_6730251514_Employees PRIMARY KEY
   CONSTRAINT DF_Supanut_6730251514_id DEFAULT CONVERT(NVARCHAR(36), NEWID()),
  Supanut_6730251514_name NVARCHAR(100) NOT NULL,
  Supanut_6730251514_position NVARCHAR(100) NOT NULL,
  Supanut_6730251514_status NVARCHAR(10) NOT NULL
   CONSTRAINT DF_Supanut_6730251514_status DEFAULT N'Active',
  Supanut_6730251514_salary DECIMAL(12,2) NOT NULL,
  CONSTRAINT CK_Supanut_6730251514_name CHECK (LEN(LTRIM(RTRIM(Supanut_6730251514_name))) > 0),
  CONSTRAINT CK_Supanut_6730251514_position CHECK (LEN(LTRIM(RTRIM(Supanut_6730251514_position))) > 0),
  CONSTRAINT CK_Supanut_6730251514_status CHECK (Supanut_6730251514_status IN (N'Active',N'On Leave')),
  CONSTRAINT CK_Supanut_6730251514_salary CHECK (Supanut_6730251514_salary >= 0)
 );
 INSERT INTO dbo.Supanut_6730251514_Employees
 (Supanut_6730251514_id,Supanut_6730251514_name,Supanut_6730251514_position,Supanut_6730251514_status,Supanut_6730251514_salary)
 VALUES
 (N'1',N'John Doe',N'Software Engineer',N'Active',45000),
 (N'2',N'Jane Smith',N'HR Officer',N'Active',25000),
 (N'3',N'Somchai Jaidee',N'Office Assistant',N'On Leave',18000),
 (N'4',N'Supanut',N'Senior Developer',N'Active',85000),
 (N'5',N'Anna Lee',N'IT Manager',N'Active',95000);
END;
COMMIT TRANSACTION;
SELECT * FROM dbo.Supanut_6730251514_Employees;
