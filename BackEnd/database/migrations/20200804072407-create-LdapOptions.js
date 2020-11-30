module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('LdapOptions', {
      id: { //ID
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      TypeGroupe: {
        defaultValue: 'ad',
        type: Sequelize.STRING, 
      },
      protocole: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      adresse: {
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
      mdp: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      user: {
        defaultValue: '',
        type: Sequelize.STRING, 
      },
      groupe: {
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
        TypeGroupe:'ad',
        protocole:'',
        adresse:'',
        port:389,
        DN:'',
        mdp:'',
        createdAt: new Date().toDateString(),
        updatedAt: new Date().toDateString()
      }], {})
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('LdapOptions');
  }
};
