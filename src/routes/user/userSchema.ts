import Joi from '@hapi/joi';
import { JoiValidId } from '../../helpers/validator';
import { USER_ROLE, OFFER_NAME } from '../../config';

const validUserRoles = Object.keys(USER_ROLE);
const offerNameEnum = JSON.parse(process.env.OFFERS_ARRAY);
const { OFFER_MIN_PRICE = '0', OFFER_MAX_PRICE = '10000' } = process.env;
const offerMinPrice = parseInt(OFFER_MIN_PRICE);
const offerMaxPrice = parseInt(OFFER_MAX_PRICE);

export default {
  post: Joi.object().keys({
    name: Joi.string().required().min(2).max(100)
      .trim(),
    email: Joi.string().required().email().max(100)
      .trim(),
    role: Joi.string().required().valid(...validUserRoles),
    company: JoiValidId(),
    offers: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required().min(5).max(100)
          .trim()
          .valid(...offerNameEnum),
        description: Joi.string().min(10).max(200).trim(),
        price: Joi.number().required().min(offerMinPrice).max(offerMaxPrice),
      }),
    ),
  }),
  put: Joi.object().keys({
    name: Joi.string().min(2).max(100)
      .trim(),
    role: Joi.string().required().valid(...validUserRoles),
  }),
};
