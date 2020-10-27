'use strict';
module.exports = (sequelize, DataTypes) => {
  const Endpoint = sequelize.define('Endpoint', {
    label: DataTypes.STRING,
    host: DataTypes.STRING,
    protocol: DataTypes.STRING,
    port: DataTypes.INTEGER,
    identifiants: DataTypes.STRING,
    pass : DataTypes.BOOLEAN,
    targetFolder: DataTypes.STRING,
    digest: DataTypes.BOOLEAN,
    ssl:DataTypes.BOOLEAN,
    sshKey:DataTypes.UUID
  }, {});
  Endpoint.associate = function(models) {
    
  };
  return Endpoint;
};