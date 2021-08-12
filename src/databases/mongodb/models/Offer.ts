import { parseInt } from 'lodash';
import { model, Schema, Document } from 'mongoose';
import { IOffer } from '../../interfaces';


const { Types } = Schema;
export const DOCUMENT_NAME = 'Offer';
export const COLLECTION_NAME = 'offers';
export interface OfferDocument extends IOffer, Document {}
const offerNameEnum = JSON.parse(process.env.OFFERS_ARRAY);
const { OFFER_MIN_PRICE = '0', OFFER_MAX_PRICE = '10000' } = process.env;
const offerMinPrice = parseInt(OFFER_MIN_PRICE);
const offerMaxPrice = parseInt(OFFER_MAX_PRICE);

const schema = new Schema(
  {
    name: {
      type: Types.String,
      enum: offerNameEnum,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    price: {
      type: Types.Number,
      required: true,
      min: offerMinPrice,
      max: offerMaxPrice,
    },
    description: {
      type: Types.String,
      trim: true,
      minlength: 10,
      maxlength: 200,
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

export const OfferModel = model<OfferDocument>(DOCUMENT_NAME, schema, COLLECTION_NAME);
