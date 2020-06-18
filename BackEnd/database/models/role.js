'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    upload: DataTypes.BOOLEAN,
    content: DataTypes.BOOLEAN,
    anon: DataTypes.BOOLEAN,
    exportLocal: DataTypes.BOOLEAN,
    exportExtern: DataTypes.BOOLEAN,
    exportExtern: DataTypes.BOOLEAN,
    query: DataTypes.BOOLEAN,
    autoQuery: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
    name: DataTypes.STRING
  }, {});
  Role.associate = function(models) {
    // associations can be defined here
  };
  return Role;
};