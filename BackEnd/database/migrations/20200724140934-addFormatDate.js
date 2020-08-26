'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Options',
      'dateFormat',
     {
       type: Sequelize.STRING,
       allowNull: false,
       defaultValue: 'uk' 
     },
     
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Options',
      'dateFormat'
    );
  }
};
