-- SQL Server / SSMS. Optional: skip if using a university-provided database.
-- Requires CREATE DATABASE permission. Does not delete or overwrite data.
IF DB_ID(N'Supanut_6730251514_HR') IS NULL
BEGIN
    EXEC(N'CREATE DATABASE [Supanut_6730251514_HR]');
END;
GO
