import express from 'express';
import fs from 'fs';
import path from 'path';
import Logger from '../handlers/Logger';
import { isDir, wordToPlural } from '../helpers';
import loginHandler from './loginHandler';

const routePrefixes: any = {
  offers: '/companies/:companyId',
};

const router = express.Router();

export default async () => {
  try {
    // meta routes
    const filesAndDirs = await fs.readdirSync(path.join(__dirname, '../routes'));
    filesAndDirs.forEach(async (item) => {
      if (!isDir(item)) return;
      const pluralName = wordToPlural(item);
      const route = `${routePrefixes[pluralName] || ''}/${pluralName}`;
      const { default: routeHandler } = await import(`./${item}/${item}Route`);
      router.use(route, routeHandler);
    });
    // end meta routes
    router.use('/login', loginHandler);
  } catch (err) {
    Logger.error(err);
  }

  return router;
};
