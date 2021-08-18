import { config } from 'dotenv';
import mongoose from 'mongoose';
import { dbDir } from '../src/config';

const dbPath = `../src/databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const { connectDB } = require(dbPath);

beforeAll(() => {
  config();
  process.env.DB_NAME = 'tests-db';
  connectDB();
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
});

afterAll(async () => {
  await mongoose.connection.close();
});
