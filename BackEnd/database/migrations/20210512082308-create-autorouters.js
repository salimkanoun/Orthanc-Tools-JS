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
        type: Sequelize.STRING,
        allowNull: false,
      },
      condition: {
        type:Sequelize.STRING,
        allowNull:false,
      },
      rules: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        allowNull: false,
      },
      target: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:'StableStudy'
      },
      running: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:false
      },
      destination: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull:false,
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