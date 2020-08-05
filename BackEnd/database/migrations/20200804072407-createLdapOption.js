'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LdapOptions', {
      id: { //ID
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TypeGroupe: {
        defaultValue: 'Active Directory',
        type: Sequelize.STRING, 
      },
      protocole: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      adresse: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      port: {
        defaultValue: 450,
        type: Sequelize.INTEGER, 
      },
      DN: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      mdp: {
        defaultValue: '',
        type: Sequelize.STRING, 
      }
    }).then(() => {
      queryInterface.bulkInsert('LdapOptions', [{
        id:1,
        TypeGroupe:'Active Directory',
        protocole:'',
        adresse:'',
        port:450,
        DN:'',
        mdp:''
      }], {})
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LdapOptions');
  }
};
