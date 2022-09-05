/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IInvite } from '../databases/interfaces';

// const dbPath = `../databases/${dbDir}`;
// const { default: InviteApi } = require(`${dbPath}/api/InviteApi`);
import InviteApi from '../databases/mongodb/api/InviteApi';

const INVITE_LIVE_TIME_IN_DAYS = 3;

export default class InviteService {
  public static async isExists(id: any): Promise<boolean> {
    return InviteApi.isExists(id);
  }

  /* CRUD */
  public static async getById(id: any): Promise<IInvite> {
    const invite = await InviteApi.getById(id);
    if (!invite) throw new NotFoundError(`Invite with id "${id}" is not found!`);
    return invite;
  }

  public static async getAll(): Promise<IInvite[]> {
    return InviteApi.getAll();
  }

  public static async createOne(offerData: any, companyId: any): Promise<IInvite> {
    const dateNow = new Date();
    const expireDate = dateNow.setDate(dateNow.getDate() + INVITE_LIVE_TIME_IN_DAYS);
    return InviteApi.createOne({ ...offerData, company: companyId, expireDate });
  }

  public static async deleteById(id: any): Promise<IInvite> {
    const deletedInvite = await InviteApi.deleteById(id);
    if (!deletedInvite) throw new NotFoundError(`Invite with id "${id}" is not found!`);
    return deletedInvite;
  }
  /* CRUD END */
}
