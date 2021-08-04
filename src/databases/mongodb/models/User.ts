import { model, Schema, Document } from 'mongoose';
import { USER_ROLE } from '../../../config';

const { Types } = Schema;
export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export interface User extends Document {
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

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
