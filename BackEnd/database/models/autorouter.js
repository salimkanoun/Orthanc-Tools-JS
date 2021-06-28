'use strict'
module.exports = (sequelize, DataTypes) => {
  const Autorouter = sequelize.define('Autorouter', {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    condition:DataTypes.STRING,
    rules: DataTypes.ARRAY(DataTypes.JSONB),
    target: DataTypes.STRING,
    running: DataTypes.BOOLEAN,
    destination: DataTypes.ARRAY(DataTypes.STRING)
    
  }, {})
  Autorouter.associate = function (models) {

  }
  return Autorouter
}