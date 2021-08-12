import { Types } from 'mongoose';
import { UserModel } from '../models/User';
import { IUser } from '../../interfaces';
import { normalized } from '../index';

export default class UserDbApi {
  /* CRUD */
  public static createOne(userData: IUser): Promise<IUser> {
    const user = new UserModel(userData);
    return UserModel.create(user);
  }

  public static async getById(id: Types.ObjectId): Promise<IUser | undefined> {
    const user: IUser | undefined = await UserModel.findById(id).lean<IUser>()
      .populate('company', '-_id').populate('offers', '-_id');
    return normalized(user);
  }

  public static async getAll(): Promise<IUser[]> {
    const users: IUser[] = await UserModel.find().lean<IUser>()
      .populate('offers', '-_id -description');
    return users.map((user: IUser) => normalized(user));
  }

  public static updateById(id: Types.ObjectId, userData: IUser): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { $set: userData }, { new: true }).exec();
  }

  public static deleteById(id: Types.ObjectId): Promise<IUser> {
    return UserModel.findByIdAndDelete(id).exec();
  }

  /* CRUD END */
  public static deleteAll(): Promise<any> {
    return UserModel.deleteMany({}).exec();
  }

  // public static inviteToCompany(userId: Types.ObjectId, companyId: Types.ObjectId): Promise<any> {
  // return UserModel.findByIdAndUpdate(userId, { $set: { company: companyId } }).exec();
  // }

  public static joinCompany(userId: Types.ObjectId, companyId: Types.ObjectId): Promise<any> {
    return UserModel.findByIdAndUpdate(userId, { $set: { company: companyId } }).exec();
  }
}
