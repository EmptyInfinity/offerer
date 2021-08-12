/* eslint-disable consistent-return */
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Logger from './handlers/Logger';
import { corsUrl, environment } from './config';

import { NotFoundError, ApiError, InternalError } from './handlers/ApiError';
import getRoutes from './routes';

const app = express();

export default async () => {
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
  app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

  // Routes
  const routes = await getRoutes();
  app.use('/v1', routes);

  // catch 404 and forward to error handler
  app.use((req, res, next) => next(new NotFoundError()));

  // Middleware Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
      ApiError.handle(err, res);
    } else {
      if (environment === 'development') {
        Logger.error(err);
        return res.status(500).send(err.message);
      }
      ApiError.handle(new InternalError(), res);
    }
  });

  return app;
};
