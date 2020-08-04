'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LdapOptions', {
      id: { //ID
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      TypeGroupe: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      adresse: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      port: {
        defaultValue: 389,
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
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LdapOptions');
  }
};
