import { model, Schema, Document } from 'mongoose';
import { IInvite } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'Invites';
export const COLLECTION_NAME = 'invites';
export interface InviteDocument extends IInvite, Document { }

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

export const InviteModel = model<InviteDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
