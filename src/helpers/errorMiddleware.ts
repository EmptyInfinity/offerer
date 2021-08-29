import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import Logger from '../handlers/Logger';
import { environment } from '../config';
import { MAX_IMAGE_SIZE_IN_BYTES } from './constants';
import { ApiError, InternalError, BadRequestError } from '../handlers/ApiError';

// eslint-disable-next-line consistent-return
export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else if (err instanceof MulterError) {
    if (err.message === 'File too large') {
      const message = `File should not exceed ${MAX_IMAGE_SIZE_IN_BYTES / 100}kb`;
      ApiError.handle(new BadRequestError(message), res);
    } else {
      if (environment === 'development') {
        Logger.error(err.message);
      }
      ApiError.handle(new InternalError(), res);
    }
  } else {
    ApiError.handle(new InternalError(err?.message), res);
  }
};
