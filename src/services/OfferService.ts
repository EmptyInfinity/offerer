/* eslint-disable import/no-dynamic-require */
import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
const { default: OfferApi } = require(`${dbPath}/api/OfferApi`);

export default class OfferService {
  /* CRUD */
  public static async getById(id: any): Promise<IOffer> {
    const offer: IOffer | null = await OfferApi.getById(id);
    if (!offer) throw new NotFoundError('Offer not found!');
    return offer;
  }

  public static getAll(): Promise<IOffer[]> {
    return OfferApi.getAll();
  }

  public static createOne(offerData: IOffer): Promise<IOffer> {
    return OfferApi.createOne(offerData);
  }

  public static updateById(id: any, offerData: IOffer): Promise<IOffer | null> {
    return OfferApi.updateById(id, offerData);
  }

  public static deleteById(id: any): Promise<IOffer> {
    return OfferApi.deleteById(id);
  }
  /* CRUD END */
}
