
module.exports = {

  // Adiciona um novo campo a tabela User
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'users',
    'avatar_id',
    {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    },
  ),

  // Remove a coluna caso algo dê errado
  down: (queryInterface) => queryInterface.removeColumn('users', 'avatar_id'),
};
