const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
	}
	User.init({
		name: DataTypes.CHAR,
		email: DataTypes.CHAR,
		password: DataTypes.CHAR,
	}, {
		sequelize,
		modelName: 'User'
	})
	return User;
}