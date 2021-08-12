import { model, Schema, Document } from 'mongoose';
import { ICompany } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'Company';
export const COLLECTION_NAME = 'companies';
export interface CompanyDocument extends ICompany, Document {}

const schema = new Schema(
  {
    name: {
      type: Types.String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100,
    },
    link: {
      type: Types.String,
      unique: true,
      maxlength: 100,
    },
    workers: [{
      type: Types.ObjectId,
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
