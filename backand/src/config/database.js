// Configuração do database
module.exports = {
// Tipo do banco que está sendo utilizado
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'gobarber',
  define: {
    // Cria um campo com data de criação e edição do determinado arquivo
    timestamp: true,
    // Cria o nom
    underscored: true,
    underscoredAll: true,
  },
};
