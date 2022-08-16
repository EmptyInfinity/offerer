/* eslint-disable no-restricted-syntax */
import mongoose from 'mongoose';
import isPlainObject from 'lodash.isplainobject';
import { object } from '@hapi/joi';
import Logger from '../../handlers/Logger';
import { getDbConfig } from '../../config';

let dbURI: string;

const options = {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
  autoIndex: true,
  // poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  // bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

export const isValidId = (id: string) => mongoose.isValidObjectId(id);
export const isDbError = (error: any) => error.name === 'MongoError';
export const toJS = (obj: any) => {
  if (obj) {
    delete obj._id;
  }
  return obj;
};

// Create the database connection
export const connectDB = () => {
  // Build the connection string
  const dbConfig = getDbConfig();
  dbURI = `mongodb+srv://${dbConfig.user}:${encodeURIComponent(dbConfig.password)}@${dbConfig.host}/${dbConfig.name}`;
  Logger.debug(dbURI);
  return mongoose
    .connect(dbURI, options)
    .then(() => {
      Logger.info('Mongoose connection done');
    })
    .catch((e) => {
      Logger.info('Mongoose connection error');
      Logger.error(e);
    });
};

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
  Logger.info(`Mongoose default connection open to ${dbURI}`);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
  Logger.error(`Mongoose default connection error: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
  Logger.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    Logger.info('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
