'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('images', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      tatooId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {model: 'tatoos', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      path:{
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
    
  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.dropTable('images');
  }
};
