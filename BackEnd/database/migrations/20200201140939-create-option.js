'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Options', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hour: {
        type: Sequelize.INTEGER
      },
      min: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ldap: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      CDBurnerLabelFile: {
        allowNull: false,
        type: Sequelize.STRING, 
        defaultValue: '',
      },
      CDBurnerMonitoringLevel: {
        allowNull: false,
        type: Sequelize.STRING, 
        defaultValue: '',
      },
      CDBurnerBurnerManifacturer: {
        allowNull: false,
        type: Sequelize.STRING, 
        defaultValue: '',
      },
      CDBurnerMonitoredFolder: {
        allowNull: false,
        type: Sequelize.STRING, 
        defaultValue: '',
      },
      CDBurnerDeleteStudyAfterSent: {
        allowNull: false,
        type: Sequelize.BOOLEAN, 
        defaultValue: false,
      },
      CDBurnerViewerPath: {
        allowNull: false,
        type: Sequelize.STRING, 
        defaultValue: '',
      }

    }).then(() => {
      queryInterface.bulkInsert('Options', [{
        hour: 22,
        min: 0,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        ldap: false
      }], {})
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Options')
  }
}
