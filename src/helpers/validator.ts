import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
import Logger from '../handlers/Logger';
import { BadRequestError } from '../handlers/ApiError';
import { dbDir } from '../config';

const dbPath = `../databases/${dbDir}`;
// eslint-disable-next-line import/no-dynamic-require
const { isValidId } = require(dbPath);

export enum ValidationSource {
  BODY = 'body',
  HEADER = 'headers',
  QUERY = 'query',
  PARAM = 'params',
}

export const id = () => Joi.string().custom((value: string, helpers) => {
  if (!isValidId(value)) return helpers.error('any.invalid');
  return value;
}, 'Object Id Validation');

export default (schema: Joi.ObjectSchema, source: ValidationSource = ValidationSource.BODY) => (
  req: Request,
  res: Response,
  next: NextFunction,
// eslint-disable-next-line consistent-return
) => {
  try {
    const { error } = schema.validate(req[source]);
    if (!error) return next();

    Logger.error(error.details[0].message);
    next(new BadRequestError(error.details[0].message));
  } catch (error) {
    next(error);
  }
};
