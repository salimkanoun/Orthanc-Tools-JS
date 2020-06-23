'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    mail:DataTypes.STRING,

  }, {})
  User.associate = function (models) {
    User.hasOne(models.Role, {
      foreignKey: 'name',
      as: 'role'
    })
  }
  return User
}
