module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LdapOptions', {
      id: { //ID
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TypeGroup: {
        defaultValue: 'ad',
        type: Sequelize.STRING, 
      },
      protocol: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      address: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      port: {
        defaultValue: 389,
        type: Sequelize.INTEGER, 
      },
      DN: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      password: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      user: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      group: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      base: {
        defaultValue: '',
        type: Sequelize.STRING, 
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
      queryInterface.bulkInsert('LdapOptions', [{
        id:1,
        TypeGroup:'ad',
        protocol:'',
        address:'',
        port:389,
        DN:'',
        password:'',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LdapOptions');
  }
};
