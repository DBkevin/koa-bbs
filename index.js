const Koa = require('koa');
const App = new Koa();
const router = require('./Router/index');
router(App);
App.listen(3000, () => {
	console.log('启动chenggong');
});