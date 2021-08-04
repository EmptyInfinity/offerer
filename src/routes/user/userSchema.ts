import Joi from '@hapi/joi';
import { id } from '../../helpers/validator';
import { USER_ROLE } from '../../config';

const validUserRoles = Object.keys(USER_ROLE);

export default {
  id: Joi.object().keys({
    id: id().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(128),
    email: Joi.string().required().email(),
    role: Joi.string().required().valid(...validUserRoles),
  }),
};
