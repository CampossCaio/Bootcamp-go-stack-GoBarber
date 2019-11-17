
import 'dotenv/config';
import express from 'express';
import Youch from 'youch';
import path from 'path';
import * as Sentry from '@sentry/node';
import routes from './routes';
import sentryConfig from './config/sentry';
import './database';

// Permite que o express envie error de métodos assíncronos para o Sentry
import 'express-async-errors';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    // Permite que a aplicação receba requisições Json no body
    this.server.use(express.json());

    // Entregando arquivos estáticos no Express
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'temp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
      if (process.env.NODE_ENV === 'development') {
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
