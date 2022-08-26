import Joi from '@hapi/joi';

const { OFFER_MIN_PRICE = '0', OFFER_MAX_PRICE = '10000' } = process.env;
const offerMinPrice = parseInt(OFFER_MIN_PRICE);
const offerMaxPrice = parseInt(OFFER_MAX_PRICE);

export default {
  post: Joi.object().keys({
    name: Joi.string().min(2).max(200).trim()
      .required(),
    salary: Joi.number().min(offerMinPrice).max(offerMaxPrice)
      .required(),
    description: Joi.string().min(10).max(500).trim(),
  }),
  put: Joi.object().keys({
    name: Joi.string().min(2).max(200).trim(),
    salary: Joi.number().min(offerMinPrice).max(offerMaxPrice),
    description: Joi.string().min(10).max(500).trim(),
  }),
};
