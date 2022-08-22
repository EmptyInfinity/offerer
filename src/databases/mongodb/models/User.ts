import { model, Schema, Document } from 'mongoose';
import { IUser } from '../../interfaces';
import { DuplicatedFieldError } from '../../common';

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
      select: false,
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
    offers: [{
      type: Schema.Types.ObjectId,
      ref: 'Offer',
    }],
    bio: {
      type: Types.String,
      trim: true,
      maxlength: 500,
    },
    isAdmin: {
      type: Types.Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.post('save', (error: any, { email }: UserDocument, next: any) => {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new DuplicatedFieldError(`Email "${email}" is already in use!`));
  } else {
    next();
  }
});

// @ts-ignore
if (!schema.options.toObject) schema.options.toObject = {};
// @ts-ignore
schema.options.toObject.transform = function (doc, ret, options) {
  ret.id = ret._id.toString();
  delete ret._id;
  return ret;
};

export const UserModel = model<UserDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
