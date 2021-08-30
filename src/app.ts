/* eslint-disable consistent-return */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './swaggerApi';
import { NotFoundError } from './handlers/ApiError';
import getRoutes from './routes';
import errorMiddleware from './helpers/errorMiddleware';

const app = express();

export default async () => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
  app.use(cors());

  // Routes
  const routes = await getRoutes();
  app.use('/', routes);

  // catch 404 and forward to error handler
  app.use((req, res, next) => next(new NotFoundError()));

  // Middleware Error Handler
  app.use(errorMiddleware);

  return app;
};
