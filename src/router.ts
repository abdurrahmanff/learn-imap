import { Application } from 'express';
import authRouter from './interfaces/apis/auth/router';
import mailRouter from './interfaces/apis/mail/router';

const registerRouters = (app: Application) => {
  app.use((req, res, next) => {
    res.locals.isAuthenticated = false;
    next();
  });
  app.use('/api/auth', authRouter);
  app.use('/api/mails', mailRouter);
};

export default registerRouters;
