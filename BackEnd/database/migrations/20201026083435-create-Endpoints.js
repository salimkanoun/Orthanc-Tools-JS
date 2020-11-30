module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Endpoints', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      label: {
        type: Sequelize.STRING
      },
      host: {
        type: Sequelize.STRING
      },
      protocol: {
        type: Sequelize.STRING
      },
      port: {
        type: Sequelize.INTEGER
      },
      identifiants: {
        type: Sequelize.STRING
      },
      pass:{
        type: Sequelize.BOOLEAN
      },
      targetFolder: {
        type: Sequelize.STRING
      },
      digest: {
        type: Sequelize.BOOLEAN
      },
      ssl:{
        type:Sequelize.BOOLEAN
      },
      sshKey: {
        type: Sequelize.UUID,
        references:{
          model: 'SshKeys',
          references:'id'
        },
        allowNull : true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    return queryInterface.dropTable('Endpoints');
  }
};