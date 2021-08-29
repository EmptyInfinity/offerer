import { Types } from 'mongoose';
import { OfferModel } from '../models/Offer';
import { IOffer } from '../../interfaces';
import { normalized } from '../index';

export default class OfferDbApi {
  /* CRUD */
  public static async createOne(offerData: IOffer): Promise<IOffer> {
    return OfferModel.create(offerData);
  }

  public static async getById(id: Types.ObjectId): Promise<IOffer | undefined> {
    const offer: IOffer | undefined = await OfferModel.findById(id).lean<IOffer>();
    return normalized(offer);
  }

  public static async getAll(): Promise<IOffer[]> {
    const companies: IOffer[] = await OfferModel.find().lean<IOffer>();
    return companies.map((offer: IOffer) => normalized(offer));
  }

  public static async updateById(id: Types.ObjectId, offerData: IOffer): Promise<IOffer | null> {
    return OfferModel.findByIdAndUpdate(id, { $set: offerData }).exec();
  }

  public static async deleteById(id: Types.ObjectId): Promise<IOffer> {
    return OfferModel.findByIdAndDelete(id).exec();
  }
  /* CRUD END */
}
