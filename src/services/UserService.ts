/* eslint-disable import/no-dynamic-require */
import { genSalt, hash } from 'bcrypt';
import { NotFoundError, ForbiddenError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer, IUser } from '../databases/interfaces';
import { createToken } from '../helpers';
import CompanyService from './CompanyService';

const dbPath = `../databases/${dbDir}`;
const { default: UserApi } = require(`${dbPath}/api/UserApi`);
const { default: OfferApi } = require(`${dbPath}/api/OfferApi`);
const { default: CompanyInviteApi } = require(`${dbPath}/api/CompanyInviteApi`);

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

  public static async createOne(userData: IUser): Promise<{user:IUser, token: string}> {
    const password = await this.hashPassword(userData.password);
    const insertedUser = await UserApi.createOne({ ...userData, password });
    const token = createToken(insertedUser.id);
    const user: IUser = { id: insertedUser.id, offers: [], ...userData };
    delete user.password;
    return { user, token };
  }

  public static updateById(id: any, userData: IUser): Promise<IUser | null> {
    return UserApi.updateById(id, userData);
  }

  public static deleteById(id: any): Promise<IUser> {
    return UserApi.deleteById(id);
  }
  /* CRUD END */

  public static async getUserByEmailWithPassword(email: string): Promise<IUser | undefined> {
    return UserApi.getUserByEmailWithPassword(email);
  }

  public static deleteAll(): Promise<any> {
    return UserApi.deleteAll();
  }

  public static async joinCompany(userId: any, companyId: any): Promise<IUser | null> {
    const invite = await CompanyInviteApi.getOne({ user: userId, company: companyId });
    if (!invite) throw new ForbiddenError();
    await CompanyService.addUser(companyId, userId);
    await CompanyInviteApi.deleteById(invite.id);
    return UserApi.joinCompany(userId, companyId);
  }

  public static async leaveCompany(user: IUser): Promise<IUser | null> {
    await CompanyService.removeUser(user.company.id, user.id);
    return UserApi.updateById(user.id, { company: null });
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    return hash(password, salt);
  }

  private static async saveUserOffers(offers: IOffer[]): Promise<any[]> {
    const savedOffersIds: any[] = [];
    await Promise.all(offers.map(async (offer: IOffer) => {
      const { id } = await OfferApi.createOne(offer);
      savedOffersIds.push(id);
    }));
    return savedOffersIds;
  }
}
