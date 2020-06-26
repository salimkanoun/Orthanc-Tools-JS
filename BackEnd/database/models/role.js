'use strict';

const Users = require("../../model/Users");

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    upload: DataTypes.BOOLEAN,
    content: DataTypes.BOOLEAN,
    anon: DataTypes.BOOLEAN,
    export_local: DataTypes.BOOLEAN,
    export_extern: DataTypes.BOOLEAN,
    query: DataTypes.BOOLEAN,
    auto_query: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
    name: {
      primaryKey: true,
      type: DataTypes.STRING},
    modify:DataTypes.BOOLEAN
  }, {});
  Role.associate = function(models) {
    Role.hasOne(models.User, {
      foreignKey: 'role',
      as:'role'
    })
  };
  return Role;
};