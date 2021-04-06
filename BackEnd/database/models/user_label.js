'use strict'
module.exports = (sequelize, DataTypes) => {
  const User_Label = sequelize.define('User_Label', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.STRING,
    label_name: DataTypes.STRING
    
  }, {})
  User_Label.associate = function (models) {
    User_Label.hasOne(models.User_Label, {
      foreignKey: 'label_name',
      as:'label_name'
    }),
    User_Label.hasOne(models.User_Label, {
      foreignKey: 'user_id',
      as:'user_id'
    })
  }
  return User_Label
}