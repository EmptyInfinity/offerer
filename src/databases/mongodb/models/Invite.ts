import { model, Schema, Document } from 'mongoose';
import { IInvite } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'Invites';
export const COLLECTION_NAME = 'invites';
export interface InviteDocument extends IInvite, Document { }

const schema = new Schema(
  {
    inviter: {
      type: Types.String,
      enum: ['user', 'company'],
      required: true,
    },
    offer: {
      type: Types.ObjectId,
      ref: 'Offer',
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    expireDate: {
      type: Types.Date,
      require: true,
    },
  },
  {
    versionKey: false,
  },
);

// @ts-ignore
if (!schema.options.toObject) schema.options.toObject = {};
// @ts-ignore
schema.options.toObject.transform = function (doc, obj, options) {
  obj.id = obj._id.toString();
  obj.offer = obj.offer.toString();
  obj.user = obj.user.toString();
  obj.company = obj.company.toString();
  delete obj._id;
  return obj;
};

export const InviteModel = model<InviteDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
