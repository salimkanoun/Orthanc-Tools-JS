'use strict'
module.exports = (sequelize, DataTypes) => {
  const LdapOptions = sequelize.define('LdapOptions', {
    id:{
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    TypeGroupe:DataTypes.STRING,
    protocole:DataTypes.STRING,
    adresse:DataTypes.STRING,
    port:DataTypes.INTEGER,
    DN:DataTypes.STRING,
    mdp:DataTypes.STRING
  }, {})
  LdapOptions.associate = function (models) {
    // associations can be defined here
  }
  return LdapOptions
}
