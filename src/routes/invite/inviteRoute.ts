import express, { Request, Response } from 'express';
import { ForbiddenError, NotFoundError } from '../../handlers/ApiError';
import Accessor from '../../helpers/Accessor';
import { SuccessResponse } from '../../handlers/ApiResponse';
import CompanyService from '../../services/CompanyService';
import OfferService from '../../services/OfferService';
import InviteService from '../../services/InviteService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './inviteSchema';
import asyncHandler from '../../helpers/asyncHandler';
import { ICompany } from '../../databases/interfaces';
import verifyToken from '../../helpers/verifyToken';
import UserService from '../../services/UserService';

const router = express.Router({ mergeParams: true });

/* CRUD */
router.post(
  '/',
  verifyToken,
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const [reqUserId, companyId, targetUserId] = [req.user.id, req.params.companyId, req.body.user];
    const { inviter, offer } = req.body;
    if (inviter === 'company') {
      await Accessor.canUserInviteUserToCompanyByOffer(reqUserId, targetUserId, companyId, offer);
    } else {
      await Accessor.canUserJoinCompanyByOffer(targetUserId, companyId, offer);
    }
    const invite = await InviteService.createOne(req.body, companyId);
    return SuccessResponse(res, 200, invite);
  }),
);

router.get(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const invite = await InviteService.getById(req.params.id);
    await Accessor.canUserGetInvite(req.user.id, invite.user, req.params.companyId);
    return SuccessResponse(res, 200, invite);
  }),
);

// router.delete(
//   '/:id',
//   verifyToken,
//   validator(null, ValidationSource.PARAM),
//   asyncHandler(async (req: Request, res: Response) => {
//     const [userId, companyId, offerId, isAdmin] = [req.user.id, req.params.companyId, req.params.id, req.user.isAdmin];
//     await Accessor.canUserDeleteOffer(userId, companyId, isAdmin);
//     const deletedOffer = await OfferService.deleteByIdInCompany(offerId, companyId);
//     return SuccessResponse(res, 200, deletedOffer);
//   }),
// );
/* CRUD END */

export default router;
