import { model, Schema, Document } from 'mongoose';
import { USER_ROLE } from '../../../config';
import { IUser } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';
export interface UserDocument extends IUser, Document {}

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
      maxlength: 100,
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
    company: {
      type: Types.ObjectId,
      ref: 'Company',
    },
    offers: [{
      type: Types.ObjectId,
      ref: 'Offer',
    }],
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
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(`Email "${email}" is already in use!`));
  } else {
    next();
  }
});

export const UserModel = model<UserDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
