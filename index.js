const Koa = require('koa');
const App = new Koa();
const router = require('./Router/index');
const koaBody = require('koa-body');
App.use(koaBody());

App.use(async (ctx, next) => {
	ctx.response.type = 'application/json; charset=utf-8';
	await next();
});

router(App);
App.listen(3000, () => {
	console.log('启动chenggong');
});