'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Roles', 'upload', 'import')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Roles', 'import', 'upload')
  }
};
