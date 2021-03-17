const router = require('koa-router')();
const captchaCode = require('../middleware/captcha');
module.exports = (app) => {
    router.get('/', async (ctx, next) => {
        await ctx.render('layouts/index',
            {
                title: '首页,title',
                pagename: '../index',
                routerName:'root'
            })
    });
    router.get('/captcha', async (ctx, next) => {
        let code = captchaCode();
        let expiration = Date.now() + 300000;
        ctx.session.captcha = {
            text: code.text.toLocaleLowerCase(),
            expiration: expiration,
        };
        ctx.set("Content-Type", "image/svg+xml");
        ctx.body = code.data;
    });

    router.get('/register', require('./auth').register);
    router.post('/register', require('./auth').register);
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