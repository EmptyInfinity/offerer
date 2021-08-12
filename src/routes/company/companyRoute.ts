import express, { Request, Response } from 'express';
import { SuccessResponse } from '../../handlers/ApiResponse';
import CompanyService from '../../services/CompanyService';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './companySchema';
import asyncHandler from '../../helpers/asyncHandler';
import { ICompany } from '../../databases/interfaces';

const router = express.Router();

/* CRUD */
router.post(
  '/',
  validator(schema.post, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const companyData: ICompany = req.body;
    const company = await CompanyService.createOne(companyData);
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
  validator(null, ValidationSource.PARAM),
  validator(schema.put, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response) => {
    const companyData: ICompany = req.body;
    await CompanyService.updateById(req.params.id, companyData);
    return SuccessResponse(res, 200);
  }),
);

router.delete(
  '/:id',
  validator(null, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response) => {
    await CompanyService.deleteById(req.params.id);
    return SuccessResponse(res, 200);
  }),
);
/* CRUD END */

export default router;
