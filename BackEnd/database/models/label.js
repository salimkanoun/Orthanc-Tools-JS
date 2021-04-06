'use strict';

module.exports = (sequelize, DataTypes) => {

  const Label = sequelize.define('Label', {
    label_name: {
      primaryKey: true,
      type: DataTypes.STRING},
  }, {});

  /* CLE Etrangère
  Label.associate = function(models) {
    Label.hasOne(models.User, {
      foreignKey: 'role',
      as:'role'
    }),
    Label.hasOne(models.DistantUser, {
      foreignKey: 'local_role',
      as:'local_role'
    })
  };*/

  return Label;
};