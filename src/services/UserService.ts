import { Types } from 'mongoose';
import User, { UserModel } from '../database/models/User';

export default class UserRepo {
  // contains critical information of the user
  public static findById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
      })
      .lean<User>()
      .exec();
  }

  public static findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email, status: true })
      .select('+email +password +roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true })
      .select('+roles')
      .populate({
        path: 'roles',
        match: { status: true },
        select: { code: 1 },
      })
      .lean<User>()
      .exec();
  }

  public static findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
    return UserModel.findOne({ _id: id, status: true }).lean<User>().exec();
  }

  public static async create(
    user: User,
  ): Promise<User> {
    const now = new Date();

    // eslint-disable-next-line
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    return createdUser.toObject();
  }

  public static async update(
    user: User,
  ): Promise<User> {
    user.updatedAt = new Date();
    await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
    return user;
  }

  public static updateInfo(user: User): Promise<any> {
    user.updatedAt = new Date();
    return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
      .lean()
      .exec();
  }
}
