const koa = require('koa');
const app = new koa();
const bodyparser = require('koa-bodyparser');
const session = require('koa-session');
const path = require('path');
const Router = require('./router/index');
const static = require('koa-static');
const views = require('koa-views');
//设置session的key
app.use(session({
    key: 'koa-bbs',
    maxAge: 86400000,
},app));
//注入post数据
app.use(bodyparser());
//设置静态目录
app.use(static(path.join(__dirname), './public'));
//设置模板目录并指定模板引擎
app.use(views(path.join(__dirname), './views'), {
    extends: 'ejs'
});
//设置路由
Router(app);

app.listen(3000, () => {
    console.log('开启OK');
});