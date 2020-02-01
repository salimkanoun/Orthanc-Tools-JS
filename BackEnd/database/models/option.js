'use strict';
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    hour: DataTypes.INTEGER,
    min: DataTypes.INTEGER
  }, {});
  Option.associate = function(models) {
    // associations can be defined here
  };
  return Option;
};