/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IInvite } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
const { default: InviteApi } = require(`${dbPath}/api/InviteApi`);

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

  public static async createOne(offerId: any, userId: any, inviteData: IInvite): Promise<IInvite> {
    return InviteApi.createOne(offerId, userId, inviteData.inviter);
  }

  public static async deleteById(id: any): Promise<IInvite> {
    const deletedInvite = await InviteApi.deleteById(id);
    if (!deletedInvite) throw new NotFoundError(`Invite with id "${id}" is not found!`);
    return deletedInvite;
  }
  /* CRUD END */
}
