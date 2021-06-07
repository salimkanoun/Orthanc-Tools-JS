'use strict';

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    import: DataTypes.BOOLEAN,
    content: DataTypes.BOOLEAN,
    anon: DataTypes.BOOLEAN,
    export_local: DataTypes.BOOLEAN,
    export_extern: DataTypes.BOOLEAN,
    query: DataTypes.BOOLEAN,
    auto_query: DataTypes.BOOLEAN,
    delete: DataTypes.BOOLEAN,
    admin: DataTypes.BOOLEAN,
    cd_burner : DataTypes.BOOLEAN,
    autorouting : DataTypes.BOOLEAN,
    name: {
      primaryKey: true,
      type: DataTypes.STRING},
    modify:DataTypes.BOOLEAN
  }, {});
  Role.associate = function(models) {
    Role.hasOne(models.User, {
      foreignKey: 'role',
      as:'role'
    }),
    Role.hasOne(models.DistantUser, {
      foreignKey: 'local_role',
      as:'local_role'
    })
  };
  return Role;
};