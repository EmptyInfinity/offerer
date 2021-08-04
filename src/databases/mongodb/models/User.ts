import { model, Schema, Document } from 'mongoose';
import { USER_ROLE } from '../../../config';
import { IUser } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';
export interface UserDocument extends IUser, Document {
  name: string;
  email: string;
  password?: string;
  role: USER_ROLE
}

const schema = new Schema(
  {
    name: {
      type: Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: Types.String,
      select: false,
      required: true,
    },
    role: {
      type: Types.String,
      required: true,
      enum: Object.values(USER_ROLE),
    },
  },
  {
    versionKey: false,
  },
);
schema.set('toJSON', {
  transform(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});
schema.post('save', (error: any, { email }: UserDocument, next: any) => {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(`Email "${email}" is already in use!`));
  } else {
    next();
  }
});

export const UserModel = model<UserDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
