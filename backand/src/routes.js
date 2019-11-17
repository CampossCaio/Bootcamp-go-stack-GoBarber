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
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';
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
// Lista horários disponíveis
routes.get('/providers/:providerId/available', AvailableController.index);
// Cria um compromiso
routes.post('/appointments', AppointmentsController.store);
// Lista os agendamentos feitos pelo usuário
routes.get('/appointments', AppointmentsController.index);
// Deleta o agendamento
routes.delete('/appointments/:id', AppointmentsController.delete);
// Lista os agendamentos para o prestador
routes.get('/schedule', SchedulerController.index);
// Responsável pelo upload de arquivos(avatar so provider)
routes.post('/files', upload.single('file'), FileController.store);
// Lista as notificações do prestador
routes.get('/notifications', NotificationController.index);
// Setando notificação como lida
routes.put('/notifications/:id', NotificationController.update);


export default routes;
