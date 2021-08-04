import { NotFoundError } from '../handlers/ApiError';
import { User } from '../database/models/User';
import UserApi from '../database/api/UserApi';

export default class UserService {
  public static async getById(id: any): Promise<User | null> {
    const user = await UserApi.getById(id);
    if (!user) throw new NotFoundError('User not found!');
    return user;
  }

  public static async getAll(): Promise<User[]> {
    return UserApi.getAll();
  }

  public static async createOne(userData: User): Promise<User> {
    userData.password = 'new secure password';
    return UserApi.createOne(userData);
  }

  public static async updateOne(id: any, userData: User): Promise<any> {
    return UserApi.updateOne(id, userData);
  }

  public static async deleteOne(id: any) {
    return UserApi.deleteOne(id);
  }
}
