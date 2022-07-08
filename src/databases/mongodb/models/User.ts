import { model, Schema, Document } from 'mongoose';
import { USER_ROLE } from '../../../config';
import { IUser } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';
export interface UserDocument extends IUser, Document { }

const schema = new Schema(
  {
    name: {
      type: Types.String,
      required: true,
      trim: true,
      maxlength: 60,
    },
    email: {
      type: Types.String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 60,
    },
    password: {
      type: Types.String,
      select: false,
      required: true,
    },
    skills: [{
      type: Types.String,
      trim: true,
      maxlength: 30,
    }],
    bio: {
      type: Types.String,
      trim: true,
      maxlength: 500,
    },
    role: {
      type: Types.String,
      enum: Object.values(USER_ROLE),
      required: true,
    },
  },
  {
    versionKey: false,
  },
);
schema.set('toJSON', {
  virtuals: true,
  transform(doc, ret) { delete ret._id; },
});
schema.post('save', (error: any, { email }: UserDocument, next: any) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error(`Email "${email}" is already in use!`));
  } else {
    next();
  }
});

export const UserModel = model<UserDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
