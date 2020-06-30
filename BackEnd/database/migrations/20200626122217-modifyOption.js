'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Options', 'ldap',
      {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      }) && queryInterface.addColumn('Options', 'localUser',
      {
        type: Sequelize.BOOLEAN, 
        defaultValue: true
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Options', 'ldap') && queryInterface.removeColumn('Options', 'localUser') ;
  }
};
