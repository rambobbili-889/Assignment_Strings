import { Router } from 'express';
import authRouter from './auth.routes.js';
import usersRouter from './users.routes.js';
import lifebookRouter from './lifebook.routes.js';
import timelinesRouter from './timelines.routes.js';
import parallelLifeRouter from './parallel-life.routes.js';
import aiRouter from './ai.routes.js';
import paymentsRouter from './payments.routes.js';
import storageRouter from './storage.routes.js';

const api = Router();

api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/lifebook', lifebookRouter);
api.use('/timelines', timelinesRouter);
api.use('/parallel-life', parallelLifeRouter);
api.use('/ai', aiRouter);
api.use('/payments', paymentsRouter);
api.use('/storage', storageRouter);

export default api;