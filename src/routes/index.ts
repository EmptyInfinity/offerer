import express from 'express';
import fs from 'fs';
import path from 'path';
import Logger from '../handlers/Logger';
import { isDir, worldToPlural } from '../helpers';

const router = express.Router();

export default async () => {
  try {
    const filesAndDirs = await fs.readdirSync(path.join(__dirname, '../routes'));
    filesAndDirs.forEach(async (item) => {
      if (!isDir(item)) return;
      const route = `/${worldToPlural(item)}`;
      const { default: routeHandler } = await import(`./${item}/${item}Route`);
      router.use(route, routeHandler);
    });
  } catch (err) {
    Logger.error(err);
  }

  return router;
};
