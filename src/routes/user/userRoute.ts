import express, { Request, Response } from 'express';
import { SuccessResponse } from '../../handlers/ApiResponse';
import UserService from '../../services/UserService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './userSchema';
import { IUser } from '../../databases/interfaces';
import { createToken } from '../../helpers';
import verifyToken from '../../helpers/verifyToken';
import asyncHandler from '../../helpers/asyncHandler';
import Accessor from '../../helpers/Accessor';

const router = express.Router();

/* CRUD */
router.post(
  '/',
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserService.createOne(req.body);
    const token = createToken(user.id);
    res.set({ 'auth-token': token });
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
  '/',
  verifyToken,
  validator(schema.put, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.updateById(req.user.id, req.body);
    return SuccessResponse(res, 200);
  }),
);

router.delete(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteById(req.user.id);
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
  '/joinCompany/:companyId',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserJoinCompany(req);
    await UserService.joinCompany(req.user.id, req.params.companyId);
    return SuccessResponse(res, 200);
  }),
);

router.post(
  '/leaveCompany',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserLeaveCompany(req);
    await UserService.leaveCompany(req.user.id);
    return SuccessResponse(res, 200);
  }),
);

export default router;
