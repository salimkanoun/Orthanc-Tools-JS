'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    super_admin: DataTypes.BOOLEAN,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email:DataTypes.STRING,
    
  }, {})
  User.associate = function (models) {
 
  }
  return User
}
