// Importando apenas o Router de dentro do express
import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentsController from './app/controllers/AppointmentController';
import SchedulerController from './app/controllers/ScheduleController';


import authMiddleware from './app/middlewares/auth';


// Instanciando um novo Router
const routes = new Router();
const upload = multer(multerConfig);

// Criar usuário
routes.post('/users', UserController.store);
// Logar em uma sessão
routes.post('/sessions', SessionController.store);

// O middlewarw será executado em todas as rotas abaixo.
routes.use(authMiddleware);
// Atualizar informaçẽos usuários
routes.put('/users', UserController.update);
// Tras uma lista com todos os providers
routes.get('/providers', ProviderController.index);
// Cria um compromiso
routes.post('/appointments', AppointmentsController.store);
// Lista os agendamentos feitos pelo usuário
routes.get('/appointments', AppointmentsController.index);
// Lista os agendamentos para o prestador
routes.get('/schedule', SchedulerController.index);
// Responsável pelo upload de arquivos(avatar so provider)
routes.post('/files', upload.single('file'), FileController.store);


export default routes;
