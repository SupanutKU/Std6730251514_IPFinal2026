-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 20, 2026 at 07:27 AM
-- Server version: 8.0.46-0ubuntu0.24.04.4
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ip_std6730251514`
--

-- --------------------------------------------------------

--
-- Table structure for table `Supanut_6730251514_Employees`
--

CREATE TABLE `Supanut_6730251514_Employees` (
  `Supanut_6730251514_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Supanut_6730251514_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Supanut_6730251514_position` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Supanut_6730251514_status` enum('Active','On Leave') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Active',
  `Supanut_6730251514_salary` decimal(12,2) NOT NULL
) ;

--
-- Dumping data for table `Supanut_6730251514_Employees`
--

INSERT INTO `Supanut_6730251514_Employees` (`Supanut_6730251514_id`, `Supanut_6730251514_name`, `Supanut_6730251514_position`, `Supanut_6730251514_status`, `Supanut_6730251514_salary`) VALUES
('2', 'Anna Lee', 'IT Manager', 'Active', 95000.00),
('3', 'Jane Smith', 'HR Officer', 'Active', 25000.00),
('4', 'John Doe', 'Software Engineer', 'Active', 45000.00),
('5', 'Somchai Jaidee', 'Office Assistant', 'Active', 18000.00),
('6', 'Supanut Chuedee', 'Senior Developer', 'Active', 850000.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Supanut_6730251514_Employees`
--
ALTER TABLE `Supanut_6730251514_Employees`
  ADD PRIMARY KEY (`Supanut_6730251514_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
