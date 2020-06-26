'use strict'
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    hour: DataTypes.INTEGER,
    min: DataTypes.INTEGER,
    ldap: DataTypes.BOOLEAN,
    localUser: DataTypes.BOOLEAN
  }, {})
  Option.associate = function (models) {
    // associations can be defined here
  }
  return Option
}
