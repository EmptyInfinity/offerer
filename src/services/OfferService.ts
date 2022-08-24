/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
const { default: OfferApi } = require(`${dbPath}/api/OfferApi`);

export default class OfferService {
  /* CRUD */
  public static async getById(id: any): Promise<IOffer> {
    const offer = await OfferApi.getById(id);
    if (!offer) throw new NotFoundError(`Offer with id "${id}" is not found!`);
    return offer;
  }

  public static createOne(offerData: IOffer, companyId: any): Promise<IOffer> {
    return OfferApi.createOne({ ...offerData, company: companyId });
  }

  public static async updateById(id: any, offerData: IOffer): Promise<IOffer> {
    const updatedOffer = await OfferApi.updateById(id, offerData);
    if (!updatedOffer) throw new NotFoundError(`Company with id "${id}" is not found!`);
    return updatedOffer;
  }

  public static async deleteById(id: any): Promise<IOffer> {
    const deletedOffer = await OfferApi.deleteById(id);
    if (!deletedOffer) throw new NotFoundError(`Company with id "${id}" is not found!`);
    return deletedOffer;
  }
  /* CRUD END */
}
