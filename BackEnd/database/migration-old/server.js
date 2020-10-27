'use strict'
module.exports = (sequelize, DataTypes) => {
  const Server = sequelize.define('Server', {
    id:{
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    label: DataTypes.STRING,
    host: DataTypes.STRING,
    identifients: DataTypes.STRING,
    protocol: DataTypes.STRING,
    targetFolder: DataTypes.STRING
  }, {})
  Server.associate = function (models) {
      Server.HasOne(models.certificate)
  }
  return Server
}
