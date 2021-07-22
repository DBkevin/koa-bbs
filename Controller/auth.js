const { User } = require('../Service/user');
const JWT = require("jsonwebtoken");
const config = require('../config/config.json');
module.exports = {
	async login(ctx, next) {
		const { name, password } = ctx.request.body;
		let user = await User.verify(name, password);
		if (user) {
			//登陆成功
			const token = JWT.sign(
				{
					name: user.name,
					reTime: new Date(),
				},
				config.JWT.privateKey,
				{ expiresIn: config.JWT.expiresIn}
			);
			let res = {};
			res.token = token;
			res.user = {
				name: user.name,
				id: user.id,
			}
			ctx.body = res;
		} else {
			console.log('帐号密码错误');
		}
	}
}