import { expect } from 'chai';
import { IUser } from '../../src/databases/interfaces';
import { USER_ROLE, OFFER_NAME } from '../../src/config';
import UserService from '../../src/services/UserService';
import OfferService from '../../src/services/OfferService';

describe('userRoute', () => {
  describe('/POST', () => {
    it('should add user', async () => {
      const user: IUser = {
        name: 'username',
        email: 'username@gmail.com',
        role: USER_ROLE.user,
        offers: [],
        password: 'Password1',
      };

      // request validation
      const { body, status } = await global.server.post('/users').send(user);
      expect(status).to.be.equal(200);
      user.id = body.id;
      delete user.password;
      expect(body).to.be.deep.equal(user);

      // DB validation
      const userInDb = await UserService.getById(user.id);
      const offersInDb = await OfferService.getAll();
      expect(userInDb).to.be.deep.equal(user);
      expect(offersInDb).to.have.same.members([]);
    });
  });
});
