import { Types } from 'mongoose';
import { CompanyModel } from '../models/Company';
import { ICompany } from '../../interfaces';
import { DBNotFoundError } from '../../common';

export default class CompanyDbApi {
  public static async isExists(_id: Types.ObjectId): Promise<any> {
    return CompanyModel.exists({ _id });
  }

  /* CRUD */
  public static async createOne(companyData: ICompany): Promise<ICompany> {
    return CompanyModel.create(companyData).then((doc) => doc && doc.toObject());
  }

  public static async getById(id: Types.ObjectId): Promise<ICompany | null> {
    return CompanyModel.findById(id).then((doc) => doc && doc.toObject());
  }

  public static async getAll(): Promise<ICompany[]> {
    return CompanyModel.find().lean();
  }

  public static async updateById(id: Types.ObjectId, companyData: ICompany): Promise<ICompany | null> {
    return CompanyModel.findByIdAndUpdate(id, { $set: companyData }, { new: true })
      .then((doc) => doc && doc.toObject());
  }

  public static async deleteById(id: Types.ObjectId): Promise<ICompany | null> {
    return CompanyModel.findByIdAndDelete(id).then((doc) => doc && doc.toObject());
  }
  /* CRUD END */

  public static async isUserInCompany(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    return !!(await CompanyModel.findOne({ _id: companyId, 'employees.user': userId })
      .then((doc) => doc && doc.toObject()));
  }

  public static async isUserCompanyAdmin(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    return !!(await CompanyModel.findOne({ _id: companyId, 'employees.user': userId, 'employees.isAdmin': true })
      .then((doc) => doc && doc.toObject()));
  }

  public static async addUserToCompany(companyId: Types.ObjectId, user: Types.ObjectId, isAdmin: boolean): Promise<ICompany | null> {
    return CompanyModel.findByIdAndUpdate(companyId, { $push: { employees: { user, isAdmin } } }, { new: true })
      .then((doc) => doc && doc.toObject());
  }

  // public static async addUser(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompany | null> {
  //   return CompanyModel.findByIdAndUpdate(companyId, { $addToSet: { employees: userId } }).exec();
  // }

  // public static async removeUser(companyId: Types.ObjectId, userId: Types.ObjectId): Promise<ICompany | null> {
  //   return CompanyModel.findByIdAndUpdate(companyId, { $pull: { employees: userId } }).exec();
  // }
}
