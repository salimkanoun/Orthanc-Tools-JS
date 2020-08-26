'use strict'
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    hour: DataTypes.INTEGER,
    min: DataTypes.INTEGER,
    ldap: DataTypes.BOOLEAN,
    dateFormat:DataTypes.STRING,
    CDBurnerLabelFile:DataTypes.STRING,
    CDBurnerMonitoringLevel:DataTypes.STRING,
    CDBurnerBurnerManifacturer:DataTypes.STRING,
    CDBurnerMonitoredFolder:DataTypes.STRING,
    CDBurnerDeleteStudyAfterSent:DataTypes.BOOLEAN,
    CDBurnerViewerPath:DataTypes.STRING,

  }, {})
  Option.associate = function (models) {
    // associations can be defined here
  }
  return Option
}
