const Models = require("../Models/index");
const bcrypt = require("bcrypt");
const { Op } = require('sequelize');

class User {
	/**
	 * 列出所有用户,默认不显示密码
	 * @param {number}  page 默认分页
	 * @param {number}  pagesize
	 */
	static async getUsers(page = 1, pagesize = 10) {
		const Users = await Models.User.scope('noPass').findAndCountAll({
			limit: pagesize,
			offset: (page - 1) * page,
		});
		return Users;
	}
	/**
	 * 创建用户
	 *
	 * @param     {object}    params    要创建用户的信息的对象集合
	 * @static
	 * @memberof  Users
	 * @return    {(boolean|object)}             创建失败或存在用户返回false,否则返回一个包含用户名称的对象;
	 */
	static async create(
		params = {
			name: '',
			password: '',
			email: ''
		}
	) {
		const { name, password, email } = params;
		const hasUser = await Models.User.findOne({
			where: {
				[Op.or]: [
					{ name: name },
					{email:email}
				]
			}
		});
		if (hasUser) {
			return false;
		} else {
			const user = {};
			const salt = bcrypt.genSaltSync(10);
			user.name = name;
			user.email = email;
			user.password = bcrypt.hashSync(password, salt);
			const userInfo = await Models.User.create(user);
			return {
				id: userInfo.id,
			}
		}
	}
	/**
	 * 验证用户信息
	 *
	 * @param     {[type]}    name             用户名
	 * @param     {[type]}    plainPassword    密码
	 *
	 * @return    {[type]}                     [return description]
	 */
	static async verify(name, plainPassword) {
		//查询用户是否存在
		const user = await Models.User.findOne({
			where: {
				name: name
			}
		});
		if (!user) {
			return false;
		} else {
			let currPass = user.password;
			//验证密码是否正确
			const correct = bcrypt.compareSync(plainPassword, currPass);
			if (!correct) {
				return false;
			} else {
				return user;
			}
		}
	}
	/**
	 * 查询用户信息
	 * @param {[number]} id  用户id
	 */
	static async details(id) {
		const user = await Models.User.scope('noPass').findOne({
			where: {
				id
			}
		});
		if (!user) {
			return false;
		} else {
			return user;
		}
	}
	/**
	 * 查找名称是否唯一
	 *
	 * @param     {[string]}    name    要查找的名字
	 *
	 * @return    {boolean}            [return description]
	 */
	static async isUniqueName(name) {
		const isUni = await Models.User.findOne({
			where: {
				name: name
			}
		})
		return isUni;
	}
	/**
	 * 查找email是否唯一
	 *
	 * @param     {string}   name    要查询的email
	 * @memberof UsersServer
	 * @return    {boolean}          存在返回true,否则返回false
	 */
	static async isUniqueEmail(email) {
		const isEmail = await Models.User.findOne({
			where: {
				email: email
			}
		});
		return isEmail;
	}
	/**
	 * 更新密码
	 *
	 * @param     {string}    password    新密码
	 * @param     {int}    id          要修改的用户ID
	 *
	 * @return    {(object|false)}         修改成功返回user对象,否则false       
	 */
	static async updatePassword(password, id) {
		const salt = bcrypt.genSaltSync(10);
		let user = await Models.User.update({ password: bcrypt.hashSync(password, salt)}, {
			where: {
				id: id
			}
		});
		return user;
	}
}
module.exports = {
	User
}