const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
	}
	User.init({
		name: DataTypes.CHAR,
		email: DataTypes.CHAR,
		password: DataTypes.CHAR,
	}, {
		scopes: {
			noPass: {
				attributes: {
					exclude: ['password']
				}
			}
		},
		sequelize,
		modelName: 'User'
	});
	return User;
}