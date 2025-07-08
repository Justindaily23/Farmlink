'use strict';

import { Sequelize } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('buyers', 'produce_preferences', {
    type: Sequelize.ARRAY(Sequelize.STRING),
    allowNull: true,
  });
}
