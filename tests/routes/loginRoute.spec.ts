import { expect } from 'chai';
import request from 'supertest';
import UserService from '../../src/services/UserService';
import { formUser } from '../helper';
import getApp from '../../src/app';

describe('loginRoute', () => {
  let server: any;
  // eslint-disable-next-line no-undef
  before(async () => {
    server = request(await getApp());
  });
  describe('/login', () => {
    it('should successfully login user', async () => {
      const user = formUser({});
      await UserService.createOne(user);

      const { body, status, headers } = await server.post('/login').send({ email: user.email, password: user.password });
      expect(status).to.be.equal(200);
      expect(headers['auth-token']).to.be.a('string');
      expect(headers['auth-token'].length > 100).to.be.equal(true);
      expect(body).to.be.deep.equal({});
    });
    it('should fail login (wrong password)', async () => {
      const user = formUser({});
      await UserService.createOne(user);

      const { body, status, headers } = await server.post('/login').send({ email: user.email, password: 'wrong_password' });
      expect(status).to.be.equal(400);
      expect(body.message).to.be.equal('Password or email is wrong');
      expect(headers['auth-token']).to.be.an('undefined');
    });
    it('should fail login (user not found)', async () => {
      const { body, status, headers } = await server.post('/login').send({ email: 'some_email', password: 'some_password' });
      expect(status).to.be.equal(400);
      expect(body.message).to.be.equal('Password or email is wrong');
      expect(headers['auth-token']).to.be.an('undefined');
    });
  });
});
