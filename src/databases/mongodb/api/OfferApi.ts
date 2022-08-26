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

  public static async getByIdInCompany(id: Types.ObjectId, companyId: Types.ObjectId): Promise<IOffer | null> {
    return OfferModel.findOne({ _id: id, company: companyId }).then((doc) => doc && doc.toObject());
  }

  public static async getAll(): Promise<IOffer[]> {
    return OfferModel.find().lean();
  }

  public static async updateByIdInCompany(id: Types.ObjectId, offerData: IOffer, companyId: Types.ObjectId): Promise<IOffer | null> {
    return OfferModel.findOneAndUpdate({ _id: id, company: companyId }, { $set: offerData }, { new: true }).then((doc) => doc && doc.toObject());
  }

  public static async deleteByIdInCompany(id: Types.ObjectId, companyId: Types.ObjectId): Promise<IOffer | null> {
    return OfferModel.findOneAndDelete({ _id: id, company: companyId }).then((doc) => doc && doc.toObject());
  }

  public static async deleteAllByCompanyId(companyId: Types.ObjectId): Promise<any> {
    return OfferModel.deleteMany({ company: companyId });
  }
  /* CRUD END */
}
