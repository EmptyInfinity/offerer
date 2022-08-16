import { Types } from 'mongoose';
import { CompanyModel } from '../models/Company';
import { ICompany } from '../../interfaces';

export default class CompanyDbApi {
  public static async isExists(_id: Types.ObjectId): Promise<any> {
    return CompanyModel.exists({ _id });
  }

  /* CRUD */
  public static async createOne(companyData: ICompany): Promise<ICompany> {
    return CompanyModel.create(companyData).then((doc) => doc && doc.toObject());
  }

  public static async getById(id: Types.ObjectId): Promise<any> {
    return CompanyModel.findById(id).then((doc) => doc && doc.toObject());
  }

  public static async getAll(): Promise<ICompany[]> {
    // const companies: ICompany[] = await CompanyModel.find().lean();
    // return companies.map((company: ICompany) => normalized(company));
    return CompanyModel.find().lean();
  }

  public static async updateById(id: Types.ObjectId, companyData: ICompany): Promise<ICompany | null> {
    return CompanyModel.findByIdAndUpdate(id, { $set: companyData }, { new: true }).exec();
  }

  public static async deleteById(id: Types.ObjectId): Promise<ICompany | null> {
    return CompanyModel.findByIdAndDelete(id).exec();
  }
  /* CRUD END */

  public static async isUserInCompany(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    return !!(await CompanyModel.findOne({ id: companyId, 'employees.user': userId }).lean());
  }

  public static async isUserCompanyAdmin(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    return !!(await CompanyModel.findOne({ id: companyId, 'employees.user': userId, 'employees.isAdmin': true }).lean());
  }

  // public static async addUser(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompany | null> {
  //   return CompanyModel.findByIdAndUpdate(companyId, { $addToSet: { employees: userId } }).exec();
  // }

  // public static async removeUser(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompany | null> {
  //   return CompanyModel.findByIdAndUpdate(companyId, { $pull: { employees: userId } }).exec();
  // }
}
