import { Types } from 'mongoose';
import { InviteModel } from '../models/Invite';
import { IInvite } from '../../interfaces';

export default class CompanyInvoiceDbApi {
  public static async isExists(_id: Types.ObjectId): Promise<any> {
    return InviteModel.exists({ _id });
  }

  /* CRUD */
  public static async createOne(offerData: IInvite): Promise<IInvite> {
    return InviteModel.create(offerData).then((doc) => doc && doc.toObject());
  }

  public static async getById(id: Types.ObjectId): Promise<IInvite | null> {
    return InviteModel.findById(id).then((doc) => doc && doc.toObject());
  }

  public static async getAll(): Promise<IInvite[]> {
    return InviteModel.find().lean();
  }

  public static async deleteById(id: Types.ObjectId): Promise<IInvite | null> {
    return InviteModel.findByIdAndDelete(id).then((doc) => doc && doc.toObject());
  }
  /* CRUD END */
}
