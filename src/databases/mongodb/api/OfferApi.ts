import { Types } from 'mongoose';
import { OfferModel } from '../models/Offer';
import { IOffer } from '../../interfaces';

export default class OfferDbApi {
  public static async isExists(_id: Types.ObjectId): Promise<any> {
    return OfferModel.exists({ _id });
  }

  /* CRUD */
  public static async createOne(offerData: IOffer): Promise<IOffer> {
    return OfferModel.create(offerData).then((doc) => doc && doc.toObject());
  }

  public static async getById(id: Types.ObjectId): Promise<IOffer | null> {
    return OfferModel.findById(id).then((doc) => doc && doc.toObject());
  }

  public static async getAll(): Promise<IOffer[]> {
    return OfferModel.find().lean();
  }

  public static async updateById(id: Types.ObjectId, offerData: IOffer): Promise<IOffer | null> {
    return OfferModel.findByIdAndUpdate(id, { $set: offerData }, { new: true }).then((doc) => doc && doc.toObject());
  }

  public static async deleteById(id: Types.ObjectId): Promise<IOffer | null> {
    return OfferModel.findByIdAndDelete(id).then((doc) => doc && doc.toObject());
  }

  public static async deleteAllInCompany(companyId: Types.ObjectId): Promise<any> {
    return OfferModel.deleteMany({ company: companyId });
  }
  /* CRUD END */
}
