'use strict'
module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
    id:{
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    label: DataTypes.STRING,
    path: DataTypes.STRING
  }, {})
  Server.associate = function (models) {
      
  }
  return Server
}