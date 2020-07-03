'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return (queryInterface.addConstraint('Users', ['username'], {
      type: 'unique',
      name: 'unique_username'
    }))
  },

  down: (queryInterface, Sequelize) => {
    return (queryInterface.removeConstraint('Users', 'unique_username'))
  }
}
