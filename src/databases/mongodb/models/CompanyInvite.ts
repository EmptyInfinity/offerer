import { model, Schema, Document } from 'mongoose';
import { ICompanyInvite } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'CompaniesInvites';
export const COLLECTION_NAME = 'companies_invites';
export interface CompanyInviteDocument extends ICompanyInvite, Document {}

const schema = new Schema(
  {
    company: {
      type: Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
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

export const CompanyInviteModel = model<CompanyInviteDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
