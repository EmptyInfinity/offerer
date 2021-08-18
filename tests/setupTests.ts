import { config } from 'dotenv';
import mongoose from 'mongoose';
import request from 'supertest';
import { dbDir } from '../src/config';
import getApp from '../src/app';

declare global {
  namespace NodeJS {
    interface Global {
      server: any
    }
  }
}

const dbPath = `../src/databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const { connectDB } = require(dbPath);

beforeAll(async () => {
  config();
  process.env.DB_NAME = 'tests-db';
  connectDB();
  global.server = request(await getApp());
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});
