'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoleLabels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      label_name: {
        allowNull: false,
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
    }).then(() => {
      return queryInterface.addConstraint('RoleLabels',  {
        fields: ['role_name','label_name'],
        type: 'unique',
        name: 'unique_combined_role&label'
      })
    }).then(() => {
      return queryInterface.addConstraint('RoleLabels', {
        type: 'foreign key',
        fields: ['role_name'],
        references: {
          fields: ['name'],
          table: 'Roles',
        },
        name: 'RL_role_name_fkey',
      })
    }).then(() => {
      return queryInterface.addConstraint('RoleLabels', {
        type: 'foreign key',
        fields: ['label_name'],
        onUpdate: 'CASCADE',
        references: {
          fields: ['label_name'],
          table: 'Labels',
        },
        name: 'RL_labels_name_fkey',
      })
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RoleLabels');
  }
};