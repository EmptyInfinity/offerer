/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IInvite } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
const { default: InviteApi } = require(`${dbPath}/api/InviteApi`);

export default class InviteService {
  /* CRUD */
  public static async getById(id: any): Promise<IInvite> {
    const companyInvite: IInvite | null = await InviteApi.getById(id);
    if (!companyInvite) throw new NotFoundError('Invite not found!');
    return companyInvite;
  }

  public static getAll(): Promise<IInvite[]> {
    return InviteApi.getAll();
  }

  public static createOne(companyInviteData: IInvite): Promise<IInvite> {
    return InviteApi.createOne(companyInviteData);
  }

  public static updateById(id: any, companyInviteData: IInvite): Promise<IInvite | null> {
    return InviteApi.updateById(id, companyInviteData);
  }

  public static deleteById(id: any): Promise<IInvite> {
    return InviteApi.deleteById(id);
  }
  /* CRUD END */
}
