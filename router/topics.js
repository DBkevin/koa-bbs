const db = require('../core/db');
const timeago = require('timeago.js');
const pagination = require('../middleware/pagination');
exports = module.exports = {
    async index(ctx, next) {
        $topicsViewConfig = {
            title: '话题列表',
            pagename: '../topics/index',
            routerName: 'topics-index',
        }
          //排序参数
        let order = ctx.query.order ? ctx.query.order : 'default';
        let by = order == 'default' ? 'DESC' : 'ASC';
        console.log(by);
        //分页 参数
        let page = ctx.query.page ? ctx.query.page : 1;
        let limit = 10;
        let offset = (page - 1) * 10;
        //获取总数
        let Count = await db(`select count(id)AS count from topics`);
        //计算累计多少页
        let pageCount = Math.ceil(Count[0].count / limit);
        let listSQL = `SELECT u.name AS U_name,u.avatar as U_avatar,u.id AS U_id,c.name AS C_name,c.id AS C_id,t.id AS T_id,t.title AS T_title,t.body AS T_body,t.updated_at,t.reply_count FROM topics t,users u,categories c WHERE t.user_id=u.id AND t.category_id=c.id  ORDER BY t.id ${by}  limit 10 offset ${offset}`;
        let topics = await db(listSQL);
        topics.forEach(item=> {
            item.updated_at = timeago.format(item.updated_at, 'zh_CN');
        });
        $topicsViewConfig.topics = topics;
        $topicsViewConfig.pagination = pagination(pageCount,'topics',page);
        await ctx.render('layouts/index', $topicsViewConfig);
    },
    async categoriesShow(ctx, next) {
        let id = ctx.params.id;
        //排序参数
        let order = ctx.query.order ? ctx.query.order : 'default';
        let by = order == 'default' ? 'DESC' : 'ASC';
         //分页 参数
        let page = ctx.query.page ? ctx.query.page : 1;
        let limit = 10;
        let offset = (page - 1) * 10;
        //获取总数
        let Count = await db(`select count(id) AS count from topics where category_id=${id}`);
        //计算累计多少页
        let pageCount = Math.ceil(Count[0].count / limit);
        let categriesSQL = `select * from categories where id=${id}`;
        let categories = await db(categriesSQL);
        let listSQL = ` SELECT u.name AS U_name,u.avatar as U_avatar,u.id AS U_id,t.id AS T_id,t.title AS T_title,t.body AS T_body,t.updated_at,t.reply_count FROM topics t,users u WHERE t.user_id=u.id AND t.category_id IN (${categories[0].id})  ORDER BY t.id ${by}  limit ${limit} offset ${offset} `;
        let topics = await db(listSQL);
        topics.forEach(item => {
            item.updated_at = timeago.format(item.updated_at, 'zh_CN');
            item.C_id = categories[0].id;
            item.C_name = categories[0].name;
        });
        $topicsViewConfig = {
            title: `${categories[0].name}-话题列表`,
            pagename: '../topics/index',
            routerName: 'categories-show',
        }
        $topicsViewConfig.topics = topics;
        $topicsViewConfig.pagination = pagination(pageCount, `categories/${id}`, page);
        await ctx.render('layouts/index', $topicsViewConfig);
    }
   
}