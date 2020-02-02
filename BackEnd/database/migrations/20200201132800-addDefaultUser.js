'use strict'
const bcrypt = require('bcrypt')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return bcrypt.hash('salim', 10).then(function (hash) {
      queryInterface.bulkInsert('Users', [{
        username: 'salim',
        password: hash,
        admin: false,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    })
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: (queryInterface, Sequelize) => {
    return (
      queryInterface.bulkDelete('Users', [{
        username: 'salim',
        password: 'salim',
        admin: false,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    )
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
}
