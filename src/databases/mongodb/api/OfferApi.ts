import { Types } from 'mongoose';
import { OfferModel } from '../models/Offer';
import { IOffer } from '../../interfaces';

export default class OfferDbApi {
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
    return OfferModel.findByIdAndUpdate(id, { $set: offerData }).then((doc) => doc && doc.toObject());
  }

  public static async deleteById(id: Types.ObjectId): Promise<IOffer | null> {
    return OfferModel.findByIdAndDelete(id).then((doc) => doc && doc.toObject());
  }
  /* CRUD END */
}
