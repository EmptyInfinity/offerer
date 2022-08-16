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
    });
  });
});
