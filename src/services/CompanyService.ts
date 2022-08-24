/* eslint-disable import/no-dynamic-require */
import { NotFoundError, BadRequestError } from '../handlers/ApiError';
import { ICompany } from '../databases/interfaces';
import { DBDuplicatedFieldError, DBNotFoundError } from '../databases/common';

import UserApi from '../databases/mongodb/api/UserApi';
import OfferApi from '../databases/mongodb/api/OfferApi';
import InviteApi from '../databases/mongodb/api/InviteApi';
import CompanyApi from '../databases/mongodb/api/CompanyApi';
// const dbPath = `../databases/${dbDir}`;
// const { default: CompanyApi } = require(`${dbPath}/api/CompanyApi`);
// const { default: InviteApi } = require(`${dbPath}/api/InviteApi`);

export default class CompanyService {
  /* CRUD */
  public static async isExists(id: any): Promise<boolean> {
    return CompanyApi.isExists(id);
  }

  public static async getById(id: any): Promise<ICompany> {
    const company: ICompany = await CompanyApi.getById(id);
    if (!company) throw new NotFoundError(`Company with id "${id}" is not found!`);
    return company;
  }

  public static async getAll(): Promise<ICompany[]> {
    return CompanyApi.getAll();
  }

  public static async createOne(companyData: ICompany, creatorId: any): Promise<ICompany> {
    try {
      const company: ICompany = { ...companyData, employees: [{ user: creatorId, isAdmin: true }] };
      const insertedCompany = await CompanyApi.createOne(company);
      return { id: insertedCompany.id, ...company };
    } catch (error) {
      if (error instanceof DBDuplicatedFieldError) throw new BadRequestError(error.message);
      throw error;
    }
  }

  public static async updateById(id: any, companyData: ICompany): Promise<ICompany> {
    try {
      const updatedCompany = await CompanyApi.updateById(id, companyData);
      if (!updatedCompany) throw new NotFoundError(`Company with id "${id}" is not found!`);
      return updatedCompany;
    } catch (error) {
      if (error instanceof DBDuplicatedFieldError) throw new BadRequestError(error.message);
      throw error;
    }
  }

  public static async deleteById(id: any): Promise<ICompany> {
    const deletedCompany = await CompanyApi.deleteById(id);
    if (!deletedCompany) throw new NotFoundError(`Company with id "${id}" is not found!`);
    return deletedCompany;
  }
  /* CRUD END */

  public static async isUserInCompany(companyId: any, userId: any): Promise<boolean> {
    return CompanyApi.isUserInCompany(companyId, userId);
  }

  public static async isUserCompanyAdmin(companyId: any, userId: any): Promise<boolean> {
    return CompanyApi.isUserCompanyAdmin(companyId, userId);
  }

  // public static async inviteUser(companyId: any, userId: any): Promise<IInvite> {
  //   return InviteApi.createOne({ company: companyId, user: userId });
  // }

  // public static async addUser(companyId: any, userId: any): Promise<ICompany | null> {
  //   return CompanyApi.addUser(companyId, userId);
  // }

  // public static async removeUser(companyId: any, userId: any): Promise<ICompany | null> {
  //   return CompanyApi.removeUser(companyId, userId);
  // }
}
