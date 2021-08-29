/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { ICompanyInvite } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
const { default: CompanyInviteApi } = require(`${dbPath}/api/CompanyInviteApi`);

export default class CompanyInviteService {
  /* CRUD */
  public static async getById(id: any): Promise<ICompanyInvite | undefined> {
    const companyInvite: ICompanyInvite | undefined = await CompanyInviteApi.getById(id);
    if (!companyInvite) throw new NotFoundError('CompanyInvite not found!');
    return companyInvite;
  }

  public static getAll(): Promise<ICompanyInvite[]> {
    return CompanyInviteApi.getAll();
  }

  public static createOne(companyInviteData: ICompanyInvite): Promise<ICompanyInvite> {
    return CompanyInviteApi.createOne(companyInviteData);
  }

  public static updateById(id: any, companyInviteData: ICompanyInvite): Promise<ICompanyInvite | null> {
    return CompanyInviteApi.updateById(id, companyInviteData);
  }

  public static deleteById(id: any): Promise<ICompanyInvite> {
    return CompanyInviteApi.deleteById(id);
  }
  /* CRUD END */
}
