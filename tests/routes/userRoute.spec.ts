import request from 'supertest';
import { expect } from 'chai';

describe('userRoue', () => {
  it('should add user', async () => {
    // const server = request(await app());
    const response = await global.server.post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
  it('should add user', async () => {
    const response = await global.server.post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
  it('should add user', async () => {
    const response = await global.server.post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
  it('should add user', async () => {
    const response = await global.server.post('/users').send({
      name: 'username',
      email: 'some@gmail.com',
      role: 'user',
      offers: [],
      password: 'Password9',
    });
    expect(response.status).to.be.equal(200);
  });
});
