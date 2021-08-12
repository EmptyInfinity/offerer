import Logger from './handlers/Logger';
import { port, dbDir } from './config';
import getApp from './app';

process.on('uncaughtException', (err) => {
  Logger.error(err);
});

const dbPath = `./databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const { connectDB } = require(dbPath);
connectDB();

(async () => {
  try {
    const app = await getApp();
    app.listen(port, () => {
      Logger.info(`server running on port : ${port}`);
    })
      .on('error', (e) => Logger.error(e));
  } catch (err) {
    Logger.error(err);
  }
})();
