-- --------------------------------------------------------
-- 主机:                           192.168.100.204
-- 服务器版本:                        5.7.26 - MySQL Community Server (GPL)
-- 服务器操作系统:                      Linux
-- HeidiSQL 版本:                  10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 koa-bbs 的数据库结构
CREATE DATABASE IF NOT EXISTS `koa-bbs` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin */;
USE `koa-bbs`;

-- 导出  表 koa-bbs.users 结构
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8mb4_bin NOT NULL COMMENT '用户名唯一',
  `password` char(255) COLLATE utf8mb4_bin NOT NULL COMMENT '用户密码',
  `email` char(100) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户邮箱',
  `remember_token` char(100) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '重置密码的随机字符串',
  `remember_token_expiration` bigint(13) DEFAULT NULL,
  `avatar` char(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户头像',
  `introduction` char(255) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户简介',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `emial` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='用户表';

-- 数据导出被取消选择。

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
