import { expect } from 'chai';
import request from 'supertest';
import CompanyService from '../../src/services/CompanyService';
import UserService from '../../src/services/UserService';
import { formCompany, formUser } from '../helper';
import getApp from '../../src/app';

describe('companyRoute', () => {
  let server: any;
  // eslint-disable-next-line no-undef
  before(async () => {
    server = request(await getApp());
  });
  describe('/POST', () => {
    describe('/companies', () => {
      it('should add user', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = formCompany({});

        const { body: resCompany, status } = await server.post('/companies').set({ 'auth-token': token }).send(company);
        // response validation
        expect(status).to.be.equal(200);
        expect(resCompany).to.be.deep.equal({
          ...company,
          id: resCompany.id,
          employees: [{ isAdmin: true, user: user.id }],
        });

        // DB validation
        const companyInDb = await CompanyService.getById(resCompany.id);
        expect(companyInDb).to.be.deep.equal(resCompany);
      });
      it('should throw error, duplicated name', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company: any = formCompany({});
        await CompanyService.createOne(company, user.id);

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send(company);
        // response validation
        expect(status).to.be.equal(400);

        expect(body.message).to.be.equal(`Name "${company.name}" is already in use!`);

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(1);
      });
      it('should throw error, duplicated link', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company: any = formCompany({});
        await CompanyService.createOne(company, user.id);

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send({ ...company, name: 'anotherName' });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal(`Link "${company.link}" is already in use!`);

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(1);
      });
      it('should throw error, missing required field', async () => {
        const { token } = await UserService.createOne(formUser({}));

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send({});
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"name" is required');

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(0);
      });
      it('should throw error, extra field', async () => {
        const { token } = await UserService.createOne(formUser({}));

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send({ ...formCompany({}), a: 2 });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"a" is not allowed');

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(0);
      });
      it('should throw error, invalid token', async () => {
        const { body, status } = await server.post('/companies').set({ 'auth-token': 'invalid' }).send(formCompany({}));
        // response validation
        expect(status).to.be.equal(401);
        expect(body.message).to.be.equal('Token is not valid');

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(0);
      });
    });
  });
  describe('/PUT', () => {
    describe('/companies', () => {
      it.only('should update user', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);

        const { body: resCompany, status } = await server.post('/companies').set({ 'auth-token': token }).send({ name: 'new name' });
        // response validation
        expect(status).to.be.equal(200);
        console.log(company, resCompany);

        // expect(resCompany).to.be.deep.equal({
        //   ...company,
        //   name: 'new name',
        //   id: resCompany.id,
        //   employees: [{ isAdmin: true, user: user.id }],
        // });

        // DB validation
        const companyInDb = await CompanyService.getById(resCompany.id);
        expect(companyInDb).to.be.deep.equal(resCompany);
      });
      it('should throw error, duplicated name', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company: any = formCompany({});
        await CompanyService.createOne(company, user.id);

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send(company);
        // response validation
        expect(status).to.be.equal(400);

        expect(body.message).to.be.equal(`Name "${company.name}" is already in use!`);

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(1);
      });
      it('should throw error, duplicated link', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company: any = formCompany({});
        await CompanyService.createOne(company, user.id);

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send({ ...company, name: 'anotherName' });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal(`Link "${company.link}" is already in use!`);

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(1);
      });
      it('should throw error, missing required field', async () => {
        const { token } = await UserService.createOne(formUser({}));

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send({});
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"name" is required');

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(0);
      });
      it('should throw error, extra field', async () => {
        const { token } = await UserService.createOne(formUser({}));

        const { body, status } = await server.post('/companies').set({ 'auth-token': token }).send({ ...formCompany({}), a: 2 });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"a" is not allowed');

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(0);
      });
      it('should throw error, invalid token', async () => {
        const { body, status } = await server.post('/companies').set({ 'auth-token': 'invalid' }).send(formCompany({}));
        // response validation
        expect(status).to.be.equal(401);
        expect(body.message).to.be.equal('Token is not valid');

        // DB validation
        const companiesInDb = await CompanyService.getAll();
        expect(companiesInDb.length).to.be.equal(0);
      });
    });
  });
});
