'use strict';

const Labels = require("../../model/Labels");

module.exports = (sequelize, DataTypes) => {

  const Label = sequelize.define('Label', {
    label_name: {
      primaryKey: true,
      type: DataTypes.STRING},
  }, {});
  
  return Label;
};