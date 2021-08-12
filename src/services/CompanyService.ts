import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { ICompany } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const CompanyApi = require(`${dbPath}/api/CompanyApi`).default;

export default class CompanyService {
  /* CRUD */
  public static async getById(id: any): Promise<ICompany | undefined> {
    const company: ICompany | undefined = await CompanyApi.getById(id);
    if (!company) throw new NotFoundError('Company not found!');
    return company;
  }

  public static getAll(): Promise<ICompany[]> {
    return CompanyApi.getAll();
  }

  public static createOne(companyData: ICompany): Promise<ICompany> {
    return CompanyApi.createOne(companyData);
  }

  public static updateById(id: any, companyData: ICompany): Promise<ICompany> {
    return CompanyApi.updateById(id, companyData);
  }

  public static deleteById(id: any): Promise<ICompany> {
    return CompanyApi.deleteById(id);
  }
  /* CRUD END */
}
