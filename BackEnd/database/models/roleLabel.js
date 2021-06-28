'use strict'
module.exports = (sequelize, DataTypes) => {
  const RoleLabel = sequelize.define('RoleLabel', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role_name: DataTypes.STRING,
    label_name: DataTypes.STRING
    
  }, {})
  RoleLabel.associate = function (models) {
    RoleLabel.hasOne(models.RoleLabel, {
      foreignKey: 'label_name',
      onUpdate: 'CASCADE'
    }),
    RoleLabel.hasOne(models.RoleLabel, {
      foreignKey: 'role_name'
    })
  }
  return RoleLabel
}