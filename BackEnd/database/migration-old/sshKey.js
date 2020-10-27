'use strict'

const { BelongsTo } = require("sequelize/types")

module.exports = (sequelize, DataTypes) => {
  const SshKey = sequelize.define('SshKey', {
    id:{
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    label: DataTypes.STRING,
    path: DataTypes.STRING
  }, {})
  SshKey.associate = function (models) {
      SshKey.BelongsTo(models.Server)
  }
  return Server
}