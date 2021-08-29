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

  public static async getAll(): Promise<ICompany[]> {
    return CompanyApi.getAll();
  }

  public static async createOne(companyData: ICompany): Promise<ICompany> {
    return CompanyApi.createOne(companyData);
  }

  public static async updateById(id: any, companyData: ICompany): Promise<ICompany | null> {
    return CompanyApi.updateById(id, companyData);
  }

  public static async deleteById(id: any): Promise<ICompany> {
    return CompanyApi.deleteById(id);
  }
  /* CRUD END */

  public static async inviteUser(companyId: any, userId: any): Promise<ICompanyInvite> {
    return CompanyInviteApi.createOne({ company: companyId, user: userId });
  }

  public static async addUser(companyId: any, userId: any): Promise<ICompany | null> {
    return CompanyApi.addUser(companyId, userId);
  }

  public static async removeUser(companyId: any, userId: any): Promise<ICompany | null> {
    return CompanyApi.removeUser(companyId, userId);
  }
}
