'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hour: {
        type: Sequelize.INTEGER
      },
      min: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      queryInterface.bulkInsert('Options', [{
        hour: 22,
        min: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Options')
  }
}
