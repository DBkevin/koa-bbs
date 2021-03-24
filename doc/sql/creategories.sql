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

-- 导出  表 koa-bbs.creategories 结构
CREATE TABLE IF NOT EXISTS `creategories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8mb4_bin NOT NULL DEFAULT '',
  `description` text COLLATE utf8mb4_bin NOT NULL,
  `post_count` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin COMMENT='帖子分类';

-- 正在导出表  koa-bbs.creategories 的数据：~0 rows (大约)
DELETE FROM `creategories`;
/*!40000 ALTER TABLE `creategories` DISABLE KEYS */;
INSERT INTO `creategories` (`id`, `name`, `description`, `post_count`) VALUES
	(1, '分享', '分享创造，分享发现', 0),
	(2, '教程', '开发技巧、推荐扩展包等', 0),
	(3, '问答', '请保持友善，互帮互助', 0),
	(4, '公告', '站点公告', 0);
/*!40000 ALTER TABLE `creategories` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
