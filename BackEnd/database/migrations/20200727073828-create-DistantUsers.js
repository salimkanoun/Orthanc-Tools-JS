module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('DistantUsers', {
      id: { //ID
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ldap_group: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING, 
      }, 
      local_role: {
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
