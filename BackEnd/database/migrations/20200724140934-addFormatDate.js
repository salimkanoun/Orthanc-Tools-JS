'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Options',
      'date_format',
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
