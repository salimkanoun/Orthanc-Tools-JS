'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Roles', 'idUser', {
      references: {
        model: 'user', 
        key: 'id'
      }, 
      type: Sequelize.INTEGER
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('idUser')
  }
};
