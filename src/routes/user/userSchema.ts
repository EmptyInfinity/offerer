import Joi from '@hapi/joi';
import { USER_ROLE } from '../../config';

const validUserRoles = Object.keys(USER_ROLE);
const validPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,50}$';

export default {
  post: Joi.object().keys({
    name: Joi.string().required().min(2).max(100)
      .trim(),
    email: Joi.string().required().email().max(100)
      .trim(),
    role: Joi.string().required().valid(...validUserRoles),
    password: Joi.string().min(8).max(50).regex(RegExp(validPassword))
      .required()
      .trim()
      .messages({
        'string.pattern.base': '"password" should contain at least one capital letter and one number',
      }),
  }),
  put: Joi.object().keys({
    name: Joi.string().min(2).max(100)
      .trim(),
    bio: Joi.string().max(500),
  }),
};
