const Router = require("koa-router");
const router = new Router();
module.exports = (app) => {
	router.get('/', (ctx, next) => {
		ctx.body = "123";
	});
	router.get('/user', require('../Controller/user').index);
	router.get('/users', (ctx, next) => {
		ctx.body = 'users';
	})
	app.use(router.routes());
	app.use(router.allowedMethods());
}
