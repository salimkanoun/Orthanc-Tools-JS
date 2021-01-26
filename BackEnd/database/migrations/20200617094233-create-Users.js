
const bcrypt = require('bcryptjs')

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
        references: {
          model: 'Roles', 
          key: 'name'
        }, 
        type: Sequelize.STRING
      }
    }).then(() => {
      return queryInterface.addConstraint('Users', ['username'], {
        type: 'unique',
        name: 'unique_username'
      })
    }).then( () => { return bcrypt.hash('admin', 10) 
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
