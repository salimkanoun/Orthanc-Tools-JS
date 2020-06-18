'use strict';

const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return bcrypt.hash('sylvain', 10).then(function (hash) {
      queryInterface.bulkInsert('Users', [{
        username: 'sylvain',
        password: hash,
        first_name: 'Sylvain', 
        last_name: 'Berthier',
        admin: true,
        role: 'admin',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    })
  },

  down: (queryInterface, Sequelize) => {
    return (
      queryInterface.destroy({
        where: {
          username: 'sylvain'
        }
      })
    )
  }
};
