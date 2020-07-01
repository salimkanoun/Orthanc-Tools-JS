'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      name: { //ID
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      import: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      content: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      anon: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      export_local: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      export_extern: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      query: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      auto_query: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      delete: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      admin: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      modify: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
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