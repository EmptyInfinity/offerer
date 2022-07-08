import { config } from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';
import { dbDir } from '../src/config';
import getApp from '../src/app';

// interface Global {
//   server: any;
// }
// export declare const global: Global;

const dbPath = `../src/databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const { connectDB } = require(dbPath);

beforeAll(async () => {
  config();
  process.env.NODE_ENV = 'test';
  process.env.DB_NAME = 'tests-db';
  connectDB();
  // global.server = request(await getApp());
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  // eslint-disable-next-line no-restricted-syntax
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
