import { Types } from 'mongoose';
import { InviteModel } from '../models/Invite';
import { IInvite } from '../../interfaces';
import { toJS } from '../index';

export default class CompanyInvoiceDbApi {
  /* CRUD */
  // public static async createOne(companyInviteData: IInvite): Promise<IInvite> {
  //   return InviteModel.create(companyInviteData);
  // }

  // public static async getById(id: Types.ObjectId): Promise<IInvite | undefined> {
  //   const companyInvoice: IInvite | undefined = await InviteModel.findById(id).lean();
  //   console.time('normalized');
  //   const a = normalized(companyInvoice);
  //   console.timeEnd('normalized');
  //   return a;
  // }

  // public static async getOne(searchData: object): Promise<IInvite | undefined> {
  //   const companyInvoice: IInvite | undefined = await InviteModel.findOne(searchData).lean();
  //   return normalized(companyInvoice);
  // }

  // public static async deleteById(id: Types.ObjectId): Promise<IInvite> {
  //   return InviteModel.findByIdAndDelete(id).exec();
  // }

  // public static async getAll(): Promise<IInvite[]> {
  //   const companyInvites: IInvite[] = await InviteModel.find().lean();
  //   return companyInvites.map((invite: IInvite) => normalized(invite));
  // }
  /* CRUD END */
}
