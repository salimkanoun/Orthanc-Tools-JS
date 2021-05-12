'use strict'
module.exports = (sequelize, DataTypes) => {
  const Autorouter = sequelize.define('Autorouter', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    rules: DataTypes.JSON,
    target: DataTypes.STRING,
    running: DataTypes.BOOLEAN
    
  }, {})
  Autorouter.associate = function (models) {

  }
  return Autorouter
}