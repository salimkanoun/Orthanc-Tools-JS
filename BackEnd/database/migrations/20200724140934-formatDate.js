'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Options',
      'DateFormat',
     {
       type: Sequelize.STRING
     } 
    );
  },

  down: (queryInterface, Sequelize) => {
    
  }
};
