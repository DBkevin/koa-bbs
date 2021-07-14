const Koa = require('koa');
const App = new Koa();
App.use(async ctx => {
	ctx.body = "Hello,world";
});
App.listen(3000, () => {
	console.log('启动chenggong');
});