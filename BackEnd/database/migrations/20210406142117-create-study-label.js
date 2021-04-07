'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Study_Label', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      study_uid: {
        allowNull: false,
        type: Sequelize.INTEGER
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
      return queryInterface.addConstraint('Study_Label', {
        fields: ['study_uid','label_name'],
        type: 'unique',
        name: 'unique_combined_studyUID&label'
      })
    }).then(() => {
      return queryInterface.addConstraint('Study_Label', {
        type: 'foreign key',
        fields: ['label_name'],
        onUpdate: 'CASCADE',
        references: {
          fields: ['label_name'],
          table: 'Labels',
        },
        name: 'SL_labels_name_fkey',
      })
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Study_Label');
  }
};