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

-- 导出  表 koa-bbs.topics 结构
CREATE TABLE IF NOT EXISTS `topics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` char(50) COLLATE utf8mb4_bin NOT NULL COMMENT '帖子标题',
  `body` text COLLATE utf8mb4_bin NOT NULL COMMENT '	帖子内容',
  `user_id` int(11) unsigned DEFAULT NULL COMMENT '用户 ID',
  `crtegory_id` int(11) unsigned DEFAULT NULL COMMENT '分类 ID',
  `reply_count` int(11) unsigned DEFAULT NULL COMMENT '回复数量',
  `view_count` int(11) unsigned DEFAULT NULL COMMENT '查看总数',
  `last_reply_user_id` int(11) unsigned DEFAULT NULL COMMENT '最后回复的用户 ID',
  `order` int(11) unsigned DEFAULT '0' COMMENT '可用来做排序使用',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `title` (`title`),
  KEY `user_id` (`user_id`),
  KEY `crtegory_id` (`crtegory_id`),
  KEY `reply_count` (`reply_count`),
  KEY `view_count` (`view_count`),
  KEY `last_replay_user_id` (`last_reply_user_id`),
  CONSTRAINT `crtegory_id` FOREIGN KEY (`crtegory_id`) REFERENCES `creategories` (`id`),
  CONSTRAINT `lats_reply_user_id` FOREIGN KEY (`last_reply_user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='帖子的详情表\r\n';

-- 正在导出表  koa-bbs.topics 的数据：~0 rows (大约)
DELETE FROM `topics`;
/*!40000 ALTER TABLE `topics` DISABLE KEYS */;
/*!40000 ALTER TABLE `topics` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
