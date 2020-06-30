'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn ('Users', 'role') 
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'role', { 
      references: {
        model: 'Roles', 
        key: 'name'
      }, 
      type: Sequelize.STRING
    })
  }
};