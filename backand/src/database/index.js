import Sequelize from 'sequelize';

import User from '../app/models/User';

import databaseConfig from '../config/database';

// Crinado array de models
const models = [User];

class Database {
  constructor() {
    this.init();
  }

  // Método responsável por criar a conexão com o banco e passar a conexão para o método init
  // contido em cada model
  init() {
    // Atribuindo as configurações de conexão a variável connection
    this.connection = new Sequelize(databaseConfig);

    // Passando o connection para o metodo init  dos models
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
