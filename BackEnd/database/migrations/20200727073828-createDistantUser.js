'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DistantUser', {
      id: { //ID
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      groupName: {
        allowNull: false,
        type: Sequelize.STRING, 
      }, 
      role: {
        allowNull: false, 
        references: {
          model: 'Roles', 
          key: 'name'
        }, 
        type: Sequelize.STRING
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DistantUser');
  }
};
