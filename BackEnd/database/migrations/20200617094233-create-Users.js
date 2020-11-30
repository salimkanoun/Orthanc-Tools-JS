
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique:true
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      admin: {
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
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      mail: {
        type: Sequelize.STRING
      },
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
        admin: true,
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
