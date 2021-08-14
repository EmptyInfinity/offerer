import { Types } from 'mongoose';
import { CompanyInviteModel } from '../models/CompanyInvite';
import { ICompanyInvite } from '../../interfaces';
import { normalized } from '../index';

export default class CompanyInvoiceDbApi {
  /* CRUD */
  public static createOne(companyInviteData: ICompanyInvite): Promise<ICompanyInvite> {
    return CompanyInviteModel.create(companyInviteData);
  }

  public static async getById(id: Types.ObjectId): Promise<ICompanyInvite | undefined> {
    const companyInvoice: ICompanyInvite | undefined = await CompanyInviteModel.findById(id).lean<ICompanyInvite>();
    return normalized(companyInvoice);
  }

  public static async getOne(searchData: object): Promise<ICompanyInvite | undefined> {
    const companyInvoice: ICompanyInvite | undefined = await CompanyInviteModel.findOne(searchData).lean<ICompanyInvite>();
    return normalized(companyInvoice);
  }

  public static deleteById(id: Types.ObjectId): Promise<ICompanyInvite> {
    return CompanyInviteModel.findByIdAndDelete(id).exec();
  }

  public static async getAll(): Promise<ICompanyInvite[]> {
    const companyInvites: ICompanyInvite[] = await CompanyInviteModel.find().lean<ICompanyInvite>();
    return companyInvites.map((invite: ICompanyInvite) => normalized(invite));
  }
  /* CRUD END */
}
