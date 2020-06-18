'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Roles', [{
      name: 'admin',
      upload: true, 
      content: true, 
      anon: true, 
      export_local: true, 
      export_extern: true,
      query: true,
      auto_query: true,
      delete: true, 
      admin: true,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }, {
      name: 'user',
      upload: true, 
      content: true, 
      anon: true, 
      export_local: true, 
      export_extern: true,
      query: true,
      auto_query: true,
      delete: true, 
      admin: false,
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
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

