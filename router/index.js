const router = require('koa-router')();
const capacha = require('../middleware/captcha');
module.exports = (app) => {
    router.get('/', async (ctx, next) => {
        await ctx.render('layouts/index',
            {
                title: '首页,title',
                pagename: '../index'
            })
    });
    router.get('/captcha', async (ctx, next) => {
        let code = capacha();
        ctx.set("Content-Type", "image/svg+xml");
        ctx.body = code.data;
    });

    router.get('/register', require('./auth').register);
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