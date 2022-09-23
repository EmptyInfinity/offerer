import { expect } from 'chai';
import request from 'supertest';
import CompanyService from '../../src/services/CompanyService';
import UserService from '../../src/services/UserService';
import OfferService from '../../src/services/OfferService';
import InviteService from '../../src/services/InviteService';
import { formCompany, formUser, formOffer } from '../helper';
import getApp from '../../src/app';

describe('inviteRoute', () => {
  let server: any;
  // eslint-disable-next-line no-undef
  before(async () => {
    server = request(await getApp());
  });
  describe('/POST', () => {
    describe.only('/companies/:companyId/invites', () => {
      describe('inviter: company', () => {
        it('should add invite', async () => {
          const { user, token } = await UserService.createOne(formUser({}));
          const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, user.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const invite = {
            inviter: 'company',
            user: userToInvite.id,
            offer: offer.id,
          };

          const { body: resInvite, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(200);
          const { expireDate: dateInResponse } = resInvite;
          delete resInvite.expireDate;
          expect(resInvite).to.be.deep.equal({
            ...invite,
            id: resInvite.id,
            company: company.id,
          });

          // DB validation
          const inviteInDb = await InviteService.getById(resInvite.id);
          const { expireDate: dateInDB } = inviteInDb;
          delete inviteInDb.expireDate;
          expect(dateInDB).to.be.instanceOf(Date);
          expect(new Date(dateInDB).getTime()).to.be.equal(new Date(dateInResponse).getTime());
          expect(inviteInDb).to.be.deep.equal(resInvite);
        });
        it('should return error, company not found', async () => {
          const { user, token } = await UserService.createOne(formUser({}));
          const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, user.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const invite = {
            inviter: 'company',
            user: userToInvite.id,
            offer: offer.id,
          };

          const nonExistingId = '630473adaa90421c7c073d6e';
          const { body, status } = await server.post(`/companies/${nonExistingId}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(404);
          expect(body.message).to.be.equal(`Company with id "${nonExistingId}" is not found!`);

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
        it('should return error, offer not found', async () => {
          const { user, token } = await UserService.createOne(formUser({}));
          const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, user.id);
          const nonExistingId = '630473adaa90421c7c073d6e';
          const invite = {
            inviter: 'company',
            user: userToInvite.id,
            offer: nonExistingId,
          };

          const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(404);
          expect(body.message).to.be.equal(`Offer with id "${nonExistingId}" is not found!`);

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
        it('should return error, targetUser not found', async () => {
          const { user, token } = await UserService.createOne(formUser({}));

          const company = await CompanyService.createOne(formCompany({}) as any, user.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const nonExistingId = '630473adaa90421c7c073d6e';
          const invite = {
            inviter: 'company',
            user: nonExistingId,
            offer: offer.id,
          };

          const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(404);
          expect(body.message).to.be.equal(`User with id "${nonExistingId}" is not found!`);

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
        it('should return error, user already in company', async () => {
          const { user, token } = await UserService.createOne(formUser({}));
          const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, user.id);
          await CompanyService.addUserToCompany(company.id, userToInvite.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const invite = {
            inviter: 'company',
            user: userToInvite.id,
            offer: offer.id,
          };

          const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(403);
          expect(body.message).to.be.equal('User already belongs company!');

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
      });
      describe('inviter: user', () => {
        it('should add invite', async () => {
          const { user: companyAdmin } = await UserService.createOne(formUser({}));
          const { user, token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, companyAdmin.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const invite = {
            inviter: 'user',
            user: user.id,
            offer: offer.id,
          };

          const { body: resInvite, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(200);
          const { expireDate: dateInResponse } = resInvite;
          delete resInvite.expireDate;
          expect(resInvite).to.be.deep.equal({
            ...invite,
            id: resInvite.id,
            company: company.id,
          });

          // DB validation
          const inviteInDb = await InviteService.getById(resInvite.id);
          const { expireDate: dateInDB } = inviteInDb;
          delete inviteInDb.expireDate;
          expect(dateInDB).to.be.instanceOf(Date);
          expect(new Date(dateInDB).getTime()).to.be.equal(new Date(dateInResponse).getTime());
          expect(inviteInDb).to.be.deep.equal(resInvite);
        });
        it('should return error, inviter: user, company not found', async () => {
          const { user: companyAdmin } = await UserService.createOne(formUser({}));
          const { user, token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, companyAdmin.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const invite = {
            inviter: 'user',
            user: user.id,
            offer: offer.id,
          };

          const nonExistingId = '630473adaa90421c7c073d6e';
          const { body, status } = await server.post(`/companies/${nonExistingId}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(404);
          expect(body.message).to.be.equal(`Company with id "${nonExistingId}" is not found!`);

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
        it('should return error, inviter: user, offer not found', async () => {
          const { user: companyAdmin } = await UserService.createOne(formUser({}));
          const { user, token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, companyAdmin.id);
          const nonExistingId = '630473adaa90421c7c073d6e';
          const invite = {
            inviter: 'user',
            user: user.id,
            offer: nonExistingId,
          };

          const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(404);
          expect(body.message).to.be.equal(`Offer with id "${nonExistingId}" is not found!`);

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
        it('should return error, user already in company', async () => {
          const { user: companyAdmin } = await UserService.createOne(formUser({}));
          const { user, token } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

          const company = await CompanyService.createOne(formCompany({}) as any, companyAdmin.id);
          await CompanyService.addUserToCompany(company.id, user.id);
          const offer = await OfferService.createOne(formOffer({}) as any, company.id);
          const invite = {
            inviter: 'user',
            user: user.id,
            offer: offer.id,
          };

          const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send(invite);
          // response validation
          expect(status).to.be.equal(403);
          expect(body.message).to.be.equal('User already belongs company!');

          // DB validation
          const invitesInDb = await InviteService.getAll();
          expect(invitesInDb.length).to.be.equal(0);
        });
      });
      it('should return error, only company admin can invite users', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token: notCompanyAdminToken } = await UserService.createOne({
          name: 'us1', email: 'user2@email.com', password: 'secure', admin: true,
        });
        const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);
        const invite = {
          inviter: 'company',
          user: userToInvite.id,
          offer: offer.id,
        };

        const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': notCompanyAdminToken }).send(invite);
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');

        // DB validation
        const invitesInDb = await InviteService.getAll();
        expect(invitesInDb).to.be.deep.equal([]);
      });
      it('should return error, only company admin can invite users', async () => {
        const { user } = await UserService.createOne(formUser({}));
        const { token: notCompanyAdminToken } = await UserService.createOne({
          name: 'us1', email: 'user2@email.com', password: 'secure',
        });
        const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);
        const invite = {
          inviter: 'company',
          user: userToInvite.id,
          offer: offer.id,
        };

        const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': notCompanyAdminToken }).send(invite);
        // response validation
        expect(status).to.be.equal(403);
        expect(body.message).to.be.equal('Permission denied');

        // DB validation
        const invitesInDb = await InviteService.getAll();
        expect(invitesInDb).to.be.deep.equal([]);
      });
      it('should throw error, missing required field', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const company = await CompanyService.createOne(formCompany({}) as any, user.id);

        const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send({});
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"offer" is required');

        // DB validation
        const invitesInDb = await InviteService.getAll();
        expect(invitesInDb.length).to.be.equal(0);
      });
      it('should throw error, extra field', async () => {
        const { user, token } = await UserService.createOne(formUser({}));
        const { user: userToInvite } = await UserService.createOne({ name: 'us', email: 'user@email.com', password: 'secure' });

        const company = await CompanyService.createOne(formCompany({}) as any, user.id);
        const offer = await OfferService.createOne(formOffer({}) as any, company.id);
        const invite = {
          inviter: 'company',
          user: userToInvite.id,
          offer: offer.id,
        };

        const { body, status } = await server.post(`/companies/${company.id}/invites`).set({ 'auth-token': token }).send({ ...invite, a: 22 });
        // response validation
        expect(status).to.be.equal(400);
        expect(body.message).to.be.equal('"a" is not allowed');

        // DB validation
        const invitesInDb = await InviteService.getAll();
        expect(invitesInDb.length).to.be.equal(0);
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
        const offerInDb = await OfferService.getById(offer.id);
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
        const offerInDb = await OfferService.getById(offer.id);
        expect(offerInDb).to.be.deep.equal(offer);
      });
    });
  });
});
