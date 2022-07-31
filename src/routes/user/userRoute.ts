import express, { Request, Response } from 'express';
import { SuccessResponse } from '../../handlers/ApiResponse';
import UserService from '../../services/UserService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './userSchema';
import { IUser } from '../../databases/interfaces';
import verifyToken from '../../helpers/verifyToken';
import asyncHandler from '../../helpers/asyncHandler';
import Accessor from '../../helpers/Accessor';

const router = express.Router();

/* CRUD */
/**
 * @swagger
 * /users:
 *   post:
 *     description: Created user
 *     responses:
 *       200:
 *         description: created user
 */
router.post(
  '/',
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const reqUserToken = req.header('auth-token');
    Accessor.canUserCreateUser(reqUserToken);
    const { user, token } = await UserService.createOne(req.body);
    res.set({ 'auth-token': token });
    return SuccessResponse(res, 200, user);
  }),
);

/**
 * @swagger
 * /users:
 *   get:
 *     description: Returns list of all users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get(
  '/',
  verifyToken,
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserGetAllUsers(req.user.isAdmin);
    const users: IUser[] = await UserService.getAll();
    return SuccessResponse(res, 200, users);
  }),
);

/**
 * @swagger
 * /users/:id:
 *   get:
 *     description: Returns list of all users
 *     responses:
 *       200:
 *         description: A list of users
 *       404:
 *         description: User not found
 */
router.get(
  '/:id',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const [reqUserId, targetUserId, isAdmin] = [req.user.id, req.params.id, req.user.isAdmin];
    Accessor.canUserGetUser(reqUserId, targetUserId, isAdmin);
    const user: IUser = await UserService.getById(req.params.id);
    return SuccessResponse(res, 200, user);
  }),
);

router.put(
  '/:id',
  verifyToken,
  validator(schema.put, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const [reqUserId, targetUserId, isAdmin] = [req.user.id, req.params.id, req.user.isAdmin];
    Accessor.canUserUpdateUser(reqUserId, targetUserId, isAdmin);
    const updatedUser = await UserService.updateById(targetUserId, req.body);
    return SuccessResponse(res, 200, updatedUser);
  }),
);

router.delete(
  '/:id',
  verifyToken,
  asyncHandler(async (req: Request, res: Response) => {
    const [reqUserId, targetUserId, isAdmin] = [req.user.id, req.params.id, req.user.isAdmin];
    Accessor.canUserDeleteUser(reqUserId, targetUserId, isAdmin);
    await UserService.deleteById(targetUserId);
    return SuccessResponse(res, 200);
  }),
);
/* CRUD */

router.delete( // DEV-only
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    await UserService.deleteAll();
    return SuccessResponse(res, 200);
  }),
);

router.post(
  '/join-company/:id',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const [companyId, userId] = [req.user.id, req.params.id];
    Accessor.canUserJoinCompany(companyId, userId);
    await UserService.joinCompany(userId, companyId);
    return SuccessResponse(res, 200);
  }),
);

router.post(
  '/leave-company',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    console.log('leave');
    // Accessor.canUserLeaveCompany(req);
    // await UserService.leaveCompany(req.user);
    return SuccessResponse(res, 200);
  }),
);

export default router;
