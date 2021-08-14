import express, { Request, Response } from 'express';
import Accessor from '../../helpers/Accessor';
import { SuccessResponse } from '../../handlers/ApiResponse';
import CompanyService from '../../services/CompanyService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './companySchema';
import asyncHandler from '../../helpers/asyncHandler';
import { ICompany } from '../../databases/interfaces';
import verifyToken from '../../helpers/verifyToken';

const router = express.Router();

/* CRUD */
router.post(
  '/',
  verifyToken,
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserCreateCompany(req);
    const company = await CompanyService.createOne(req.body);
    return SuccessResponse(res, 200, company);
  }),
);

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const companies: ICompany[] = await CompanyService.getAll();
    return SuccessResponse(res, 200, companies);
  }),
);

router.get(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    const company: ICompany = await CompanyService.getById(req.params.id);
    return SuccessResponse(res, 200, company);
  }),
);

router.put(
  '/:id',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  validator(schema.put, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserUpdateCompany(req);
    await CompanyService.updateById(req.params.id, req.body);
    return SuccessResponse(res, 200);
  }),
);

router.delete(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserDeleteCompany(req);
    await CompanyService.deleteById(req.params.id);
    return SuccessResponse(res, 200);
  }),
);
/* CRUD END */

router.post(
  '/invite/:userId',
  verifyToken,
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    Accessor.canUserInviteToCompany(req);
    await CompanyService.inviteUserToCompany(req.params.userId, req.user.company);
    return SuccessResponse(res, 200);
  }),
);

export default router;
