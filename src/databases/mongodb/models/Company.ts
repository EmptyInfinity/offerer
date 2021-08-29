import {
  model, Schema, Document, Types,
} from 'mongoose';
import { ICompany } from '../../interfaces';

export const DOCUMENT_NAME = 'Company';
export const COLLECTION_NAME = 'companies';
export interface CompanyDocument extends ICompany, Document {
  workers: Types.ObjectId[]
}

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
    workers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
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
