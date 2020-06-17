'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return (queryInterface.addConstraint('Users', ['username'], {
      type: 'unique',
      name: 'unique_username'
    }))
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return (queryInterface.removeConstraint('Users', 'unique_username'))
  }
}
