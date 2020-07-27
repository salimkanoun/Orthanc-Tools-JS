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
      associedcedRole: {
        allowNull: false,
        type: Sequelize.STRING, 
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('DistantUser');
  }
};
