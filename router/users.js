const db = require('../core/db');
const timeago = require('timeago.js');
const imageSize = require('image-size');
const fs = require('fs');
const authorize = require('../middleware/authorize');
module.exports = {
    async show(ctx, next) {
        let { user } = ctx.params;
        let queryUserSQL = `select * from users where id=${user}`;
        let queryUser = await db(queryUserSQL);
        if (queryUser) {
            queryUser[0].created_at = timeago.format(queryUser[0].created_at, 'zh_CN');
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
    async edit(ctx, next, newUser) {

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
        let avatar = null;
        if (ctx.req.file) {
            let dimension = imageSize(ctx.req.file.path);
            if (dimension.width < 208 || dimension.height < 208) {
                fs.unlinkSync(ctx.req.file.path);
                ctx.session.error = "图片分辨率过低，不能小于208*208";
                await ctx.redirect('back');
                return;
            }
            let avatarList = ctx.req.file.destination.split('\\');
            avatar = avatarList[avatarList.length - 1] + '/' + ctx.req.file.filename;
        }
        let { user } = ctx.params;
        if (!authorize(ctx, user)) {
            await ctx.redirect('/');
            return;
        } 
        let { introduction } = ctx.req.body;
        if (introduction.length < 10) {
            console.log("进入");
            ctx.session.error = '个人简介不能少于20字';
            await ctx.redirect('back');
            return;
        }
        avatar ? '' : '无';
        let queryUserSQL = `select * from users where id=${user}`;
        let queryUser = await db(queryUserSQL);
        if (queryUser) {
            //TODO 传递的参数校验
            let introductionSQL = `update users set introduction="${introduction}",avatar="${avatar}" where id=${queryUser[0].id}`;
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