/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer, IUser } from '../databases/interfaces';
import OfferService from './OfferService';

const dbPath = `../databases/${dbDir}`;
const { default: UserApi } = require(`${dbPath}/api/UserApi`);

export default class UserService {
  /* CRUD */
  public static async getById(id: any): Promise<IUser | undefined> {
    const user: IUser | undefined = await UserApi.getById(id);
    if (!user) throw new NotFoundError('User not found!');
    return user;
  }

  public static getAll(): Promise<IUser[]> {
    return UserApi.getAll();
  }

  public static async createOne(userData: IUser): Promise<IUser> {
    userData.password = 'new secure password';
    const user = await UserApi.createOne({ ...userData, offers: [] });
    const savedOffersIds: any[] = [];
    const { offers } = userData;
    await Promise.all(offers.map(async (offer: IOffer) => {
      const { id } = await OfferService.createOne(offer);
      savedOffersIds.push(id);
    }));
    return UserApi.updateById(user.id, { offers: savedOffersIds });
  }

  public static updateById(id: any, userData: IUser): Promise<IUser | null> {
    return UserApi.updateById(id, userData);
  }

  public static deleteById(id: any): Promise<IUser> {
    return UserApi.deleteById(id);
  }
  /* CRUD END */

  public static deleteAll(): Promise<any> {
    return UserApi.deleteAll();
  }

  public static joinCompany(userId: any, companyId: any): Promise<any> {
    // here should be validation. There is should be a collection "Invites", where are
    // invitations are stored. If user has invitation to company => validation passed
    return UserApi.joinCompany(userId, companyId);
  }
}
