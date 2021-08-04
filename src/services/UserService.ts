import { NotFoundError } from '../handlers/ApiError';
import { dbDir } from '../config';
import { IUser } from '../databases/interfaces';

const dbPath = `../databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const UserApi = require(`${dbPath}/api/UserApi`).default;

export default class UserService {
  public static async getById(id: any): Promise<IUser | null> {
    const user = await UserApi.getById(id);
    if (!user) throw new NotFoundError('User not found!');
    return user;
  }

  public static async getAll(): Promise<IUser[]> {
    return UserApi.getAll();
  }

  public static async createOne(userData: IUser): Promise<IUser> {
    userData.password = 'new secure password';
    return UserApi.createOne(userData);
  }

  public static async updateOne(id: any, userData: IUser): Promise<any> {
    return UserApi.updateOne(id, userData);
  }

  public static async deleteOne(id: any) {
    return UserApi.deleteOne(id);
  }
}
