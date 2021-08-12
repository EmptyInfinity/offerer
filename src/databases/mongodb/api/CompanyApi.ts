import { Types } from 'mongoose';
import { CompanyModel } from '../models/Company';
import { ICompany } from '../../interfaces';
import { normalized } from '../index';

export default class CompanyDbApi {
  /* CRUD */
  public static createOne(companyData: ICompany): Promise<ICompany> {
    const company = new CompanyModel(companyData);
    return CompanyModel.create(company);
  }

  public static async getById(id: Types.ObjectId): Promise<ICompany | undefined> {
    const company: ICompany | undefined = await CompanyModel.findById(id).lean<ICompany>();
    return normalized(company);
  }

  public static async getAll(): Promise<ICompany[]> {
    const companies: ICompany[] = await CompanyModel.find().lean<ICompany>();
    return companies.map((company: ICompany) => normalized(company));
  }

  public static updateById(id: Types.ObjectId, companyData: ICompany): Promise<ICompany> {
    return CompanyModel.findByIdAndUpdate(id, { $set: companyData }).exec();
  }

  public static deleteById(id: Types.ObjectId): Promise<ICompany> {
    return CompanyModel.findByIdAndDelete(id).exec();
  }
  /* CRUD END */
}
