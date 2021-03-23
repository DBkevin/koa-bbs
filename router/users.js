const db = require('../core/db');
const timeago = require('timeago.js');
module.exports = {
    async show(ctx, next) {
        let { user } = ctx.params;
        let queryUserSQL = `select * from users where id=${user}`;
        let queryUser = await db(queryUserSQL);
        if (queryUser) {
            queryUser[0].created_at = timeago.format(queryUser[0].created_at,'zh_CN');
            await ctx.render("layouts/index", {
                title: queryUser[0].name + '的个人中心',
                pagename: '../users/show',
                routerName: 'show',
                user: queryUser[0]
            });
        } else {
            ctx.body = "用户不存在！";
        }
    },
    async edit(ctx, next) {
        let { user } = ctx.params;
        let queryUserSQL = `select * from users where id=${user}`;
        let queryUser = await db(queryUserSQL);
        if (queryUser) {
            await ctx.render("layouts/index", {
                title: queryUser[0].name + '的个人中心',
                pagename: '../users/edit',
                routerName: 'edit',
                user: queryUser[0]
            });
        } else {
            ctx.body = "用户不存在！";
        }
    },
    async update(ctx, next) {
        let { user } = ctx.params;
        let { introduction } = ctx.request.body;
        if (introduction.length < 10) {
            console.log("进入");
            ctx.session.error = '个人简介不能少于20字';
            await ctx.redirect('back');
            return;
        }
        let queryUserSQL = `select * from users where id=${user}`;
        let queryUser = await db(queryUserSQL);
        if (queryUser) {
            //TODO 传递的参数校验
            let introductionSQL = `update users set introduction="${introduction}" where id=${queryUser[0].id}`;
            let upIntroduct = await db(introductionSQL);
            if (upIntroduct) {
                ctx.session.info = {
                    success: '修改个人资料成功',
                };
                ctx.redirect('/users/' + user);
            } else {
            }
        } else {
            ctx.body = "用户不存在!";
        }
    }

}