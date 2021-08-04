import { Types, Query } from 'mongoose';
import { UserModel } from '../models/User';
import { IUser } from '../../interfaces';

export default class UserDbApi {
  public static getById(_id: Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(_id)
      .lean<IUser>()
      .exec();
  }

  public static getAll(): Promise<IUser[]> {
    return UserModel.find()
      .lean<IUser>()
      .exec();
  }

  public static createOne(userData: IUser): Promise<IUser> {
    const user = new UserModel(userData);
    return UserModel.create(user);
  }

  public static updateOne(id: Types.ObjectId, userData: IUser): Query<any> {
    return UserModel.updateOne({ _id: id }, { $set: userData });
  }

  public static deleteOne(id: Types.ObjectId) {
    return UserModel.findByIdAndDelete(id);
  }
}
