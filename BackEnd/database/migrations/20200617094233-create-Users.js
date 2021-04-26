const crypto = require('../../adapter/cryptoAdapter')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      super_admin: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }, 
      role: {
        allowNull: false,
        type: Sequelize.STRING
      }
    }).then(() => {
      return queryInterface.addConstraint('Users', {
        fields: ['username'],
        type: 'unique',
        name: 'unique_username'
      })
    }).then(() => {
      return queryInterface.addConstraint('Users', {
        type: 'foreign key',
        fields: ['role'],
        references: {
          fields: ['name'],
          table: 'Roles',
        },
        name: 'roles_name_fkey',
      })
    }).then( () => { return crypto.hash('admin',16) 
    }).then((hash) => {
      queryInterface.bulkInsert('Users', [{
        username: 'admin',
        password: hash,
        super_admin: true,
        role: 'admin',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})

    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
