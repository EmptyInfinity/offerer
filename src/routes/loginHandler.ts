import express, { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';
import { compare } from 'bcrypt';
import { SuccessResponse } from '../handlers/ApiResponse';
import { BadRequestError } from '../handlers/ApiError';
import asyncHandler from '../helpers/asyncHandler';
import validator, { ValidationSource } from '../helpers/validator';
import UserService from '../services/UserService';
import { createToken } from '../helpers';

const loginSchema = {
  data: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const router = express.Router();

router.post(
  '/',
  validator(loginSchema.data, ValidationSource.BODY),
  // eslint-disable-next-line consistent-return
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.getUserByEmailWithPassword(req.body.email);
    if (!user) {
      return next(new BadRequestError('Password or email is wrong'));
    }
    const isPasswordCorrect = await compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      return next(new BadRequestError('Password or email is wrong'));
    }
    const token = createToken(user.id);
    res.set({ 'auth-token': token });
    SuccessResponse(res, 200);
  }),
);

export default router;
