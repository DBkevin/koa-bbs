const db = require('../core/db');
const timeago = require('timeago.js');
exports = module.exports = {
    async index(ctx, next) {
        $topicsViewConfig = {
            title: '帖子列表',
            pagename: '../topics/index',
            routerName: 'topics-index',
        }
        let listSQL = `SELECT u.name AS U_name,u.avatar as U_avatar,u.id AS U_id,c.name AS C_name,c.id AS C_id,t.id AS T_id,t.title AS T_title,t.body AS T_body,t.updated_at,t.reply_count FROM topics t,users u,creategories c WHERE t.user_id=u.id AND t.crtegory_id=c.id limit 10`;
        let topics = await db(listSQL);
        topics.forEach(item=> {
            item.updated_at = timeago.format(item.updated_at, 'zh_CN');
        });
        $topicsViewConfig.topics = topics;
        await ctx.render('layouts/index', $topicsViewConfig);
    },
}