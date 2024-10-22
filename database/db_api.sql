-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2024 at 12:09 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` int(11) NOT NULL,
  `banner_name` varchar(255) NOT NULL,
  `banner_image` varchar(255) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `banner_name`, `banner_image`, `description`) VALUES
(1, 'Banner 1', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(2, 'Banner 2', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(3, 'Banner 3', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(4, 'Banner 4', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(5, 'Banner 5', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet'),
(6, 'Banner 6', 'https://nutech-integrasi.app/dummy.jpg', 'Lerem Ipsum Dolor sit amet');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `service_code` varchar(50) NOT NULL,
  `service_name` varchar(255) NOT NULL,
  `service_icon` varchar(255) NOT NULL,
  `service_tariff` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `service_code`, `service_name`, `service_icon`, `service_tariff`) VALUES
(1, 'PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', '40000.00'),
(2, 'PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', '10000.00'),
(3, 'PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', '40000.00'),
(4, 'PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', '40000.00'),
(5, 'PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', '50000.00'),
(6, 'MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', '50000.00'),
(7, 'TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', '50000.00'),
(8, 'PAKET_DATA', 'Paket Data', 'https://nutech-integrasi.app/dummy.jpg', '50000.00'),
(9, 'VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', '100000.00'),
(10, 'VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', '100000.00'),
(11, 'QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', '200000.00'),
(12, 'ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', '300000.00');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service_code` varchar(50) DEFAULT NULL,
  `transaction_type` enum('TOPUP','PAYMENT') NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `invoice_number`, `user_id`, `service_code`, `transaction_type`, `total_amount`, `description`, `created_on`) VALUES
(1, 'INV1729585891265', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 08:31:31'),
(2, 'INV1729585906895', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 08:31:46'),
(3, 'INV1729588802181', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 09:20:02'),
(4, 'INV1729588805058', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 09:20:05'),
(5, 'INV1729588806816', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 09:20:06'),
(6, 'INV1729588808098', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 09:20:08'),
(7, 'INV1729588809605', 4, NULL, 'TOPUP', '50000.00', 'Top Up Balance', '2024-10-22 09:20:09'),
(8, 'INV1729589873406', 5, NULL, 'TOPUP', '1500000.00', 'Top Up Balance', '2024-10-22 09:37:53'),
(9, 'INV1729591095731', 5, 'PAJAK', 'PAYMENT', '40000.00', 'Pajak PBB', '2024-10-22 09:58:15'),
(10, 'INV1729591098354', 5, 'PAJAK', 'PAYMENT', '40000.00', 'Pajak PBB', '2024-10-22 09:58:18'),
(11, 'INV1729591163154', 5, 'PAJAK', 'PAYMENT', '40000.00', 'Pajak PBB', '2024-10-22 09:59:23');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `balance` decimal(10,2) DEFAULT 0.00,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `password`, `balance`, `profile_image`) VALUES
(1, 'arfieyan1903@gmail.com', 'arfiyan', 'wahyu', '$2b$10$cTjOvs.gJll/n9qboXbYvOWuteZn8xSxh6S80ACITt0SjLKLSyGVW', '0.00', NULL),
(3, 'arfieyan19032@gmail.com', 'ww', 'wewew', '$2b$10$NnHQUP1GeQtP/UavzHquROy..CreGFwvFdfwPkTlJPq07ZeoWtvaa', '0.00', NULL),
(4, 'arfiyan@gmail.com', 'User Arfiyan', 'Programmer Nutech', '$2b$10$wosjB1EFuvEOuDAP1VzCYuJ7J23tb0YMhcjM65zmDYU82CkrqJBwG', '350000.00', '/uploads/profile_images/file-1729409350187-524795655.png'),
(5, 'arfiyanwahyu@gmail.com', 'User Arfiyan Wahyu', 'Programmer Nutech', '$2b$10$j8rvb9KwdMdWhhiDHvV6peEFNX5tbG4kP/ti0I16iUHNo8eWB582.', '1500000.00', '/uploads/profile_images/file-1729589457453-400957169.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `banners`
--
ALTER TABLE `banners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
