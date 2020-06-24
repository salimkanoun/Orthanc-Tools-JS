'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('Roles', 'modify',
      {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Roles', 'modify');
  }
};

