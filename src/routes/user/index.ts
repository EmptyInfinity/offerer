import express, { Response } from 'express';
import { Types } from 'mongoose';
import _ from 'lodash';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../services/UserService';
import { BadRequestError } from '../../core/ApiError';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import authentication from '../../auth/authentication';

const b = 4;
const router = express.Router();

router.get(
  '/public/id/:id',
  validator(schema.userId, ValidationSource.PARAM),
  asyncHandler(async (req: any, res: Response) => {
    const user = await UserRepo.findPublicProfileById(new Types.ObjectId(req.params.id));
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', _.pick(user, ['name', 'profilePicUrl'])).send(res);
  }),
);

/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/my',
  asyncHandler(async (req: any, res: Response) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    return new SuccessResponse('success', _.pick(user, ['name', 'profilePicUrl', 'roles'])).send(
      res,
    );
  }),
);

router.put(
  '/',
  validator(schema.profile),
  asyncHandler(async (req: any, res: Response) => {
    const user = await UserRepo.findProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.name) user.name = req.body.name;
    if (req.body.profilePicUrl) user.profilePicUrl = req.body.profilePicUrl;

    await UserRepo.updateInfo(user);
    return new SuccessResponse(
      'Profile updated',
      _.pick(user, ['name', 'profilePicUrl', 'roles']),
    ).send(res);
  }),
);

export default router;
