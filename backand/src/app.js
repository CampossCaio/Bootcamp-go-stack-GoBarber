import express from 'express';
import path from 'path';
import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    // Permite que a aplicação receba requisições Json no body
    this.server.use(express.json());

    // Entregando arquivos estáticos no Express
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
