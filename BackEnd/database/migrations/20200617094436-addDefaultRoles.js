'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
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
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString(),
      modify: true
    }])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', [{
        name: 'admin'
      }, {
        name: 'user'
      }])
  }
};

