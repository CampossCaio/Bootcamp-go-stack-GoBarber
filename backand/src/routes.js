// Importando apenas o Router de dentro do express
import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

// Instanciando um novo Router
const routes = new Router();

// Criar usuário
routes.post('/users', UserController.store);
// Logar em uma sessão
routes.post('/sessions', SessionController.store);

// O middlewarw será executado em todas as rotas abaixo.
routes.use(authMiddleware);
// Atualizar informaçẽos usuários
routes.put('/users', UserController.update);


export default routes;
