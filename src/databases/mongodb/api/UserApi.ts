import { Types } from 'mongoose';
import { UserModel } from '../models/User';
import { IUser } from '../../interfaces';
import { toJS } from '../index';

export default class UserDbApi {
  /* CRUD */
  public static async createOne(userData: IUser): Promise<IUser> {
    return UserModel.create(userData).then((doc) => doc && doc.toObject());
  }

  public static async getById(id: Types.ObjectId): Promise<IUser | null> {
    return UserModel.findById(id).then((doc) => doc && doc.toObject());
  }

  public static async getAll(): Promise<IUser[]> {
    // const users: IUser[] = await UserModel.find().lean<IUser>()
    //   .populate('offers', '-_id -description');
    // return users.map((user: IUser) => normalized(user));
    return UserModel.find().lean();
  }

  public static async updateById(id: Types.ObjectId, userData: IUser): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(id, { $set: userData }, { new: true }).then((doc) => doc && doc.toObject());
  }

  public static async deleteById(id: Types.ObjectId): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id).exec();
  }

  /* CRUD END */
  public static async deleteAll(): Promise<any> {
    return UserModel.deleteMany({}).exec();
  }

  // public static async joinCompany(userId: Types.ObjectId, companyId: Types.ObjectId): Promise<IUser | null> {
  //   return UserModel.findByIdAndUpdate(userId, { $set: { company: companyId } }).exec();
  // }

  public static async getUserByEmailWithPassword(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email }).select('+password').then((doc) => doc && doc.toObject());
  }
}
