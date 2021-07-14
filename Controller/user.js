module.exports = {
	async index(ctx, next) {
		console.log(ctx.method);
		console.log('进入');
		ctx.body = "123444";
	}
}