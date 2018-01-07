-- phpMyAdmin SQL Dump version 4.7.4
-- Host: 127.0.0.1
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Database: `webdb`
CREATE DATABASE IF NOT EXISTS `webdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
USE `webdb`;

-- Table structure for table `useraccount` - Creation: Jan 04, 2018 at 05:11 PM

DROP TABLE IF EXISTS `useraccount`;
CREATE TABLE `useraccount` (
  `uid` int(10) UNSIGNED NOT NULL,
  `account` varchar(150) COLLATE utf8_bin NOT NULL COMMENT 'Account Name',
  `passhash` varchar(32) COLLATE utf8_bin NOT NULL COMMENT 'Salted Hash (MD5)',
  `account_question` varchar(150) COLLATE utf8_bin NOT NULL COMMENT 'Secret (Account Recovery)',
  `fname` varchar(100) COLLATE utf8_bin NOT NULL COMMENT 'First Name',
  `mname` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'Middle Name',
  `lname` varchar(100) COLLATE utf8_bin DEFAULT NULL COMMENT 'Last Name',
  `bday` date DEFAULT NULL COMMENT 'Birthdate',
  `email` varchar(130) COLLATE utf8_bin NOT NULL,
  `regdate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration Date',
  `mail_opt` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Receive platform emails or notifications.',
  `remote_ip` varchar(16) COLLATE utf8_bin DEFAULT NULL COMMENT 'Initial IP',
  `last_active` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Last login',
  `last_ip` varchar(16) COLLATE utf8_bin DEFAULT NULL COMMENT 'Last IP',
  `daterelease` datetime DEFAULT CURRENT_TIMESTAMP COMMENT 'Date/time account can login after too many unsuccessful login attempts over a short time period. Prevents brute-force attacks.'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User Accounts';

-- Dumping data for table `useraccount`
-- Salted MD5 hash for account "account1" (pass simply: "pass1") --

INSERT INTO `useraccount` (`uid`, `account`, `passhash`, `account_question`, `fname`, `mname`, `lname`, `bday`, `email`, `regdate`, `mail_opt`, `remote_ip`, `last_active`, `last_ip`, `daterelease`) VALUES
(13, 'account1', '32d71cfc54da16695fcde685f928ee06', 'secret1', 'Firstname', 'Middlename', 'Lastname', '2018-01-01', 'lite00@shaw.ca', '2018-01-04 13:17:32', 1, '24.76.203.71', '2018-01-04 13:17:47', '24.76.203.71', '2018-01-04 13:17:32');

-- Table structure for table `userlogin_log` - Creation: Jan 04, 2018 at 07:14 PM

DROP TABLE IF EXISTS `userlogin_log`;
CREATE TABLE `userlogin_log` (
  `uid` int(11) NOT NULL COMMENT 'Unique Identifier',
  `remote_ip` varchar(16) COLLATE utf8_bin NOT NULL COMMENT 'Remote host',
  `datereg` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Login attempt date/time',
  `account` varchar(130) COLLATE utf8_bin DEFAULT NULL COMMENT 'Account (optional)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='User account login log';

-- Indexes for table `useraccount`

ALTER TABLE `useraccount`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD UNIQUE KEY `account_unique` (`account`) USING BTREE;

-- Indexes for table `userlogin_log`

ALTER TABLE `userlogin_log`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `account_idx` (`account`) USING BTREE;

-- AUTO_INCREMENT for table `useraccount`

ALTER TABLE `useraccount`
  MODIFY `uid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

-- AUTO_INCREMENT for table `userlogin_log`

ALTER TABLE `userlogin_log`
  MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Unique Identifier', AUTO_INCREMENT=22;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
