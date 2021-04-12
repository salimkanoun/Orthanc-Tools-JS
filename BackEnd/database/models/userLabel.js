'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserLabel = sequelize.define('UserLabel', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.STRING,
    label_name: DataTypes.STRING
    
  }, {})
  UserLabel.associate = function (models) {
    UserLabel.hasOne(models.UserLabel, {
      foreignKey: 'label_name',
      onUpdate: 'CASCADE'
    }),
    UserLabel.hasOne(models.UserLabel, {
      foreignKey: 'user_id'
    })
  }
  return UserLabel
}