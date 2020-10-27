'use strict';
module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define('Certificate', {
    label: DataTypes.STRING,
    path: DataTypes.STRING
  }, {});
  Certificate.associate = function(models) {
    // associations can be defined here
  };
  return Certificate;
};