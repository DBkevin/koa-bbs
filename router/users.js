const db = require('../core/db');
module.exports = {
    async show(ctx, next) {
        let { user } = ctx.params;
        let queryUserSQL = `select * from users where id=${user}`;
        let queryUser = await db(queryUserSQL);
        if (queryUser) {
            await ctx.render("layouts/index", {
                title: queryUser[0].name + '的个人中心',
                pagename: '../users/show',
                routerName: 'show',
                user:queryUser[0]
            });
        } else {
            ctx.body = "用户不存在！";
        }
    },
    async edit(ctx, next) {

    },
    async update(ctx, next) {

    }

}