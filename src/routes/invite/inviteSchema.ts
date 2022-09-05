import Joi from '@hapi/joi';
import { JoiValidId } from '../../helpers/validator';

export default {
  post: Joi.object().keys({
    offer: JoiValidId().required(),
    user: JoiValidId().required(),
    inviter: Joi.string().valid('user', 'company').required(),
  }),
  put: Joi.object().keys({
    // name: Joi.string().min(2).max(100).trim(),
    // link: Joi.string().uri().max(100).trim(),
    // employees: Joi.array().items(JoiValidId()),
  }),
};
