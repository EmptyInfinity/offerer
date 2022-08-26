/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer } from '../databases/interfaces';
import OfferApi from '../databases/mongodb/api/OfferApi';

const dbPath = `../databases/${dbDir}`;
// const { default: OfferApi } = require(`${dbPath}/api/OfferApi`);

export default class OfferService {
  public static async isExists(id: any): Promise<boolean> {
    return OfferApi.isExists(id);
  }

  /* CRUD */
  public static async getByIdInCompany(id: any, companyId: any): Promise<IOffer> {
    const offerInCompany = await OfferApi.getByIdInCompany(id, companyId);
    if (!offerInCompany) {
      if (!await OfferService.isExists(id)) throw new NotFoundError(`Offer with id "${id}" is not found!`);
      throw new NotFoundError(`Company with id "${companyId}" is not found!`);
    }
    return offerInCompany;
  }

  public static async getAll(): Promise<IOffer[]> {
    return OfferApi.getAll();
  }

  public static createOne(offerData: IOffer, companyId: any): Promise<IOffer> {
    return OfferApi.createOne({ ...offerData, company: companyId });
  }

  public static async updateByIdInCompany(id: any, offerData: IOffer, companyId: any): Promise<IOffer> {
    const updatedOffer = await OfferApi.updateByIdInCompany(id, offerData, companyId);
    if (!updatedOffer) {
      if (!await OfferService.isExists(id)) throw new NotFoundError(`Offer with id "${id}" is not found!`);
      throw new NotFoundError(`Company with id "${companyId}" is not found!`);
    }
    return updatedOffer;
  }

  public static async deleteByIdInCompany(id: any, companyId: any): Promise<IOffer> {
    const deletedOffer = await OfferApi.deleteByIdInCompany(id, companyId);
    if (!deletedOffer) {
      if (!await OfferService.isExists(id)) throw new NotFoundError(`Offer with id "${id}" is not found!`);
      throw new NotFoundError(`Company with id "${companyId}" is not found!`);
    }
    return deletedOffer;
  }
  /* CRUD END */
}
