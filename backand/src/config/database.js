require('dotenv/config');

// Configuração do database
module.exports = {
// Tipo do banco que está sendo utilizado
  dialect: 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  define: {
    // Cria um campo com data de criação e edição do determinado arquivo
    timestamp: true,
    // Cria o nom
    underscored: true,
    underscoredAll: true,
  },
};
