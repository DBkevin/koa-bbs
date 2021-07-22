const { User } = require('../Service/user');
module.exports = {
	async index(ctx, next) {
		let Users = await User.getUsers();
		ctx.body = JSON.stringify(Users);
	},
	async show(ctx, next) {
		let id = ctx.params.id;
		let user = await User.details(id);
		ctx.body = JSON.stringify(user);
	},
	async create(ctx, next) {
	
		const { name, password, email } = ctx.request.body;
		let user = await User.create({ name, password, email });
		if (!user) {
			ctx.status = 422;
			ctx.body = { "message": "该用户已经注册" };
		} else {
			ctx.body = JSON.stringify(user);
		}
	},
	async edit(ctx, next) {
		const id = ctx.params.id;
		const { password } = ctx.request.body;
		let user = await User.updatePassword(password, id);
		if (user) {
			ctx.body = { "message": "密码更新成功" };
		} else {
			ctx.status = 422;
			ctx.body = {
				"message":"密码未更新"
			}
		}

	}
}