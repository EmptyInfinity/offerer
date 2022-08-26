import express, { Request, Response } from 'express';
import Accessor from '../../helpers/Accessor';
import { SuccessResponse } from '../../handlers/ApiResponse';
import CompanyService from '../../services/CompanyService';
import OfferService from '../../services/OfferService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './offerSchema';
import asyncHandler from '../../helpers/asyncHandler';
import { ICompany } from '../../databases/interfaces';
import verifyToken from '../../helpers/verifyToken';

const router = express.Router({ mergeParams: true });

/* CRUD */
router.post(
  '/',
  verifyToken,
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const [userId, companyId, offerId] = [req.user.id, req.params.companyId, req.params.id];
    await Accessor.canUserCreateOffer(userId, companyId);
    const offer = await OfferService.createOne(req.body, companyId);
    return SuccessResponse(res, 200, offer);
  }),
);

router.get(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const offer = await OfferService.getById(req.params.id);
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
    const updatedOffer = await OfferService.updateById(offerId, req.body);
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
    const deletedOffer = await OfferService.deleteById(offerId);
    return SuccessResponse(res, 200, deletedOffer);
  }),
);
/* CRUD END */

export default router;
