import Sequelize from 'sequelize';
import mongose from 'mongoose';

// Importando os models
import User from '../app/models/User';
import File from '../app/models/File';
import Appointments from '../app/models/Appointments';

import databaseConfig from '../config/database';

// Crinado array de models
const models = [User, File, Appointments];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  // Método responsável por criar a conexão com o banco e passar a conexão para o método init
  // contido em cada model
  init() {
    // Atribuindo as configurações de conexão a variável connection
    this.connection = new Sequelize(databaseConfig);

    // Passando o connection para o metodo init  dos models
    models
      .map((model) => model.init(this.connection))
      // Chama o método associate em todos os models que o tiverem
      .map((model) => model.associate && model.associate(this.connection.models));
  }

  /**
   * Configurando conexão com mongoose
   */
  mongo() {
    this.mongoConnection = mongose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true },
    );
  }
}

export default new Database();
