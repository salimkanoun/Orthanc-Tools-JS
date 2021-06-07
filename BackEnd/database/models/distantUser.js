'use strict'
module.exports = (sequelize, DataTypes) => {
  const DistantUser = sequelize.define('DistantUser', {
    ldap_group: DataTypes.STRING,
    local_role: DataTypes.STRING
  }, {})
  DistantUser.associate = function (models) {
    // associations can be defined here
  }
  return DistantUser
}
