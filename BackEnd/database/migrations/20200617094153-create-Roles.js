module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Roles', {
      name: { //ID
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      import: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      content: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      anon: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      export_local: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      export_extern: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      query: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      auto_query: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      delete: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      admin: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      modify: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      cd_burner : {
        type: Sequelize.BOOLEAN, 
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then( () => {

      return queryInterface.bulkInsert('Roles', [{
        name: 'admin',
        import: true, 
        content: true, 
        anon: true, 
        export_local: true, 
        export_extern: true,
        query: true,
        auto_query: true,
        delete: true, 
        admin: true,
        cd_burner:true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        modify: true
      }, {
        name: 'user',
        import: true, 
        content: true, 
        anon: true, 
        export_local: true, 
        export_extern: true,
        query: true,
        auto_query: true,
        delete: true, 
        admin: false,
        cd_burner:true,
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString(),
        modify: true
      }])

    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Roles');
  }
};