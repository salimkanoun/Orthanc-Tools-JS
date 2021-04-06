'use strict'
module.exports = (sequelize, DataTypes) => {
  const Study_Label = sequelize.define('Study_Label', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    study_uid: DataTypes.STRING,
    label_name: DataTypes.STRING
    
  }, {})
  Study_Label.associate = function (models) {
    Study_Label.hasOne(models.Study_Label, {
      foreignKey: 'label_name',
      as:'label_name'
    })
  }
  return Study_Label
}