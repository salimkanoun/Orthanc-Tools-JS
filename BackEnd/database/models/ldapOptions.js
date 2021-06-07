'use strict'
module.exports = (sequelize, DataTypes) => {
  const LdapOptions = sequelize.define('LdapOptions', {
    id:{
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    TypeGroup:DataTypes.STRING,
    protocol:DataTypes.STRING,
    address:DataTypes.STRING,
    port:DataTypes.INTEGER,
    DN:DataTypes.STRING,
    password:DataTypes.STRING,
    user:DataTypes.STRING,
    group:DataTypes.STRING,
    base:DataTypes.STRING
  }, {})
  LdapOptions.associate = function (models) {
    // associations can be defined here
  }
  return LdapOptions
}
