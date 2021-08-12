import express, { Request, Response } from 'express';
import { SuccessResponse } from '../../handlers/ApiResponse';
import UserService from '../../services/UserService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './userSchema';
import asyncHandler from '../../helpers/asyncHandler';
import { IUser } from '../../databases/interfaces';

const router = express.Router();

/* CRUD */
router.post(
  '/',
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const userData: IUser = req.body;
    const user = await UserService.createOne(userData);
    return SuccessResponse(res, 200, user);
  }),
);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const users: IUser[] = await UserService.getAll();
    return SuccessResponse(res, 200, users);
  }),
);

router.get(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const user: IUser = await UserService.getById(req.params.id);
    return SuccessResponse(res, 200, user);
  }),
);

router.put(
  '/:id',
  validator(null, ValidationSource.PARAM),
  validator(schema.put, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const userData: IUser = req.body;
    await UserService.updateById(req.params.id, userData);
    return SuccessResponse(res, 200);
  }),
);

router.delete(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteById(req.params.id);
    return SuccessResponse(res, 200);
  }),
);
/* CRUD */

router.delete(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteAll();
    return SuccessResponse(res, 200);
  }),
);

router.post(
  '/:userId/companies/:companyId/join',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.joinCompany(req.params.userId, req.params.companyId);
    return SuccessResponse(res, 200);
  }),
);

export default router;
