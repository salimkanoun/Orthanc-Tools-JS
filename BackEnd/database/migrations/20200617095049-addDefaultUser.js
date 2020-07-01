'use strict'
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return bcrypt.hash('admin', 10).then(function (hash) {
      queryInterface.bulkInsert('Users', [{
        username: 'admin',
        password: hash,
        admin: true,
        role: 'admin',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    })
  },

  down: (queryInterface, Sequelize) => {
    return (
      queryInterface.bulkDelete('Users', [{
        username: 'admin',
        password: 'admin',
        admin: false,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    )
  }
}
