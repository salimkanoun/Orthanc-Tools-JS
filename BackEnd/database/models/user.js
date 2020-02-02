'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN
  }, {})
  User.associate = function (models) {
    // associations can be defined here
  }
  return User
}
