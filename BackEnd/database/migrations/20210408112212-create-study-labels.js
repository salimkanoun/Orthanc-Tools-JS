'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StudyLabels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      study_instance_uid: {
        allowNull: false,
        type: Sequelize.STRING
      },
      label_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      patient_id:{
        allowNull: false,
        type: Sequelize.STRING
      },
      study_orthanc_id:{
        allowNull: false,
        type: Sequelize.STRING
      },
      patient_orthanc_id:{
        allowNull:false,
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
      return queryInterface.addConstraint('StudyLabels', {
        fields: ['study_instance_uid','label_name'],
        type: 'unique',
        name: 'unique_combined_studyUID&label'
      })
    }).then(() => {
      return queryInterface.addConstraint('StudyLabels', {
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
    await queryInterface.dropTable('StudyLabels');
  }
};