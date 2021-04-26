'use strict'
module.exports = (sequelize, DataTypes) => {
  const StudyLabel = sequelize.define('StudyLabel', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    study_instance_uid: DataTypes.STRING,
    label_name: DataTypes.STRING,
  }, {})
  StudyLabel.associate = function (models) {
    StudyLabel.hasOne(models.StudyLabel, {
      foreignKey: 'label_name',
      onUpdate: 'CASCADE'
    })
  }
  return StudyLabel
}