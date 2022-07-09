import {
  model, Schema, Document, Types,
} from 'mongoose';
import { USER_COMPANY_ROLE } from '../../../config';
import { ICompany } from '../../interfaces';

export const DOCUMENT_NAME = 'Company';
export const COLLECTION_NAME = 'companies';
export interface CompanyDocument extends ICompany, Document { }

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    link: {
      type: Schema.Types.String,
      unique: true,
      maxlength: 100,
    },
    description: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 500,
    },
    workers: [{
      role: {
        type: Schema.Types.String,
        enum: Object.values(USER_COMPANY_ROLE),
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
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

export const CompanyModel = model<CompanyDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
