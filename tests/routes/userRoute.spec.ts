import { expect } from 'chai';
import request from 'supertest';
import UserService from '../../src/services/UserService';
import { formUser } from '../helper';
import getApp from '../../src/app';

describe('userRoute', () => {
  let server: any;
  // eslint-disable-next-line no-undef
  before(async () => {
    server = request(await getApp());
  });
  describe('/POST', () => {
    describe('/users', () => {
      it('should add user', async () => {
        const user = formUser({});

        const { body: resUser, status, headers } = await server.post('/users').send(user);
        // response validation
        expect(status).to.be.equal(200);
        expect(headers['auth-token']).to.be.a('string');
        expect(headers['auth-token'].length > 100).to.be.equal(true);
        delete user.password;
        expect(resUser).to.be.deep.equal({
          ...user,
          id: resUser.id,
          isAdmin: false,
          offers: [],
          skills: [],
        });

        // DB validation
        const userInDb = await UserService.getById(resUser.id);
        expect({ ...userInDb, email: user.email }).to.be.deep.equal({
          ...resUser,
          skills: [],
          offers: [],
          isAdmin: false,
        });
      });
      it('should return error (validation with @hapi/joi)', async () => {
        const user = formUser({});
        delete user.name;

        const { body, status } = await server.post('/users').send(user);
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"name" is required');

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb).to.be.deep.equal([]);
      });
      it('should return error (validation with @hapi/joi)', async () => {
        const user = formUser({});

        const { body, status } = await server.post('/users').send({ ...user, skills: [] });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"skills" is not allowed');

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb).to.be.deep.equal([]);
      });
      it('should return error (duplicated email)', async () => {
        const user = formUser({});
        await UserService.createOne(user);

        const { body, status } = await server.post('/users').send(user);
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal(`Email "${user.email}" is already in use!`);

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb.length).to.be.deep.equal(1);
      });
      it('should return error (already logined user)', async () => {
        const user = formUser({});
        const { token } = await UserService.createOne(user);

        const { body, status } = await server.post('/users').set({ 'auth-token': token }).send(user);
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Logined user can\'t create other user!');

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb.length).to.be.deep.equal(1);
      });
    });
    // describe('/users/join-company/:companyId', () => {
    //   it('should successfully join user to company', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));
    //     await CompanyService.inviteUser(company.id, user.id);

    //     const token = createToken(user.id);
    //     const { body, status, headers } = await server.post(`/users/join-company/${company.id}`).set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(200);
    //     expect(headers['auth-token']).to.be.an('undefined');
    //     expect(body).to.be.deep.equal({});
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company.id).to.be.equal(company.id);
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(1);
    //     const companyInvitesInDb = await InviteService.getAll();
    //     expect(companyInvitesInDb.length).to.be.equal(0);
    //   });
    //   it('should return error (user was not invited)', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post(`/users/join-company/${company.id}`).set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(403);
    //     expect(body.message).to.be.equal('Permission denied');
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company).to.be.an('undefined');
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(0);
    //   });
    //   it('should return error (user already belongs company)', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));
    //     await CompanyService.inviteUser(company.id, user.id);
    //     await UserService.joinCompany(user.id, company.id);

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post(`/users/join-company/${company.id}`).set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(403);
    //     expect(body.message).to.be.equal('User already belongs company!');
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company.name).to.be.equal(company.name);
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(1);
    //   });
    // });
    // describe('/users/leave-company', () => {
    //   it('should successfully remove user from company', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));
    //     await CompanyService.inviteUser(company.id, user.id);
    //     await UserService.joinCompany(user.id, company.id);

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post('/users/leave-company').set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(200);
    //     expect(body).to.be.deep.equal({});
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company).to.be.equal(null);
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(0);
    //   });
    //   it('should return error (user does not belongs any company)', async () => {
    //     const { user } = await UserService.createOne(formUser({}));

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post('/users/leave-company').set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(403);
    //     expect(body.message).to.be.equal('User does not belongs any company!');
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company).to.be.an('undefined');
    //   });
    // });
  });
  describe('/PUT', () => {
    describe('/users', () => {
      it('should update user', async () => {
        const user = formUser({});
        const { user: createdUser, token } = await UserService.createOne(user);

        const { body: resUser, status } = await server.put(`/users/${createdUser.id}`).set({ 'auth-token': token }).send({ name: 'John' });

        // response validation
        expect(status).to.be.equal(200);
        delete user.password;
        expect(resUser).to.be.deep.equal({
          id: resUser.id,
          name: 'John',
          isAdmin: false,
          offers: [],
          skills: [],
        });

        // DB validation
        const userInDb = await UserService.getById(resUser.id);
        expect({ ...userInDb, email: user.email }).to.be.deep.equal({
          ...resUser,
          email: user.email,
          skills: [],
          offers: [],
          isAdmin: false,
          name: 'John',
        });
      });
      it('should return error (as admin)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure', isAdmin: true,
        });

        const { body: resUser, status } = await server.put(`/users/${user.id}`).set({ 'auth-token': token }).send({ name: 'John' });

        // response validation
        expect(status).to.be.equal(200);
        delete user.password;
        expect(resUser).to.be.deep.equal({
          id: resUser.id,
          name: 'John',
          isAdmin: false,
          offers: [],
          skills: [],
        });

        // DB validation
        const userInDb = await UserService.getById(resUser.id);
        expect({ ...userInDb, email: user.email }).to.be.deep.equal({
          ...resUser,
          email: user.email,
          skills: [],
          offers: [],
          isAdmin: false,
          name: 'John',
        });
      });
      it('should return error (permission denied)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

        const { body, status } = await server.put(`/users/${user.id}`).set({ 'auth-token': token }).send({ name: 'John' });

        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');

        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb.name).to.be.equal(user.name);
      });
      it('should return error (user not found)', async () => {
        const user = formUser({});
        const { user: createdUser, token } = await UserService.createOne(user);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.put(`/users/${nonExistingId}`).set({ 'auth-token': token }).send({ name: 'John' });

        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);


        // DB validation
        const userInDb = await UserService.getById(createdUser.id);
        expect(userInDb.name).to.be.equal(createdUser.name);
      });
      it('should return error (user not found), role: admin', async () => {
        const user = formUser({});
        const { user: createdUser, token } = await UserService.createOne({ ...user, isAdmin: true });

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.put(`/users/${nonExistingId}`).set({ 'auth-token': token }).send({ name: 'John' });

        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);


        // DB validation
        const userInDb = await UserService.getById(createdUser.id);
        expect(userInDb.name).to.be.equal(createdUser.name);
      });
      it('should return error (validation with @hapi/joi)', async () => {
        const user = formUser({});
        delete user.name;

        const { body, status } = await server.post('/users').send(user);
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"name" is required');

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb).to.be.deep.equal([]);
      });
      it('should return error (validation with @hapi/joi)', async () => {
        const user = formUser({});

        const { body, status } = await server.post('/users').send({ ...user, skills: [] });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"skills" is not allowed');

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb).to.be.deep.equal([]);
      });
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
    // describe('/users/join-company/:companyId', () => {
    //   it('should successfully join user to company', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));
    //     await CompanyService.inviteUser(company.id, user.id);

    //     const token = createToken(user.id);
    //     const { body, status, headers } = await server.post(`/users/join-company/${company.id}`).set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(200);
    //     expect(headers['auth-token']).to.be.an('undefined');
    //     expect(body).to.be.deep.equal({});
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company.id).to.be.equal(company.id);
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(1);
    //     const companyInvitesInDb = await InviteService.getAll();
    //     expect(companyInvitesInDb.length).to.be.equal(0);
    //   });
    //   it('should return error (user was not invited)', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post(`/users/join-company/${company.id}`).set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(403);
    //     expect(body.message).to.be.equal('Permission denied');
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company).to.be.an('undefined');
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(0);
    //   });
    //   it('should return error (user already belongs company)', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));
    //     await CompanyService.inviteUser(company.id, user.id);
    //     await UserService.joinCompany(user.id, company.id);

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post(`/users/join-company/${company.id}`).set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(403);
    //     expect(body.message).to.be.equal('User already belongs company!');
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company.name).to.be.equal(company.name);
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(1);
    //   });
    // });
    // describe('/users/leave-company', () => {
    //   it('should successfully remove user from company', async () => {
    //     const company = await CompanyService.createOne(formCompany({}));
    //     const { user } = await UserService.createOne(formUser({}));
    //     await CompanyService.inviteUser(company.id, user.id);
    //     await UserService.joinCompany(user.id, company.id);

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post('/users/leave-company').set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(200);
    //     expect(body).to.be.deep.equal({});
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company).to.be.equal(null);
    //     const companyInDb = await CompanyService.getById(company.id);
    //     expect(companyInDb.employees.length).to.be.equal(0);
    //   });
    //   it('should return error (user does not belongs any company)', async () => {
    //     const { user } = await UserService.createOne(formUser({}));

    //     const token = createToken(user.id);
    //     const { body, status } = await server.post('/users/leave-company').set().set({ 'auth-token': token });
    //     // response validation
    //     expect(status).to.be.equal(403);
    //     expect(body.message).to.be.equal('User does not belongs any company!');
    //     // DB validation
    //     const userInDb = await UserService.getById(user.id);
    //     expect(userInDb.company).to.be.an('undefined');
    //   });
    // });
  });
  describe('/GET', () => {
    describe('/users/:id', () => {
      it('should successfully get user', async () => {
        const formedUser = formUser({});
        const { user, token } = await UserService.createOne(formedUser);
        const { body, status } = await server.get(`/users/${user.id}`).set({ 'auth-token': token });
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(user);
      });
      it('should successfully get user (as admin)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure', isAdmin: true,
        });
        const { body, status } = await server.get(`/users/${user.id}`).set({ 'auth-token': token });
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(user);
      });
      it('should return error (permission denied)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });
        const { body, status } = await server.get(`/users/${user.id}`).set({ 'auth-token': token });
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');
      });
      it('should return error (user not found)', async () => {
        const { token } = await UserService.createOne(formUser({}));
        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.get(`/users/${nonExistingId}`).set({ 'auth-token': token });
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);
      });
      it('should return error (user not found), role: admin', async () => {
        const { token } = await UserService.createOne({ ...formUser({}), isAdmin: true });
        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.get(`/users/${nonExistingId}`).set({ 'auth-token': token });
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);
      });
    });
  });
  describe('/DELETE', () => {
    describe('/users/:id', () => {
      it('should successfully delete user', async () => {
        const { user, token } = await UserService.createOne(formUser({}));

        const { body, status } = await server.delete(`/users/${user.id}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(user);
        // DB validation
        const users = await UserService.getAll();
        expect(users.length).to.be.equal(0);
      });
      it('should successfully get user (as admin)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure', isAdmin: true,
        });
        const { body, status } = await server.delete(`/users/${user.id}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(user);
        // DB validation
        const users = await UserService.getAll();
        expect(users.length).to.be.equal(1);
      });
      it('should return error (permission denied)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });
        const { body, status } = await server.delete(`/users/${user.id}`).set({ 'auth-token': token });
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');
      });
      it('should return error (user not found)', async () => {
        const { token } = await UserService.createOne(formUser({}));
        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.delete(`/users/${nonExistingId}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);
      });
      it('should return error (user not found), role: admin', async () => {
        const { token } = await UserService.createOne({ ...formUser({}), isAdmin: true });
        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.delete(`/users/${nonExistingId}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);
      });
    });
  });
});
