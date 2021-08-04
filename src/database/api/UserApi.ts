import { Types, Query } from 'mongoose';
import { User, UserModel } from '../models/User';

export default class UserDbApi {
  public static getById(_id: Types.ObjectId): Promise<User | null> {
    return UserModel.findById(_id)
      .lean<User>()
      .exec();
  }

  public static getAll(): Promise<User[]> {
    return UserModel.find()
      .lean<User>()
      .exec();
  }

  public static createOne(userData: User): Promise<User> {
    const user = new UserModel(userData);
    return UserModel.create(user);
  }

  public static updateOne(id: Types.ObjectId, userData: User): Query<any> {
    return UserModel.updateOne({ _id: id }, { $set: userData });
  }

  public static deleteOne(id: Types.ObjectId) {
    return UserModel.findByIdAndDelete(id);
  }
}
