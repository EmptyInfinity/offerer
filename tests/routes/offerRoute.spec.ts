import { expect } from 'chai';
import request from 'supertest';
import CompanyService from '../../src/services/CompanyService';
import UserService from '../../src/services/UserService';
import OfferService from '../../src/services/OfferService';
import { formCompany, formUser, formOffer } from '../helper';
import getApp from '../../src/app';

describe('offerRoute', () => {
  let server: any;
  // eslint-disable-next-line no-undef
  before(async () => {
    server = request(await getApp());
  });
  describe('/POST', () => {
    describe('/companies/:companyId/offers', () => {
      it('should add company', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = formOffer({});

        const { body: resOffer, status } = await server.post(`/companies/${company.id}/offers`).set({ 'auth-token': token }).send(offer);
        // response validation
        expect(status).to.be.equal(200);
        expect(resOffer).to.be.deep.equal({
          ...offer,
          id: resOffer.id,
          company: company.id,
        });

        // DB validation
        const offerInDb = await OfferService.getByIdInCompany(resOffer.id, company.id);
        expect(offerInDb).to.be.deep.equal(resOffer);
      });
      it('should return error, admin can\'t create offers', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure', isAdmin: true,
        });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = formOffer({});

        const { body, status } = await server.post(`/companies/${company.id}/offers`).set({ 'auth-token': token }).send(offer);
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');

        // DB validation
        const offerInDb = await OfferService.getAll();
        expect(offerInDb).to.be.deep.equal([]);
      });
      it('should return error, only company admin can create offers', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure',
        });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = formOffer({});

        const { body, status } = await server.post(`/companies/${company.id}/offers`).set({ 'auth-token': token }).send(offer);
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');

        // DB validation
        const offerInDb = await OfferService.getAll();
        expect(offerInDb).to.be.deep.equal([]);
      });
      it('should throw error, missing required field', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);

        const { body, status } = await server.post(`/companies/${company.id}/offers`).set({ 'auth-token': token }).send({});
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"name" is required');

        // DB validation
        const offerInDb = await OfferService.getAll();
        expect(offerInDb.length).to.be.equal(0);
      });
      it('should throw error, extra field', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);

        const { body, status } = await server.post(`/companies/${company.id}/offers`).set({ 'auth-token': token }).send({ ...formOffer({}), a: 22 });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"a" is not allowed');

        // DB validation
        const offerInDb = await OfferService.getAll();
        expect(offerInDb.length).to.be.equal(0);
      });
    });
  });
  describe('/PUT', () => {
    describe('/companies/:companyId/offers', () => {
      it('should update offer', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body: resOffer, status } = await server.put(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token }).send({ name: 'new name' });
        // response validation
        expect(status).to.be.equal(200);
        expect(resOffer).to.be.deep.equal({ ...offer, name: 'new name' });

        // DB validation
        const offerInDb = await OfferService.getByIdInCompany(resOffer.id, company.id);
        expect(offerInDb).to.be.deep.equal(resOffer);
      });
      it('should update offer (as admin)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure', isAdmin: true,
        });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body: resOffer, status } = await server.put(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token }).send({ name: 'new name' });
        // response validation
        expect(status).to.be.equal(200);
        expect(resOffer).to.be.deep.equal({ ...offer, name: 'new name' });

        // DB validation
        const offerInDb = await OfferService.getByIdInCompany(resOffer.id, company.id);
        expect(offerInDb).to.be.deep.equal(resOffer);
      });
      it('should throw error, not company admin', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body, status } = await server.put(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token }).send({ name: 'new name' });
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');

        // DB validation
        const offerInDb = await OfferService.getByIdInCompany(offer.id, company.id);
        expect(offerInDb.name).to.be.equal(offer.name);
      });
      it('should throw error, company is not found', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.put(`/companies/${nonExistingId}/offers/${offer.id}`).set({ 'auth-token': token }).send({ name: 'new name' });
        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`Company with id "${nonExistingId}" is not found!`);

        // // DB validation
        const offerInDb = await OfferService.getByIdInCompany(offer.id, company.id);
        expect(offerInDb.name).to.be.equal(offer.name);
      });
      it('should throw error, offer is not found', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.put(`/companies/${company.id}/offers/${nonExistingId}`).set({ 'auth-token': token }).send({ name: 'new name' });
        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`Offer with id "${nonExistingId}" is not found!`);

        // // DB validation
        const offerInDb = await OfferService.getByIdInCompany(offer.id, company.id);
        expect(offerInDb.name).to.be.equal(offer.name);
      });
      it('should throw error, extra field', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body, status } = await server.put(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token }).send({ a: 2 });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"a" is not allowed');

        // DB validation
        const offerInDb = await OfferService.getByIdInCompany(offer.id, company.id);
        expect(offerInDb).to.be.deep.equal(offer);
      });
    });
  });
  describe('/GET', () => {
    describe('/companies/:companyId/offers/:id', () => {
      it('should successfully get offer', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body: resOffer, status } = await server.get(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token });
        expect(status).to.be.equal(200);
        expect(resOffer).to.be.deep.equal(offer);
      });
      it('should return error (offer not found)', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.get(`/companies/${company.id}/offers/${nonExistingId}`).set({ 'auth-token': token });
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`Offer with id "${nonExistingId}" is not found!`);
      });
      it('should return error (company not found)', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.get(`/companies/${nonExistingId}/offers/${offer.id}`).set({ 'auth-token': token });
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`Company with id "${nonExistingId}" is not found!`);
      });
    });
  });
  describe('/DELETE', () => {
    describe('/companies/:companyId/offers/:id', () => {
      it('should successfully delete offer', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body, status } = await server.delete(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(offer);
        // DB validation
        const offers = await OfferService.getAll();
        expect(offers.length).to.be.equal(0);
      });
      it('should successfully delete offer (as admin)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({
          name: 'us', email: 'user@email.com', password: 'secure', isAdmin: true,
        });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body, status } = await server.delete(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(200);
        expect(body).to.be.deep.equal(offer);
        // DB validation
        const offers = await OfferService.getAll();
        expect(offers.length).to.be.equal(0);
      });
      it('should return error (not company admin)', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const { body, status } = await server.delete(`/companies/${company.id}/offers/${offer.id}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');
        // DB validation
        const offerInDb = await OfferService.getByIdInCompany(offer.id, company.id);
        expect(offerInDb).to.be.deep.equal(offer);
      });
      it('should return error (company not found)', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.delete(`/companies/${nonExistingId}/offers/${offer.id}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`Company with id "${nonExistingId}" is not found!`);
      });
      it('should return error (offer not found)', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);

        const nonExistingId = '630473adaa90421c7c073d6e';
        const { body, status } = await server.delete(`/companies/${company.id}/offers/${nonExistingId}`).set({ 'auth-token': token });
        // response validation
        expect(status).to.be.equal(404);
        expect(body.message).to.be.equal(`Offer with id "${nonExistingId}" is not found!`);
        const offerInDb = await OfferService.getByIdInCompany(offer.id, company.id);
        expect(offerInDb).to.be.deep.equal(offer);
      });
    });
  });
});
