import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';

import auth from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(auth);
routes.put('/users', UserController.update);
routes.get('/providers', ProviderController.index);

routes.get('/apointments', AppointmentController.index);
routes.post('/apointments', AppointmentController.store);

routes.get('/schedules', ScheduleController.index);
routes.put('/files', upload.single('file'), FileController.update);

export default routes;
