import { parseInt } from 'lodash';
import { model, Schema, Document } from 'mongoose';
import { IOffer } from '../../interfaces';

const { Types } = Schema;
export const DOCUMENT_NAME = 'Offer';
export const COLLECTION_NAME = 'offers';
export interface OfferDocument extends IOffer, Document { }
const { OFFER_MIN_PRICE = '0', OFFER_MAX_PRICE = '10000' } = process.env;
const offerMinPrice = parseInt(OFFER_MIN_PRICE);
const offerMaxPrice = parseInt(OFFER_MAX_PRICE);

const schema = new Schema(
  {
    name: {
      type: Types.String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    salary: {
      type: Types.Number,
      required: true,
      min: offerMinPrice,
      max: offerMaxPrice,
    },
    description: {
      type: Types.String,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
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
  obj.company = obj.company.toString();
  delete obj._id;
  return obj;
};

export const OfferModel = model<OfferDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
