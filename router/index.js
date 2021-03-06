const router = require('koa-router')();
const captchaCode = require('../middleware/captcha');
const upload = require('../core/upload');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const adminRouter =require('koa-router')();
adminRouter.prefix('/admin');
module.exports = (app) => {
    adminRouter.get('/',admin(),require('./admin/admin').index);
    adminRouter.post('/categories', admin(), require('./admin/topics').createCategory);
    adminRouter.post('/categories/:id', admin(), require('./admin/topics').edit);
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
    router.get('/login', require('./auth').login);
    router.post('/login', require('./auth').login);
    router.get('/logout', require('./auth').logout);
    router.get('/password/reset', require('./auth').email);
    router.post('/password/reset/email', require('./auth').email);
    router.get('/password/reset/:member_token', require('./auth').reset);
    router.post('/password/reset', require('./auth').reset);
    router.get('/users/:user', require('./users').show);
    router.get('/users/:user/edit', auth(), require('./users').edit);
    router.post('/users/:user', upload.single('avatar'), auth(), require('./users').update);
    //topics
    router.get('/topics', require("./topics").index);
    router.get('/topics/create',auth(), require('./topics').create);
    router.post('/topics/create',auth(), require('./topics').create);
    router.get('/categories/:id', require('./topics').categoriesShow);
    router.get('/topics/:id', require("./topics").show);
    router.get('/topics/:id/edit', auth(),require("./topics").edit);
    router.post('/topics/:id/update', auth(), require("./topics").update);
    router.post('/topics/:id/destory', auth(), require('./topics').destory);
    router.post('/repiles/store', auth(), require('./reply').store);
    router.post('/repiles/:id/destroy', auth(), require('./reply').destroy);
  

    //上传图片
    router.post('/topics/uploadImage', upload.single('upload_file'), auth(), require('./topics').uploadImages);

    router.get("/about", async (ctx, next) => {
        ctx.session.info = {
            success: '从about跳转',
        };
        ctx.redirect("/");
    });
    router.get("/help", async (ctx, next) => {
        ctx.body="帮助";
    });
    //吧路由注入到app里面
    app.use(router.routes());
    //吧所有方法都注入到app里面
    app.use(router.allowedMethods());
    app.use(adminRouter.routes());
    app.use(adminRouter.allowedMethods());
}