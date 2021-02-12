'use strict';
module.exports = (sequelize, DataTypes) => {
  const SshKey = sequelize.define('SshKey', {
    label: DataTypes.STRING,
    path: DataTypes.STRING,
    pass: DataTypes.STRING
  }, {});
  SshKey.associate = function(models) {
    // associations can be defined here
  };
  return SshKey;
};