import express, { Request, Response } from 'express';
import { SuccessResponse } from '../../handlers/ApiResponse';
import UserService from '../../services/UserService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './userSchema';
import asyncHandler from '../../helpers/asyncHandler';
import { User } from '../../databases/mongodb/models/User';

const router = express.Router();

router.post(
  '/',
  validator(schema.body, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body;
    const user = await UserService.createOne(userData);
    return SuccessResponse(res, 200, user);
  }),
);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserService.getAll();
    return SuccessResponse(res, 200, users);
  }),
);

router.get(
  '/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.getById(req.params.id);
    return SuccessResponse(res, 404, user);
  }),
);

router.put(
  '/:id',
  validator(schema.id, ValidationSource.PARAM),
  validator(schema.body, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const userData: User = req.body;
    await UserService.updateOne(req.params.id, userData);
    return SuccessResponse(res, 200);
  }),
);

router.delete(
  '/:id',
  validator(schema.id, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteOne(req.params.id);
    return SuccessResponse(res, 200);
  }),
);

export default router;
