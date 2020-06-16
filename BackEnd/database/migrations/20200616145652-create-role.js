'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      upload: {
        type: Sequelize.BOOLEAN
      },
      content: {
        type: Sequelize.BOOLEAN
      },
      anon: {
        type: Sequelize.BOOLEAN
      },
      exportLocal: {
        type: Sequelize.BOOLEAN
      },
      exportExtern: {
        type: Sequelize.BOOLEAN
      },
      exportExtern: {
        type: Sequelize.BOOLEAN
      },
      query: {
        type: Sequelize.BOOLEAN
      },
      autoQuery: {
        type: Sequelize.BOOLEAN
      },
      delete: {
        type: Sequelize.BOOLEAN
      },
      admin: {
        type: Sequelize.BOOLEAN
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Roles');
  }
};