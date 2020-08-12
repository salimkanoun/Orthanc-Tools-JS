'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DistantUsers', {
      id: { //ID
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER
      },
      groupName: {
        allowNull: false,
        type: Sequelize.STRING, 
      }, 
      roleDistant: {
        allowNull: false, 
        unique: true,
        references: {
          model: 'Roles', 
          key: 'name'
        }, 
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
    return queryInterface.dropTable('DistantUsers');
  }
};
