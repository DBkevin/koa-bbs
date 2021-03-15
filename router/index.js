const router = require('koa-router')();
module.exports = (app) => {
    router.get('/', async (ctx, next) => {
        await ctx.render('layouts/index',
            {
                title: '首页',
                pagename: '../index'
            })
    });
    router.get("/about", async (ctx, next) => {
        ctx.body = "关于";
    });
    router.get("/help", async (ctx, next) => {
        ctx.body="帮助";
    });
    //吧路由注入到app里面
    app.use(router.routes());
    //吧所有方法都注入到app里面
    app.use(router.allowedMethods());
}