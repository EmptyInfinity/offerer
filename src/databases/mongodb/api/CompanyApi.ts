import { Types } from 'mongoose';
import { CompanyModel } from '../models/Company';
import { ICompany } from '../../interfaces';
import { normalized } from '../index';

export default class CompanyDbApi {
  /* CRUD */
  public static async createOne(companyData: ICompany): Promise<ICompany> {
    return CompanyModel.create(companyData);
  }

  public static async getById(id: Types.ObjectId): Promise<ICompany | undefined> {
    const company: ICompany | undefined = await CompanyModel.findById(id).lean<ICompany>();
    return normalized(company);
  }

  public static async getAll(): Promise<ICompany[]> {
    const companies: ICompany[] = await CompanyModel.find().lean();
    return companies.map((company: ICompany) => normalized(company));
  }

  public static async updateById(id: Types.ObjectId, companyData: ICompany): Promise<ICompany | null> {
    return CompanyModel.findByIdAndUpdate(id, { $set: companyData }).exec();
  }

  public static async deleteById(id: Types.ObjectId): Promise<ICompany> {
    return CompanyModel.findByIdAndDelete(id).exec();
  }
  /* CRUD END */

  public static async addUser(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompany | null> {
    return CompanyModel.findByIdAndUpdate(companyId, { $addToSet: { workers: userId } }).exec();
  }

  public static async removeUser(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompany | null> {
    return CompanyModel.findByIdAndUpdate(companyId, { $pull: { workers: userId } }).exec();
  }
}
