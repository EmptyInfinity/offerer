import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app';

describe('userRoue', () => {
  it('should add user', async () => {
    const response = await request(await app()).post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
  it('should add user', async () => {
    const response = await request(await app()).post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
  it('should add user', async () => {
    const response = await request(await app()).post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
  it('should add user', async () => {
    const response = await request(await app()).post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
});
