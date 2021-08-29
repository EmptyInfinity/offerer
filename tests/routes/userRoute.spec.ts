import { expect } from 'chai';
import UserService from '../../src/services/UserService';
import CompanyService from '../../src/services/CompanyService';
import CompanyInviteService from '../../src/services/CompanyInviteService';
import { formUser, formCompany } from '../helper';
import { createToken } from '../../src/helpers';

describe('userRoute', () => {
  describe('/POST', () => {
    describe('/users', () => {
      it('should add user', async () => {
        const user = formUser();

        const { body, status, headers } = await global.server.post('/users').send(user);
        // request validation
        expect(status).to.be.equal(200);
        expect(headers['auth-token']).to.be.a('string');
        expect(headers['auth-token'].length > 100).to.be.equal(true);
        user.id = body.id;
        delete user.password;
        expect(body).to.be.deep.equal(user);

        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb).to.be.deep.equal({ ...user, offers: [] });
      });
      it('should return error (validation with @hapi/joi)', async () => {
        const user = formUser();
        delete user.name;

        const { body, status } = await global.server.post('/users').send(user);
        // request validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"name" is required');

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb).to.be.deep.equal([]);
      });
      it('should return error (duplicated email)', async () => {
        const user = formUser();
        await UserService.createOne(user);

        const { body, status } = await global.server.post('/users').send(user);
        // request validation
        expect(status).to.be.equal(500);
        expect(body.message).to.be.equal(`Email "${user.email}" is already in use!`);

        // DB validation
        const usersInDb = await UserService.getAll();
        expect(usersInDb.length).to.be.deep.equal(1);
      });
    });
    describe('/login', () => {
      it('should successfully login user', async () => {
        const user = formUser();
        await UserService.createOne(user);

        const { body, status, headers } = await global.server.post('/login').send({ email: user.email, password: user.password });
        // request validation
        expect(status).to.be.equal(200);
        expect(headers['auth-token']).to.be.a('string');
        expect(headers['auth-token'].length > 100).to.be.equal(true);
        expect(body).to.be.deep.equal({});
      });
      it('should fail login (wrong password)', async () => {
        const user = formUser();
        await UserService.createOne(user);

        const { body, status, headers } = await global.server.post('/login').send({ email: user.email, password: 'wrong_password' });
        // request validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('Password or email is wrong');
        expect(headers['auth-token']).to.be.an('undefined');
      });
      it('should fail login (user not found)', async () => {
        const { body, status, headers } = await global.server.post('/login').send({ email: 'some_email', password: 'some_password' });
        // request validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('Password or email is wrong');
        expect(headers['auth-token']).to.be.an('undefined');
      });
    });
    describe('/users/join-company/:companyId', () => {
      it('should successfully join user to company', async () => {
        const company = await CompanyService.createOne(formCompany());
        const { user } = await UserService.createOne(formUser());
        await CompanyService.inviteUser(company.id, user.id);

        const token = createToken(user.id);
        const { body, status, headers } = await global.server.post(`/users/join-company/${company.id}`).send().set({ 'auth-token': token });
        // request validation
        expect(status).to.be.equal(200);
        expect(headers['auth-token']).to.be.an('undefined');
        expect(body).to.be.deep.equal({});
        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb.company.id).to.be.equal(company.id);
        const companyInDb = await CompanyService.getById(company.id);
        expect(companyInDb.workers.length).to.be.equal(1);
        const companyInvitesInDb = await CompanyInviteService.getAll();
        expect(companyInvitesInDb.length).to.be.equal(0);
      });
      it('should return error (user was not invited)', async () => {
        const company = await CompanyService.createOne(formCompany());
        const { user } = await UserService.createOne(formUser());

        const token = createToken(user.id);
        const { body, status } = await global.server.post(`/users/join-company/${company.id}`).send().set({ 'auth-token': token });
        // request validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');
        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb.company).to.be.an('undefined');
        const companyInDb = await CompanyService.getById(company.id);
        expect(companyInDb.workers.length).to.be.equal(0);
      });
      it('should return error (user already belongs company)', async () => {
        const company = await CompanyService.createOne(formCompany());
        const { user } = await UserService.createOne(formUser());
        await CompanyService.inviteUser(company.id, user.id);
        await UserService.joinCompany(user.id, company.id);

        const token = createToken(user.id);
        const { body, status } = await global.server.post(`/users/join-company/${company.id}`).send().set({ 'auth-token': token });
        // request validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('User already belongs company!');
        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb.company.name).to.be.equal(company.name);
        const companyInDb = await CompanyService.getById(company.id);
        expect(companyInDb.workers.length).to.be.equal(1);
      });
    });
    describe('/users/leave-company', () => {
      it('should successfully remove user from company', async () => {
        const company = await CompanyService.createOne(formCompany());
        const { user } = await UserService.createOne(formUser());
        await CompanyService.inviteUser(company.id, user.id);
        await UserService.joinCompany(user.id, company.id);

        const token = createToken(user.id);
        const { body, status } = await global.server.post('/users/leave-company').send().set({ 'auth-token': token });
        // request validation
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal({});
        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb.company).to.be.equal(null);
        const companyInDb = await CompanyService.getById(company.id);
        expect(companyInDb.workers.length).to.be.equal(0);
      });
      it('should return error (user does not belongs any company)', async () => {
        const { user } = await UserService.createOne(formUser());

        const token = createToken(user.id);
        const { body, status } = await global.server.post('/users/leave-company').send().set({ 'auth-token': token });
        // request validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('User does not belongs any company!');
        // DB validation
        const userInDb = await UserService.getById(user.id);
        expect(userInDb.company).to.be.an('undefined');
      });
    });
  });
});
