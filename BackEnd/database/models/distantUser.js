'use strict'
module.exports = (sequelize, DataTypes) => {
  const DistantUser = sequelize.define('DistantUser', {
    groupName: DataTypes.STRING,
    type: DataTypes.STRING
  }, {})
  DistantUser.associate = function (models) {
    // associations can be defined here
  }
  return DistantUser
}
