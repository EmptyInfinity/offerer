import express, { Request, Response } from 'express';
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

const router = express.Router({ mergeParams: true });

/* CRUD */
router.post(
  '/',
  verifyToken,
  // validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    console.log(1, req.params, req.body, req.url);
    // const [userId, companyId] = [req.user.id, req.params.companyId];
    // await Accessor.canUserCreateOffer(userId, companyId);
    // const offer = await OfferService.createOne(req.body, companyId);
    return SuccessResponse(res, 200, {});
  }),
);

router.get(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const [offerId, companyId] = [req.params.id, req.params.companyId];
    const offer = await OfferService.getByIdInCompany(offerId, companyId);
    return SuccessResponse(res, 200, offer);
  }),
);

router.put(
  '/:id',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  validator(schema.put, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const [userId, companyId, offerId, isAdmin] = [req.user.id, req.params.companyId, req.params.id, req.user.isAdmin];
    await Accessor.canUserUpdateOffer(userId, companyId, isAdmin);
    const updatedOffer = await OfferService.updateByIdInCompany(offerId, req.body, companyId);
    return SuccessResponse(res, 200, updatedOffer);
  }),
);

router.delete(
  '/:id',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const [userId, companyId, offerId, isAdmin] = [req.user.id, req.params.companyId, req.params.id, req.user.isAdmin];
    await Accessor.canUserDeleteOffer(userId, companyId, isAdmin);
    const deletedOffer = await OfferService.deleteByIdInCompany(offerId, companyId);
    return SuccessResponse(res, 200, deletedOffer);
  }),
);
/* CRUD END */

export default router;
