'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'role', { 
      references: {
        model: 'Roles', 
        key: 'name'
      }, 
      type: Sequelize.STRING

    }).then(queryInterface.addConstraint('Users', ['role'], {
      type: 'unique',
      allowNull: false,
      defaultValue:'user',
      name: 'notNull&UniqConstraint'

    })).then(queryInterface.bulkDelete('Users', [{
     id:'1'
    }], {})

  ) && bcrypt.hash('salim', 10).then(function (hash) {
    queryInterface.bulkInsert('Users', [{
      username: 'salim',
      password: hash,
      admin: true,
      role: 'admin',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }], {})
  })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'role', { 
      references: {
        model: 'Roles', 
        key: 'name'
      }, 
      type: Sequelize.STRING

    }).then(queryInterface.addConstraint('Users', ['role'], {
      type: 'unique',
      allowNull: false,
      defaultValue:'user',
      name: 'notNull&UniqConstraint'

    })).then(queryInterface.bulkDelete('Users', [{
     id:'1'
    }], {})

  ) && bcrypt.hash('salim', 10).then(function (hash) {
    queryInterface.bulkInsert('Users', [{
      username: 'salim',
      password: hash,
      admin: true,
      role: 'admin',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }], {})
  })
  }
};
