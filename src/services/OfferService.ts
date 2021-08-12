import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IOffer } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const OfferApi = require(`${dbPath}/api/OfferApi`).default;

export default class OfferService {
  /* CRUD */
  public static async getById(id: any): Promise<IOffer | undefined> {
    const offer: IOffer | undefined = await OfferApi.getById(id);
    if (!offer) throw new NotFoundError('Offer not found!');
    return offer;
  }

  public static getAll(): Promise<IOffer[]> {
    return OfferApi.getAll();
  }

  public static createOne(offerData: IOffer): Promise<IOffer> {
    return OfferApi.createOne(offerData);
  }

  public static updateById(id: any, offerData: IOffer): Promise<IOffer> {
    return OfferApi.updateById(id, offerData);
  }

  public static deleteById(id: any): Promise<IOffer> {
    return OfferApi.deleteById(id);
  }
  /* CRUD END */
}
