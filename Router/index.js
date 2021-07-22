const Router = require("koa-router");
const router = new Router();
module.exports = (app) => {
	router.get('/', (ctx, next) => {
		ctx.body = "1234";
	});
	router.get('/user', require('../Controller/user').index);
	router.get('/user/:id', require('../Controller/user').show);
	router.post('/user', require('../Controller/user').create);
	router.put('/user/:id', require('../Controller/user').edit);
	router.post('/login', require('../Controller/auth').login);
	app.use(router.routes());
	app.use(router.allowedMethods());
}
