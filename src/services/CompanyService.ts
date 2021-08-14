/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { ICompany, ICompanyInvite } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
const { default: CompanyApi } = require(`${dbPath}/api/CompanyApi`);
const { default: CompanyInviteApi } = require(`${dbPath}/api/CompanyInviteApi`);

export default class CompanyService {
  /* CRUD */
  public static async getById(id: any): Promise<ICompany | undefined> {
    const company: ICompany | undefined = await CompanyApi.getById(id);
    if (!company) throw new NotFoundError('Company not found!');
    return company;
  }

  public static getAll(): Promise<ICompany[]> {
    return CompanyApi.getAll();
  }

  public static createOne(companyData: ICompany): Promise<ICompany> {
    return CompanyApi.createOne(companyData);
  }

  public static updateById(id: any, companyData: ICompany): Promise<ICompany> {
    return CompanyApi.updateById(id, companyData);
  }

  public static deleteById(id: any): Promise<ICompany> {
    return CompanyApi.deleteById(id);
  }
  /* CRUD END */

  public static inviteUserToCompany(userId: any, companyId:any): Promise<ICompanyInvite> {
    return CompanyInviteApi.createOne({ userId, companyId });
  }
}
