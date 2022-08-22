import Joi from '@hapi/joi';
import { JoiValidId } from '../../helpers/validator';


export default {
  post: Joi.object().keys({
    name: Joi.string().min(2).max(100).trim()
      .required(),
    link: Joi.string().uri().max(100).trim(),
    employees: Joi.array().items(JoiValidId()),
  }),
  put: Joi.object().keys({
    name: Joi.string().min(2).max(100).trim()
      .required(),
    link: Joi.string().uri().max(100).trim(),
    employees: Joi.array().items(JoiValidId()),
  }),
};
