/* eslint-disable import/no-dynamic-require */
import { genSalt, hash } from 'bcrypt';
import { NotFoundError, ForbiddenError, BadRequestError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer, IUser } from '../databases/interfaces';
import { createToken } from '../helpers';
import CompanyService from './CompanyService';
import { DuplicatedFieldError } from '../databases/common';

// import UserApi from '../databases/mongodb/api/UserApi';
// import OfferApi from '../databases/mongodb/api/OfferApi';
// import InviteApi from '../databases/mongodb/api/InviteApi';
const dbPath = `../databases/${dbDir}`;
const { default: UserApi } = require(`${dbPath}/api/UserApi`);
const { default: OfferApi } = require(`${dbPath}/api/OfferApi`);
const { default: InviteApi } = require(`${dbPath}/api/InviteApi`);

export default class UserService {
  /* CRUD */
  public static async getById(id: any): Promise<IUser | null> {
    const user: IUser | undefined = await UserApi.getById(id);
    if (!user) throw new NotFoundError('User not found!');
    return user;
  }

  public static getAll(): Promise<IUser[]> {
    return UserApi.getAll();
  }

  public static async createOne(userData: any): Promise<{ user: IUser, token: string }> {
    try {
      const password = await this.hashPassword(userData.password);
      const insertedUser = await UserApi.createOne({ ...userData, password });
      const token = createToken(insertedUser.id);
      delete insertedUser.password;
      return { user: insertedUser, token };
    } catch (error) {
      if (error instanceof DuplicatedFieldError) {
        throw new BadRequestError(error.message);
      }
      throw error;
    }
  }

  public static updateById(id: any, userData: IUser): Promise<IUser | null> {
    return UserApi.updateById(id, userData);
  }

  public static deleteById(id: any): Promise<IUser> {
    return UserApi.deleteById(id);
  }
  /* CRUD END */

  public static async getUserByEmailWithPassword(email: string): Promise<IUser | null> {
    return UserApi.getUserByEmailWithPassword(email);
  }

  public static deleteAll(): Promise<any> {
    return UserApi.deleteAll();
  }

  // public static async joinCompany(userId: any, companyId: any): Promise<IUser | null> {
  //   const invite = await InviteApi.getOne({ user: userId, company: companyId });
  //   if (!invite) throw new ForbiddenError();
  //   // await CompanyService.addUser(companyId, userId);
  //   await InviteApi.deleteById(invite.id);
  //   return UserApi.joinCompany(userId, companyId);
  // }

  // public static async leaveCompany(user: IUser): Promise<IUser | null> {
  // await CompanyService.removeUser(user.company.id, user.id);
  // return UserApi.updateById(user.id, { company: null });
  // }

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
