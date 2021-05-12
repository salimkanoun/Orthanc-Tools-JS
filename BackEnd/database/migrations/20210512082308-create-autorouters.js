'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Autorouters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      rules: {
        type: Sequelize.JSON
      },
      target: {
        type: Sequelize.STRING
      },
      running: {
        type: Sequelize.BOOLEAN
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
      return queryInterface.addConstraint('Autorouters', {
        fields: ['name'],
        type: 'unique',
        name: 'unique_autorouter_name'
      })
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Autorouters');
  }
};